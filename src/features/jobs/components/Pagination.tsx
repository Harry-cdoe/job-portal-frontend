import { memo } from "react";
import { Button } from "@/shared/ui/Button";

type Props = {
  page: number;
  totalPages: number;
  totalResults: number;
  onChange: (nextPage: number) => void;
  isFetching?: boolean;
};

function PaginationBase({ page, totalPages, totalResults, onChange, isFetching }: Props) {
  if (totalPages <= 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        {totalResults.toLocaleString("en-IN")} jobs found | Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
        <Button
          className="bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
          disabled={page <= 1 || isFetching}
          onClick={() => onChange(page - 1)}
        >
          Prev
        </Button>
        <Button
          className="px-3 py-1 text-xs"
          disabled={page >= totalPages || isFetching}
          onClick={() => onChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export const Pagination = memo(PaginationBase);
