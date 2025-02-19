import webpush from "web-push";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// VAPID 키 설정
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  "mailto:dnr8874@naver.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST() {
  try {
    // Supabase에서 구독 정보 조회
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error) throw error;

    const payload = JSON.stringify({
      title: "새로운 알림",
      body: "백그라운드에서 수신된 푸시 알림입니다.",
      url: "/",
    });

    // 구독 정보를 PushSubscription 형식으로 변환하여 알림 전송
    const results = await Promise.all(
      subscriptions.map(async (sub) => {
        const subscription = {
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh,
          },
        };

        try {
          await webpush.sendNotification(subscription, payload);
          return { success: true, endpoint: sub.endpoint };
        } catch (error) {
          // 구독이 만료되었거나 더 이상 유효하지 않은 경우 삭제
          if (
            (error instanceof Error && error.message.includes("404")) ||
            (error instanceof Error && error.message.includes("410"))
          ) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("endpoint", sub.endpoint);
          }
          return { error, endpoint: sub.endpoint };
        }
      })
    );

    const succeeded = results.filter((result) => !result.error).length;
    const failed = results.filter((result) => result.error).length;

    return NextResponse.json({
      message: `알림 전송 완료: 성공 ${succeeded}건, 실패 ${failed}건`,
    });
  } catch (error) {
    console.error("알림 전송 실패:", error);
    return NextResponse.json({ error: "알림 전송 실패" }, { status: 500 });
  }
}
