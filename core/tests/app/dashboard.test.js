import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { apiFetch } from "@/utils/api";
import { showToast } from "@/utils/toast";

jest.mock("@/utils/api");
jest.mock("@/utils/toast", () => ({
  showToast: { success: jest.fn(), error: jest.fn() },
}));

const mockLeads = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@test.com",
    purpose: "work",
    message: "Hello",
    projectType: "web",
    budget: "1000_5000",
  },
];

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially, then empty state if no leads", async () => {
    apiFetch.mockResolvedValueOnce({ data: [] });
    render(<DashboardPage />);

    expect(screen.getByText(/loading inquiries stack/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/no inbound portfolio inquiries found/i)).toBeInTheDocument();
    });
  });

  it("renders a list of leads", async () => {
    apiFetch.mockResolvedValueOnce({ data: mockLeads });
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("(john@test.com)")).toBeInTheDocument();
      expect(screen.getByText(/web/i)).toBeInTheDocument();
    });
  });

  it("opens modal and deletes a lead successfully", async () => {
    apiFetch
      .mockResolvedValueOnce({ data: mockLeads })
      .mockResolvedValueOnce({});

    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());

    const deleteBtns = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByText("Delete Lead")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /confirm delete/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith("/api/admin/delete-details/1", {
        method: "DELETE",
      });
      expect(showToast.success).toHaveBeenCalledWith("Lead Deleted Successfully");
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });
});
