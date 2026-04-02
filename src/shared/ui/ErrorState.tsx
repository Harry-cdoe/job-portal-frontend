import { Button } from "./Button";

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="card border-red-100 bg-red-50/40 p-6">
      <h3 className="text-sm font-semibold text-red-700">{title}</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry ? (
        <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
