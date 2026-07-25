import { redirectTo } from "@/utils/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://portfolio-backend-cjvf.onrender.com";

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  options.credentials = "include";
  options.headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, options);

    let data = {};
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          document.cookie = "adminSession=; path=/; max-age=0; SameSite=Lax";

          redirectTo("/login?error=session_expired");
        }
      }

      throw new Error(data.message || "An error occurred while processing your request.");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Unable to connect to the server. Please check your connection.");
    }

    throw error;
  }
};
