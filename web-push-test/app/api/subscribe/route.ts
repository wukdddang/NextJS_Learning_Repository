import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const subscription = await req.json();

    // Supabase에 구독 정보 저장
    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert({
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "구독이 저장되었습니다.",
      subscription: data,
    });
  } catch (error) {
    console.error("구독 저장 실패:", error);
    return NextResponse.json({ error: "구독 저장 실패" }, { status: 500 });
  }
}

// 저장된 구독 정보 조회
export async function GET() {
  try {
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error) throw error;

    // Supabase에서 가져온 데이터를 PushSubscription 형식으로 변환
    const formattedSubscriptions = subscriptions.map((sub) => ({
      endpoint: sub.endpoint,
      keys: {
        auth: sub.auth,
        p256dh: sub.p256dh,
      },
    }));

    return NextResponse.json({ subscriptions: formattedSubscriptions });
  } catch (error) {
    console.error("구독 정보 조회 실패:", error);
    return NextResponse.json({ error: "구독 정보 조회 실패" }, { status: 500 });
  }
}
