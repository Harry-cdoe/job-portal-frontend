const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const env = {
  // Keep a safe local default for developer onboarding.
  apiBaseUrl: apiBaseUrl && apiBaseUrl.length > 0 ? apiBaseUrl : "http://localhost:8000/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Job Portal",
};
