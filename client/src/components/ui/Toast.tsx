import toast from "react-hot-toast";

type ToastType = "success" | "error";

const Toast = (message: string, type: ToastType) => {
  if (type === "success") {
    toast.success(message, {
      duration: 3000,
      position: "top-right",
    });
  } else if (type === "error") {
    toast.error(message, {
      duration: 3000,
      position: "top-right",
    });
  }
};

export default Toast;
