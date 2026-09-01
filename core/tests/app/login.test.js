import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import { apiFetch } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("@/utils/api");
jest.mock("@/utils/toast", () => ({
  showToast: { success: jest.fn(), error: jest.fn(), warning: jest.fn() },
}));

describe("LoginPage", () => {
  const mockRouterPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
    useSearchParams.mockReturnValue({ get: mockGet });
    jest.clearAllMocks();
    Storage.prototype.setItem = jest.fn();
  });

  it("renders login form correctly", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    apiFetch.mockResolvedValueOnce({ token: "fake-jwt-token" });
    const { container } = render(<LoginPage />);

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /enter dashboard/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("authToken", "fake-jwt-token");
      expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
