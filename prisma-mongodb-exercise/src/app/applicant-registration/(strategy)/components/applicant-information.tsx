"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateApplicantClientInput,
  createApplicantClientSchema,
} from "@/core/entities/models/applicant";
import { createApplicant } from "@/common/actions/applicant";
import {
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DragAndDropInput,
  Button,
  DefaultCalendar,
} from "lumir-internal-design-system";
import React from "react";

const ApplicantInformation = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateApplicantClientInput>({
    resolver: zodResolver(createApplicantClientSchema),
    mode: "onChange",
  });

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.filePath;
  };

  const onSubmit = async (data: CreateApplicantClientInput) => {
    console.log("Form submitted", data);
    try {
      let resumePath = "";
      let portfolioPath = "";

      if (data.resume instanceof File) {
        resumePath = await uploadFile(data.resume);
      }

      if (data.portfolio instanceof File) {
        portfolioPath = await uploadFile(data.portfolio);
      }

      const applicantData = {
        ...data,
        resume: resumePath,
        portfolio: portfolioPath,
      };

      const result = await createApplicant(applicantData);
      if (result.success) {
        console.log("Applicant created successfully", result.data);
        // TODO: Add success notification or redirect
      } else {
        console.error("Failed to create applicant", result.error);
        // TODO: Add error notification
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      // TODO: Add error notification
    }
  };

  console.log("Current form errors:", errors);
  console.log("Is form valid?", isValid);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <h2>인적 사항</h2>
      <div className="grid grid-cols-3 gap-10 max-w-[1100px]">
        {/* Name field */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <p className="flex flex-col flex-1 max-w-[300px] gap-1.5">
              <Label htmlFor="applicant-name">이름</Label>
              <Input
                id="applicant-name"
                type="text"
                placeholder="이름을 입력해주세요"
                {...field}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </p>
          )}
        />
        {/* Phone field */}
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <p className="flex flex-col flex-1 max-w-[300px] gap-1.5">
              <Label htmlFor="applicant-phone">연락처</Label>
              <Input
                id="applicant-phone"
                type="tel"
                placeholder="-는 제외하고 입력해주세요"
                {...field}
              />
              {errors.phone && (
                <span className="text-red-500">{errors.phone.message}</span>
              )}
            </p>
          )}
        />
        {/* Birth Date field */}
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <p className="flex flex-col flex-1 max-w-[300px] gap-1.5">
              <Label htmlFor="applicant-birth-date">생년월일</Label>
              <DefaultCalendar
                id="applicant-birth-date"
                date={field.value ? new Date(field.value) : undefined}
                onDateChange={(date) => field.onChange(date?.toISOString())}
              />
            </p>
          )}
        />
        {/* Address field */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <p className="flex flex-col flex-1 max-w-[300px] gap-1.5">
              <Label htmlFor="applicant-address">주소</Label>
              <Input
                id="applicant-address"
                type="text"
                placeholder="주소를 입력해주세요"
                {...field}
              />
              {errors.address && (
                <span className="text-red-500">{errors.address.message}</span>
              )}
            </p>
          )}
        />
        {/* Email field */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <p className="flex flex-col flex-1 max-w-[300px] gap-1.5">
              <Label htmlFor="applicant-email">이메일</Label>
              <Input
                id="applicant-email"
                type="email"
                placeholder="이메일을 입력해주세요"
                {...field}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </p>
          )}
        />
      </div>
      {/* Position field */}
      <Controller
        name="position"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="applicant-position">포지션</Label>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="포지션을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
                <SelectItem value="fullstack">Fullstack Developer</SelectItem>
              </SelectContent>
            </Select>
            {errors.position && (
              <span className="text-red-500">{errors.position.message}</span>
            )}
          </div>
        )}
      />
      {/* Experience field */}
      <Controller
        name="experience"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-4">
            <Label htmlFor="applicant-experience">경력 유무</Label>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="NEW" id="applicant-new" />
                <Label htmlFor="applicant-new">신입</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="EXPERIENCED"
                  id="applicant-experienced"
                />
                <Label htmlFor="applicant-experienced">경력</Label>
              </div>
            </RadioGroup>
            {errors.experience && (
              <span className="text-red-500">{errors.experience.message}</span>
            )}
          </div>
        )}
      />
      <div className="flex gap-10">
        {/* Resume upload */}
        <Controller
          name="resume"
          control={control}
          render={({ field }) => (
            <>
              <Label htmlFor="applicant-resume">이력서 및 경력기술서</Label>
              <DragAndDropInput onFileSelect={(file) => field.onChange(file)} />
              {errors.resume && (
                <span className="text-red-500">{errors.resume.message}</span>
              )}
            </>
          )}
        />
        {/* Portfolio upload */}
        <Controller
          name="portfolio"
          control={control}
          render={({ field }) => (
            <>
              <Label htmlFor="applicant-portfolio">포트폴리오 (선택사항)</Label>
              <DragAndDropInput
                onFileSelect={(file) => field.onChange(file)}
                className="max-w-[600px]"
              />
              {errors.portfolio && (
                <span className="text-red-500">{errors.portfolio.message}</span>
              )}
            </>
          )}
        />
      </div>
      <Button
        type="submit"
        onClick={() => {
          console.log("지원하기 버튼 클릭됨");
        }}
      >
        지원하기
      </Button>
    </form>
  );
};

export default ApplicantInformation;
