import { CandidateStats } from "@/features/dashboard/components/CandidateStats";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function CandidateDashboardPage() {
  return (
    <section>
      <PageHeader title="Candidate Dashboard" subtitle="Track your applications and hiring progress." />
      <CandidateStats />
    </section>
  );
}
