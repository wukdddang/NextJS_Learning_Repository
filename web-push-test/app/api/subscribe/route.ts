import { NextResponse } from "next/server";

// 실제 운영환경에서는 데이터베이스에 저장해야 합니다
let subscriptions: PushSubscription[] = [];

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    // 중복 구독 방지
    const exists = subscriptions.find(
      (sub) => sub.endpoint === subscription.endpoint
    );

    if (!exists) {
      subscriptions.push(subscription);
    }

    return NextResponse.json({
      message: "구독이 저장되었습니다.",
      subscriptionsCount: subscriptions.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "구독 저장 실패" }, { status: 500 });
  }
}

// 저장된 구독 정보 조회용 (테스트용)
export async function GET() {
  return NextResponse.json({ subscriptions });
}
