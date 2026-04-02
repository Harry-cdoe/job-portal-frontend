"use client";

import { useForm } from "react-hook-form";
import { useCreateJob } from "@/features/jobs/hooks/useCreateJob";
import type { CreateJobRequestDto } from "@/features/jobs/types";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { ErrorState } from "@/shared/ui/ErrorState";
import { PageHeader } from "@/shared/ui/PageHeader";

export default function CompanyJobsPage() {
  const { mutateAsync, isPending, isError } = useCreateJob();
  const { register, handleSubmit, reset } = useForm<CreateJobRequestDto>();

  const onSubmit = handleSubmit(async (values) => {
    await mutateAsync({
      ...values,
      salary: Number(values.salary),
    });
    reset();
  });

  return (
    <section>
      <PageHeader title="Create Job Posting" subtitle="Publish new opportunities for candidates." />

      <form className="card mt-4 max-w-2xl space-y-3 p-5" onSubmit={onSubmit}>
        <Input placeholder="Title" {...register("title", { required: true })} />
        <Input placeholder="Description" {...register("description", { required: true })} />
        <Input placeholder="Location" {...register("location", { required: true })} />
        <Input type="number" placeholder="Salary" {...register("salary", { required: true, valueAsNumber: true })} />

        {isError ? (
          <ErrorState
            title="Job creation failed"
            message="Ensure your company profile exists and you have required permissions."
          />
        ) : null}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Job"}
        </Button>
      </form>
    </section>
  );
}
