import webpush from "web-push";
import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    // 구독 정보를 직접 받는 대신 저장된 모든 구독자에게 전송
    const { subscriptions } = await fetch("/api/subscribe").then((res) =>
      res.json()
    );

    const payload = JSON.stringify({
      title: "새로운 알림",
      body: "백그라운드에서 수신된 푸시 알림입니다.",
      url: "/",
    });

    // 모든 구독자에게 알림 전송
    const results = await Promise.all(
      subscriptions.map((subscription: PushSubscription) =>
        webpush
          .sendNotification(subscription as any, payload)
          .catch((error) => ({ error, subscription }))
      )
    );

    const succeeded = results.filter((result) => !result.error).length;
    const failed = results.filter((result) => result.error).length;

    return NextResponse.json({
      message: `알림 전송 완료: 성공 ${succeeded}건, 실패 ${failed}건`,
    });
  } catch (error) {
    return NextResponse.json({ error: "알림 전송 실패" }, { status: 500 });
  }
}
