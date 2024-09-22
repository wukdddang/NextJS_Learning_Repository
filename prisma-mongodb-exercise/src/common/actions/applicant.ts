"use server";

import // CreateApplicantInput,
"@/core/entities/models/applicant";
import prisma from "../../../prisma";
import { CreateApplicantServerInput } from "@/core/entities/models/applicant";

export async function getApplicants() {
  try {
    const applicants = await prisma.applicant.findMany();
    return { success: true, data: applicants };
  } catch (error) {
    console.error("Failed to fetch applicants", error);
    return { success: false, error: "Failed to fetch applicants" };
  }
}

export async function createApplicant(data: CreateApplicantServerInput) {
  try {
    const applicant = await prisma.applicant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate:
          data.birthDate instanceof Date
            ? data.birthDate.toISOString()
            : data.birthDate,
        address: data.address,
        position: data.position,
        experience: data.experience,
        resume: data.resume,
        portfolio: data.portfolio,
      },
    });

    return { success: true, data: applicant };
  } catch (error) {
    console.error("Failed to create applicant", error);
    return { success: false, error: "Failed to create applicant" };
  }
}
