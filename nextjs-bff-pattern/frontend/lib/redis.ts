import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

// Redis 클라이언트 초기화
export async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    client.on("connect", () => {
      console.log("Connected to Redis");
    });

    await client.connect();
  }

  return client;
}

// 세션 저장
export async function setSession(
  sessionId: string,
  data: any,
  expireInSeconds = 3600
) {
  const redis = await getRedisClient();
  await redis.setEx(
    `session:${sessionId}`,
    expireInSeconds,
    JSON.stringify(data)
  );
}

// 세션 조회
export async function getSession(sessionId: string) {
  const redis = await getRedisClient();
  const data = await redis.get(`session:${sessionId}`);
  return data ? JSON.parse(data) : null;
}

// 세션 삭제
export async function deleteSession(sessionId: string) {
  const redis = await getRedisClient();
  await redis.del(`session:${sessionId}`);
}

// 세션 만료 시간 업데이트
export async function updateSessionExpiry(
  sessionId: string,
  expireInSeconds = 3600
) {
  const redis = await getRedisClient();
  await redis.expire(`session:${sessionId}`, expireInSeconds);
}

// 사용자의 모든 세션 조회 (다중 기기 로그인 관리용)
export async function getUserSessions(userId: string) {
  const redis = await getRedisClient();
  const keys = await redis.keys(`session:*`);
  const sessions = [];

  for (const key of keys) {
    const data = await redis.get(key);
    if (data) {
      const sessionData = JSON.parse(data);
      if (sessionData.user?.id === userId) {
        sessions.push({
          sessionId: key.replace("session:", ""),
          ...sessionData,
        });
      }
    }
  }

  return sessions;
}

// 사용자의 모든 세션 삭제 (로그아웃 시)
export async function deleteAllUserSessions(userId: string) {
  const sessions = await getUserSessions(userId);
  const redis = await getRedisClient();

  for (const session of sessions) {
    await redis.del(`session:${session.sessionId}`);
  }
}
