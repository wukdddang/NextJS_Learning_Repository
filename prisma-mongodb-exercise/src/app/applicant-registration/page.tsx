import React from "react";
import InterviewTime from "./(strategy)/components/interview-time";
import ApplicantInformation from "./(strategy)/components/applicant-information";
import InterviewerEvaluatorComplexFilter from "./(strategy)/components/interviewer-evaluator-complex-filter";

const ParticipantRegistrationPage = () => {
  return (
    <article className="p-10">
      <InterviewerEvaluatorComplexFilter />
      <InterviewTime />
      <ApplicantInformation />
    </article>
  );
};

export default ParticipantRegistrationPage;
