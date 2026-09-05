import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import AdminClient from "@/app/AdminClient";

import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";

jest.mock("@/utils/api");
jest.mock("@/utils/toast", () => ({
  showToast: { success: jest.fn(), error: jest.fn() },
}));

describe("AdminClient Component", () => {
  const mockRouterReplace = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ replace: mockRouterReplace });
    usePathname.mockReturnValue("/dashboard");
    jest.clearAllMocks();
  });

  it("hides navigation bar on the login page", () => {
    usePathname.mockReturnValue("/login");
    render(
      <AdminClient>
        <div>Content</div>
      </AdminClient>,
    );

    expect(screen.queryByText("AKHIL SHETTY // ADMIN")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("shows navigation bar on other pages", () => {
    render(
      <AdminClient>
        <div>Content</div>
      </AdminClient>,
    );
    expect(screen.getByText("AKHIL SHETTY // ADMIN")).toBeInTheDocument();
  });

  it("handles logout flow correctly", async () => {
    apiFetch.mockResolvedValueOnce({});
    Storage.prototype.removeItem = jest.fn();

    render(
      <AdminClient>
        <div>Content</div>
      </AdminClient>,
    );

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(screen.getByText("Logging out...")).toBeInTheDocument();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
      expect(localStorage.removeItem).toHaveBeenCalledWith("authToken");
      expect(mockRouterReplace).toHaveBeenCalledWith("/login");
    });
  });
});
