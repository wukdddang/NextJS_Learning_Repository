import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// JWT 토큰 생성
export async function createAccessToken(payload: User) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m") // 15분 만료
    .sign(secret);
}

export async function createRefreshToken(payload: { userId: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7일 만료
    .sign(secret);
}

// JWT 토큰 검증
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// 비밀번호 해시
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

// 세션 ID 생성
export function generateSessionId() {
  return crypto.randomUUID();
}

// 토큰 만료 확인
export function isTokenExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

// 토큰이 곧 만료되는지 확인 (5분 전)
export function willExpireSoon(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= (payload.exp - 300) * 1000; // 5분 전
  } catch {
    return true;
  }
}
