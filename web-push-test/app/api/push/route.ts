import webpush from "web-push";

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
    const subscription = await req.json();

    const payload = JSON.stringify({
      title: "새로운 알림",
      body: "백그라운드에서 수신된 푸시 알림입니다.",
      url: "/",
    });

    await webpush.sendNotification(subscription, payload);

    return new Response("알림이 전송되었습니다.", { status: 200 });
  } catch (error) {
    return new Response("알림 전송 실패", { status: 500 });
  }
}
