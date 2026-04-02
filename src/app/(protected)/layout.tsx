import { AuthGate } from "@/features/auth/components/AuthGate";
import { AppShell } from "@/features/auth/components/AppShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
