import { getApplicants } from "@/common/actions/applicant";

export default async function Home() {
  const applicants = await getApplicants();
  console.log(applicants);

  return <div className="p-10"></div>;
}
