import { start } from "repl";
import { z } from "zod";

// 클라이언트용 스키마
export const createApplicantClientSchema = z.object({
  name: z
    .string({ required_error: "이름을 입력해주세요." })
    .min(1, "이름은 필수입니다.")
    .max(255, "이름은 255자를 초과할 수 없습니다."),
  phone: z
    .string({ required_error: "전화번호를 입력해주세요." })
    .regex(/^\d{10,11}$/, "올바른 전화번호 형식이 아닙니다."),
  start: z.date().optional(),
  end: z.date().optional(),
  birthDate: z
    .string()
    .or(z.date())
    .refine((val) => {
      if (typeof val === "string") {
        return /^\d{4}-\d{2}-\d{2}$/.test(val) || !isNaN(Date.parse(val));
      }
      return val instanceof Date && !isNaN(val.getTime());
    }, "올바른 생년월일 형식이 아닙니다."),
  address: z
    .string({ required_error: "주소를 입력해주세요." })
    .min(1, "주소는 필수입니다."),
  email: z
    .string({ required_error: "이메일을 입력해주세요." })
    .email("올바른 이메일 형식이 아닙니다."),
  position: z
    .string({ required_error: "포지션을 선택해주세요." })
    .min(1, "포지션은 필수입니다."),
  experience: z.enum(["NEW", "EXPERIENCED"], {
    required_error: "경력 유무를 선택해주세요.",
    invalid_type_error: "경력 유무를 선택해주세요.",
  }),
  resume: z.instanceof(File, {
    message: "이력서 파일을 업로드해주세요.",
  }),
  portfolio: z
    .instanceof(File, {
      message: "올바른 포트폴리오 파일을 업로드해주세요.",
    })
    .optional(),
});

// 서버용 스키마
export const createApplicantServerSchema = createApplicantClientSchema.extend({
  resume: z.string({
    required_error: "이력서 파일 경로가 필요합니다.",
  }),
  portfolio: z.string().optional(),
});

export type CreateApplicantClientInput = z.infer<
  typeof createApplicantClientSchema
>;
export type CreateApplicantServerInput = z.infer<
  typeof createApplicantServerSchema
>;
