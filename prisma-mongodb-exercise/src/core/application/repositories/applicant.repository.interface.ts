import { CreateApplicantServerInput } from "@/core/entities/models/applicant";
import { Applicant } from "@prisma/client";

export interface IApplicantRepository {
  getApplicants(): Promise<any>;
  createApplicant(data: CreateApplicantServerInput): Promise<Applicant>;
  updateApplicant(id: string, data: any): Promise<any>;
  deleteApplicant(id: string): Promise<any>;
}
