import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResumeUpload } from "./ResumeUpload";

function createFile(name: string, type: string, size: number) {
  return new File([new Uint8Array(size)], name, { type });
}

describe("ResumeUpload", () => {
  it("accepts a valid PDF file", async () => {
    const user = userEvent.setup();
    const onUpload = jest.fn();

    render(<ResumeUpload isUploading={false} progress={0} onUpload={onUpload} />);

    const input = screen.getByLabelText("Upload resume file");
    const file = createFile("resume.pdf", "application/pdf", 1024);

    await user.upload(input, file);

    expect(onUpload).toHaveBeenCalledWith(file);
    expect(screen.getByText("Selected file")).toBeInTheDocument();
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  it("rejects an invalid file type", async () => {
    const onUpload = jest.fn();

    render(<ResumeUpload isUploading={false} progress={0} onUpload={onUpload} />);

    const input = screen.getByLabelText("Upload resume file");
    const file = createFile("resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 1024);

    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).not.toHaveBeenCalled();
    expect(screen.getByText("Only PDF files are accepted.")).toBeInTheDocument();
  });

  it("rejects files larger than the size limit", async () => {
    const onUpload = jest.fn();

    render(<ResumeUpload isUploading={false} progress={0} onUpload={onUpload} />);

    const input = screen.getByLabelText("Upload resume file");
    const file = createFile("resume.pdf", "application/pdf", 5 * 1024 * 1024 + 1);

    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).not.toHaveBeenCalled();
    expect(screen.getByText("File must be smaller than 5 MB.")).toBeInTheDocument();
  });

  it("supports drag and drop uploads", () => {
    const onUpload = jest.fn();

    render(<ResumeUpload isUploading={false} progress={0} onUpload={onUpload} />);

    const dropZone = screen.getByText("Drag & drop here").closest("div");
    const file = createFile("resume.pdf", "application/pdf", 2048);

    if (!dropZone) {
      throw new Error("Expected drop zone to exist.");
    }

    fireEvent.dragEnter(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(dropZone.className).toContain("border-brand-500");

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it("shows the uploaded file name from props after upload", () => {
    render(
      <ResumeUpload
        isUploading={false}
        progress={0}
        onUpload={jest.fn()}
        resumeName="candidate-resume.pdf"
        resumeUrl="https://example.com/resume.pdf"
      />
    );

    expect(screen.getByText("Current resume")).toBeInTheDocument();
    expect(screen.getByText("candidate-resume.pdf")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Preview" })).toHaveAttribute("href", "https://example.com/resume.pdf");
  });
});
