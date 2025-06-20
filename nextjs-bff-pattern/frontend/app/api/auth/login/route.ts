import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { z } from "zod";
import { authenticateUser } from "@/lib/users";
import {
  createAccessToken,
  createRefreshToken,
  generateSessionId,
} from "@/lib/auth";
import { setSession } from "@/lib/redis";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 요청 데이터 검증
    const { email, password } = loginSchema.parse(body);

    // 사용자 인증
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 토큰 생성
    const accessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken({ userId: user.id });

    // 세션 생성
    const sessionId = generateSessionId();
    const sessionData = {
      accessToken,
      refreshToken,
      user,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    // Redis에 세션 저장 (1시간)
    await setSession(sessionId, sessionData, 3600);

    // 세션 쿠키 설정
    const cookie = serialize("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1시간
      path: "/",
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
