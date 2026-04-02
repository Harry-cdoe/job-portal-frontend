"use client";

import { Input } from "@/shared/ui/Input";

export function JobFilters({ q, onChange }: { q: string; onChange: (value: string) => void }) {
  return <Input value={q} onChange={(e) => onChange(e.target.value)} placeholder="Search jobs" />;
}
