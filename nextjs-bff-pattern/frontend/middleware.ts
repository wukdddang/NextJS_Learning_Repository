import { NextRequest, NextResponse } from "next/server";
import { getSession, setSession, updateSessionExpiry } from "@/lib/redis";
import {
  isTokenExpired,
  willExpireSoon,
  createAccessToken,
  verifyToken,
} from "@/lib/auth";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  sessionId?: string;
}

// 인증이 필요한 요청을 검증하고 세션을 관리하는 미들웨어
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // 세션 데이터 조회
    const sessionData = await getSession(sessionId);
    if (!sessionData) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 액세스 토큰 검증 및 갱신
    let { accessToken, refreshToken, user } = sessionData;

    if (isTokenExpired(accessToken)) {
      // 리프레시 토큰으로 새 액세스 토큰 생성
      const refreshPayload = await verifyToken(refreshToken);
      if (!refreshPayload || refreshPayload.userId !== user.id) {
        return NextResponse.json(
          { error: "Invalid refresh token" },
          { status: 401 }
        );
      }

      // 새 액세스 토큰 생성
      accessToken = await createAccessToken(user);

      // 세션 업데이트
      await setSession(
        sessionId,
        {
          ...sessionData,
          accessToken,
          lastAccessedAt: new Date().toISOString(),
        },
        3600
      );

      console.log(`Token refreshed for user ${user.id}`);
    } else if (willExpireSoon(accessToken)) {
      // 토큰이 곧 만료되면 백그라운드에서 갱신
      Promise.resolve().then(async () => {
        try {
          const newAccessToken = await createAccessToken(user);
          await setSession(
            sessionId,
            {
              ...sessionData,
              accessToken: newAccessToken,
              lastAccessedAt: new Date().toISOString(),
            },
            3600
          );
          console.log(`Token pre-refreshed for user ${user.id}`);
        } catch (error) {
          console.error("Background token refresh failed:", error);
        }
      });
    } else {
      // 세션 만료 시간 연장
      await updateSessionExpiry(sessionId, 3600);
    }

    // 인증된 요청 객체 생성
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = user;
    authenticatedRequest.sessionId = sessionId;

    return await handler(authenticatedRequest);
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// 선택적 인증 미들웨어 (인증되지 않아도 접근 가능하지만 인증 정보는 제공)
export async function withOptionalAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;
    const authenticatedRequest = request as AuthenticatedRequest;

    if (sessionId) {
      const sessionData = await getSession(sessionId);
      if (sessionData && !isTokenExpired(sessionData.accessToken)) {
        authenticatedRequest.user = sessionData.user;
        authenticatedRequest.sessionId = sessionId;

        // 세션 만료 시간 연장
        await updateSessionExpiry(sessionId, 3600);
      }
    }

    return await handler(authenticatedRequest);
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    // 에러가 발생해도 요청은 계속 처리
    return await handler(request as AuthenticatedRequest);
  }
}
