"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BellRing, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const [swSupported, setSwSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  // VAPID 공개키 (실제로는 환경변수로 관리해야 합니다)
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  useEffect(() => {
    setIsSupported("Notification" in window);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    // 서비스 워커 지원 여부 확인
    setSwSupported("serviceWorker" in navigator);

    // 서비스 워커 등록은 별도 함수로 분리
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("서비스 워커가 등록되었습니다:", registration);
        return registration;
      } catch (error) {
        console.error("서비스 워커 등록 실패:", error);
        throw error;
      }
    };

    // 푸시 구독 설정
    const setupPushSubscription = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        // 서비스 워커 등록 확인
        let registration = await navigator.serviceWorker.getRegistration();
        if (!registration) {
          registration = await registerServiceWorker();
        }

        // registration이 존재하는지 한번 더 확인
        if (!registration) {
          throw new Error("서비스 워커 등록 실패");
        }

        // 서비스 워커가 활성화될 때까지 대기
        if (registration.active === null) {
          await new Promise<void>((resolve) => {
            registration?.addEventListener("activate", () => resolve(), {
              once: true,
            });
          });
        }

        // VAPID 키 확인 및 변환
        if (!publicVapidKey) {
          throw new Error("VAPID 공개키가 설정되지 않았습니다.");
        }

        const applicationServerKey = urlBase64ToUint8Array(publicVapidKey);

        // 기존 구독 해제 (문제 해결을 위해 새로 구독)
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        // 새로운 구독 생성
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        });

        setSubscription(subscription);

        // 서버에 구독 정보 전송
        const response = await fetch("/api/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("서버 응답 오류: " + response.statusText);
        }

        console.log("푸시 알림 구독 완료:", subscription);
      } catch (error) {
        console.error("푸시 알림 구독 실패:", error);
        if (error instanceof Error) {
          console.error("에러 상세:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
        }
      }
    };

    if (permission === "granted") {
      setupPushSubscription();
    }
  }, [permission, publicVapidKey]);

  // Base64 문자열을 Uint8Array로 변환하는 유틸리티 함수
  const urlBase64ToUint8Array = (base64String: string) => {
    try {
      console.log("변환 전 VAPID 키:", base64String);
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      console.log("패딩 추가:", padding.length, "개");

      const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
      console.log("변환된 base64:", base64);

      const rawData = window.atob(base64);
      console.log("디코딩된 데이터 길이:", rawData.length);

      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      console.log("최종 Uint8Array 길이:", outputArray.length);
      return outputArray;
    } catch (error) {
      console.error("VAPID 키 변환 중 오류:", error);
      throw error;
    }
  };

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        new Notification("알림 활성화됨", {
          body: "알림이 성공적으로 활성화되었습니다.",
          icon: "/icon-192x192.png",
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification("테스트 알림", {
        body: "이것은 테스트 알림입니다.",
        icon: "/icon-192x192.png",
        // vibrate: [200, 100, 200],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md mx-auto pt-10 space-y-4">
        <Alert
          variant={swSupported ? "default" : "destructive"}
          className="mb-4"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {swSupported
              ? "서비스 워커가 지원되어 푸시 알림을 사용할 수 있습니다."
              : "현재 환경에서는 서비스 워커를 지원하지 않아 기본 알림만 사용 가능합니다."}
          </AlertDescription>
        </Alert>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-primary/10 rounded-full">
              <BellRing className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">알림 데모</h1>
          </div>

          {!isSupported ? (
            <div className="text-destructive mb-4">
              현재 브라우저에서 알림을 지원하지 않습니다.
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                {permission === "granted"
                  ? "알림이 활성화되어 있습니다!"
                  : permission === "denied"
                  ? "알림이 차단되어 있습니다. 브라우저 설정에서 허용해주세요."
                  : "알림을 활성화하여 업데이트를 받아보세요."}
              </p>

              <div className="space-y-4">
                <Button
                  className="w-full"
                  onClick={requestPermission}
                  disabled={permission === "granted" || permission === "denied"}
                >
                  {permission === "granted"
                    ? "알림 활성화됨"
                    : permission === "denied"
                    ? "알림 차단됨"
                    : "알림 활성화하기"}
                </Button>

                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={sendTestNotification}
                  disabled={permission !== "granted"}
                >
                  테스트 알림 보내기
                </Button>
              </div>

              {permission === "granted" && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h2 className="font-semibold mb-2">iOS 사용자 안내:</h2>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>홈 화면에 웹사이트 추가</li>
                    <li>홈 화면에서 앱 실행</li>
                    <li>알림 허용 요청시 허용</li>
                  </ol>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
