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

  useEffect(() => {
    setIsSupported("Notification" in window);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

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
        <Alert variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            현재 환경에서는 서비스 워커를 지원하지 않아 기본 알림만 사용
            가능합니다.
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
