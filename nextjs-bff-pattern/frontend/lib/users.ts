import { hashPassword, verifyPassword, User } from "./auth";

// 실제 운영에서는 데이터베이스를 사용하세요
// 여기서는 시뮬레이션을 위한 메모리 저장소
const users: (User & { password: string })[] = [];

// 초기 테스트 사용자 생성
async function initializeTestUser() {
  if (users.length === 0) {
    const hashedPassword = await hashPassword("password123");
    users.push({
      id: "1",
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
    });

    users.push({
      id: "2",
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
    });
  }
}

// 사용자 생성
export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  await initializeTestUser();

  // 이메일 중복 확인
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    name,
    password: hashedPassword,
  };

  users.push(newUser);

  // 비밀번호 제외하고 반환
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

// 사용자 인증
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  await initializeTestUser();

  const user = users.find((u) => u.email === email);
  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  // 비밀번호 제외하고 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// ID로 사용자 조회
export async function getUserById(id: string): Promise<User | null> {
  await initializeTestUser();

  const user = users.find((u) => u.id === id);
  if (!user) {
    return null;
  }

  // 비밀번호 제외하고 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// 이메일로 사용자 조회
export async function getUserByEmail(email: string): Promise<User | null> {
  await initializeTestUser();

  const user = users.find((u) => u.email === email);
  if (!user) {
    return null;
  }

  // 비밀번호 제외하고 반환
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// 사용자 정보 업데이트
export async function updateUser(
  id: string,
  updates: Partial<Pick<User, "name" | "email">>
): Promise<User | null> {
  await initializeTestUser();

  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return null;
  }

  users[userIndex] = { ...users[userIndex], ...updates };

  // 비밀번호 제외하고 반환
  const { password: _, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
}
