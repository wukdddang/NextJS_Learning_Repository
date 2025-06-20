import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { deleteSession } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (sessionId) {
      // Redis에서 세션 삭제
      await deleteSession(sessionId);
    }

    // 쿠키 삭제
    const cookie = serialize("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // 즉시 만료
      path: "/",
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    const response = NextResponse.json({ success: true });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 모든 기기에서 로그아웃
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("sessionId")?.value;

    if (sessionId) {
      // 현재 세션에서 사용자 정보 가져오기
      const { getSession, deleteAllUserSessions } = await import("@/lib/redis");
      const sessionData = await getSession(sessionId);

      if (sessionData?.user?.id) {
        // 해당 사용자의 모든 세션 삭제
        await deleteAllUserSessions(sessionData.user.id);
      }
    }

    // 쿠키 삭제
    const cookie = serialize("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
      domain: process.env.COOKIE_DOMAIN || undefined,
    });

    const response = NextResponse.json({
      success: true,
      message: "Logged out from all devices",
    });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Logout all error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
