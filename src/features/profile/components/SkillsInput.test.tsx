import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SkillsInput } from "./SkillsInput";

function SkillsInputHarness({ initialSkills = [] }: { initialSkills?: string[] }) {
  const [skills, setSkills] = useState<string[]>(initialSkills);

  return (
    <div>
      <SkillsInput skills={skills} onChange={setSkills} />
      <div data-testid="skills-value">{skills.join(",")}</div>
    </div>
  );
}

describe("SkillsInput", () => {
  it("adds a skill when the user presses Enter", async () => {
    const user = userEvent.setup();

    render(<SkillsInputHarness />);

    const input = screen.getByPlaceholderText("Add a skill and press Enter");
    await user.type(input, "React{enter}");

    expect(screen.getByRole("button", { name: "Remove React" })).toBeInTheDocument();
    expect(screen.getByTestId("skills-value")).toHaveTextContent("React");
    expect(input).toHaveValue("");
  });

  it("prevents empty input from creating a skill", async () => {
    render(<SkillsInputHarness />);

    const input = screen.getByPlaceholderText("Add a skill and press Enter");
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByTestId("skills-value")).toHaveTextContent("");
    expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
  });

  it("removes an existing skill", async () => {
    const user = userEvent.setup();

    render(<SkillsInputHarness initialSkills={["React", "TypeScript"]} />);

    await user.click(screen.getByRole("button", { name: "Remove React" }));

    expect(screen.queryByText("React")).not.toBeInTheDocument();
    expect(screen.getByTestId("skills-value")).toHaveTextContent("TypeScript");
  });

  it("avoids adding duplicate skills", async () => {
    const user = userEvent.setup();

    render(<SkillsInputHarness initialSkills={["React"]} />);

    const input = screen.getByPlaceholderText("Add a skill and press Enter");
    await user.type(input, "React{enter}");

    expect(screen.getAllByRole("button", { name: "Remove React" })).toHaveLength(1);
    expect(screen.getByTestId("skills-value")).toHaveTextContent("React");
  });
});
