import { memo, useCallback, useMemo, useState, type KeyboardEvent } from "react";
import { cn } from "@/shared/lib/cn";

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  label?: string;
  error?: string;
}

const DEFAULT_LABEL = "Skills";

function SkillsInputBase({ skills, onChange, label = DEFAULT_LABEL, error }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const tags = useMemo(() => skills, [skills]);

  const addSkill = useCallback(
    (value?: string) => {
      const candidate = (value ?? inputValue).trim();
      if (!candidate) return;
      if (candidate.length > 50) return;
      if (tags.includes(candidate)) {
        setInputValue("");
        return;
      }
      onChange([...tags, candidate]);
      setInputValue("");
    },
    [inputValue, onChange, tags]
  );

  const removeSkill = useCallback(
    (skill: string) => {
      onChange(tags.filter((item) => item !== skill));
    },
    [onChange, tags]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        addSkill(inputValue);
        return;
      }

      if (event.key === "Backspace" && !inputValue && tags.length) {
        event.preventDefault();
        removeSkill(tags[tags.length - 1]);
      }
    },
    [addSkill, inputValue, removeSkill, tags]
  );

  const handleBlur = useCallback(() => {
    if (inputValue) {
      addSkill(inputValue);
    }
  }, [addSkill, inputValue]);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="skills-input">
        {label}
      </label>
      <div
        className={cn(
          "flex flex-wrap items-center gap-1 rounded-lg border px-3 py-2 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200",
          error ? "border-red-500" : "border-slate-300"
        )}
      >
        <input
          id="skills-input"
          className="flex-1 min-w-[160px] bg-transparent text-sm outline-none placeholder:text-slate-400"
          value={inputValue}
          placeholder="Add a skill and press Enter"
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          aria-invalid={Boolean(error)}
        />
        <span className="text-xs text-slate-400">Press Enter to add</span>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="rounded-full bg-blue-100 px-1 text-xs font-bold text-blue-600 transition hover:bg-blue-200"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export const SkillsInput = memo(SkillsInputBase);
SkillsInput.displayName = "SkillsInput";
