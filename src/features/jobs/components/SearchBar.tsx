import { memo } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

function SearchBarBase({ value, onChange, onClear }: Props) {
  return (
    <div className="card p-4">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search jobs</label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by role, skill, or company"
        />
        <Button
          className="bg-slate-100 px-3 text-slate-700 hover:bg-slate-200"
          disabled={!value.trim()}
          onClick={onClear}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export const SearchBar = memo(SearchBarBase);
