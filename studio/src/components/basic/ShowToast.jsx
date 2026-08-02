import { toast } from "react-toastify";

const brutalistOptions = (customOptions = {}) => {
  const { theme = "light", ...rest } = customOptions;

  let bg = "#ffffff";
  let text = "#000000";

  if (theme === "dark") {
    bg = "#000000";
    text = "#ffffff";
  } else if (theme === "metal") {
    bg = "#000000";
    text = "#ff0000";
  }

  return {
    position: "top-right",
    autoClose: 3000,
    theme: theme === "light" ? "light" : "dark",
    icon: "✓",
    style: {
      backgroundColor: bg,
      color: text,
      borderRadius: "0px",
      border: "1px solid #000000",
      boxShadow: "4px 4px 0px #000000",
      fontFamily: "monospace",
      padding: "12px 16px",
      fontWeight: "bold",
      textTransform: "uppercase",
      fontSize: "12px",
    },
    progressStyle: {
      backgroundColor: text === "#000000" ? "#000000" : text,
    },
    ...rest,
  };
};

export const ShowToast = {
  success: (message, options = {}) => {
    toast.success(message, brutalistOptions({ icon: "✓", ...options }));
  },

  error: (message, options = {}) => {
    toast.error(message, brutalistOptions({ icon: "✕", ...options }));
  },

  info: (message, options = {}) => {
    toast.info(message, brutalistOptions({ icon: "i", ...options }));
  },

  warning: (message, options = {}) => {
    toast.warn(message, brutalistOptions({ icon: "⚠", ...options }));
  },
};
