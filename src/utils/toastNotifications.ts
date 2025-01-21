// toastNotifications.ts
import { toast } from "react-toastify";

export const showErrorToast = (message: string) => {
  toast.error(message || "Something went wrong", {
    position: "bottom-right",
  });
};

export const showSuccessToast = (message: string) => {
  toast.success(message || "Action successful", {
    position: "bottom-right",
  });
};

