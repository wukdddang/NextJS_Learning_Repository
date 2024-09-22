This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Entity-Relation Diagram

```mermaid
erDiagram
    User ||--o{ Evaluation : has
    User ||--o{ Report : has
    Division ||--o{ Applicant : has
    Division {
        String id
        String name
    }
    Evaluation ||--|| Applicant : evaluates
    Evaluation {
        String id
        EvaluationLevel level
        String userId
        String applicantId
        String evaluatorName
        String probationPeriod
        String evaluationDate
        Json[] performanceEvaluation
        String performanceEvaluationScore
        String desire
        String cooperation
        String diligence
        String responsibility
        String interpersonal
        String personalityEvaluationScore
        String passOpinion
        String failOpinion
    }
    Applicant ||--o{ Report : has
    Applicant ||--o{ InterviewSchedule : has
    Applicant ||--|| RecruitmentField : applies_for
    Applicant {
        String id
        String name
        String objective
        Experience experience
        Result resumeResult
        Result interviewResult
        String birthDate
        String email
        String phone
        String address
        String resume
        String portfolio
        String position
        Boolean isAgree
        Boolean isOptionalAgree
        Boolean isSensitiveAgree
        String interviewDate
        String workStartDate
        String presentationDate
        ApplicantStage stage
        ApplicantStage previousStage
        String start
        String end
        EmployeeType empoloyeeType
        String colorLabel
        String divisionId
        String failReason
        AccessRoute accessRoute
    }
    InterviewSchedule {
        String id
        String applicantId
        Json[] history
        String fixedStart
        String fixedEnd
        Json[] comment
    }
    RecruitmentField {
        String id
        String title
        String desc
        RecruitmentStatus status
        String start
        String end
    }
    Report {
        String id
        String userId
        String interviewerName
        String applicantId
        String education
        String career
        String certification
        String etc
        String knowledge
        String skill
        String attitude
        String desired_salary
        String joinDate
        String utilizationPlan
        String overallReview
        String interviewResult
        JobTitle jobTitle
        JobLevel jobLevel
        JobGrade jobGrade
        String jobStatusReason
    }
```
