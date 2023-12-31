"use server";

import { redirect } from "next/navigation";

import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

// 아래에 적는 모든 함수는 server actions가 된다.

// Next.js에서 form을 처리하는 방식.

// server action 생성. 서버에서만 실행하는 것을 보장함.
// 함수의 경우, 'use server'로 작성해주어야 서버에서만 실행되는 것을 보장함.

// 또한 async를 붙여줘야 함.
export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    meal.image.size === 0
  ) {
    // throw new Error("Invalid Input"); // 에러를 던지는 게 좋은 사용자 경험은 아님
    return {
      message: "Invalid Input.",
    };
  }

  await saveMeal(meal);
  // 원하는 url의 캐시를 업데이트한다. 중첩 경로는 안한다.
  // 캐시의 유효성을 재검사한다.(변화가 있을 때만 캐시를 업데이트한다.)
  // 두 번째 파라미터에 'page'를 주면 해당 페이지의 캐시를 업데이트한다.
  // 두 번째 파라미터에 'layout'을 주면 해당 레이아웃의 캐시를 업데이트한다. 즉 해당 레이아웃을 사용하는 하위 페이지들의 캐시를 업데이트한다.
  revalidatePath("/meals");
  redirect("/meals");
}
