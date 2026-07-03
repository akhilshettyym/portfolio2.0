import { toast } from "react-toastify";

const brutalistOptions = (customOptions = {}) => ({
    position: "top-right",
    autoClose: 3000,
    theme: "light",
    icon: "✓",
    style: {
        backgroundColor: "#ffffff",
        color: "#000000",
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
        backgroundColor: "#000000",
    },
    ...customOptions,
});

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