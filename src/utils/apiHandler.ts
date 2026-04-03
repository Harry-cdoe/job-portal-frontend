import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/shared/api/errors";

type Messages = {
  loading: string;
  success: string;
  error: string;
};

export async function apiHandler<T>(apiCall: () => Promise<T>, messages: Messages): Promise<T> {
  const toastId = toast.loading(messages.loading);

  try {
    const response = await apiCall();
    toast.success(messages.success, { id: toastId });
    return response;
  } catch (error) {
    toast.error(getApiErrorMessage(error, messages.error), { id: toastId });
    throw error;
  }
}
