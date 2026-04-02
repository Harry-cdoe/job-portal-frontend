import { CompanyStats } from "@/features/dashboard/components/CompanyStats";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function CompanyDashboardPage() {
  return (
    <section>
      <PageHeader title="Company Dashboard" subtitle="Monitor applicant flow and team hiring activity." />
      <CompanyStats />
    </section>
  );
}
