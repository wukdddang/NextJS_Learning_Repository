import fs from "node:fs";

import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // throw new Error("Loading meals failed!");

  // run(): db에 데이터를 입력할 때
  // all(): db에서 여러 데이터를 가져올 때
  // get(): db에서 한 개(row)의 데이터를 가져올 때
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  // slug에는 사용자가 입력한 값이 들어올 수 있기 때문에
  // SQL Injection을 방지하기 위해 ?를 사용한다.

  // better-sqlite3의 db.prepare().get() 메서드를 사용해서 안전하게 데이터를 가져온다.
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop(); // 확장자 추출
  const fileName = `${meal.slug}.${extension}`; // 고유한 파일명 생성

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer(); // arrayBuffer() 메서드는 Promise를 반환한다.

  // 파일 쓰기 시작
  stream.write(Buffer.from(bufferedImage), (error) => {
    if (error) {
      throw new Error("Saving image failed!");
    }
  });

  // 이미지는 DB가 아닌 파일 시스템에 저장한다. (DB에는 이미지의 경로만 저장한다.)
  meal.image = `/images/${fileName}`;

  // better-sqlite3의 db.prepare().run() 메서드를 사용해서 안전하게 데이터를 저장한다.
  db.prepare(
    `
    INSERT INTO meals 
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `
  ).run(meal);
}
