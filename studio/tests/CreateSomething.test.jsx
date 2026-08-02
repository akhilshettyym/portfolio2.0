import React from "react";
import axios from "axios";
import { ShowToast } from "@/components/basic/ShowToast";
import CreateSomething from "@/components/CreateSomething";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("axios");

jest.mock("@/hooks/useDeviceType", () => ({
  useDeviceType: () => ({ isMobile: false }),
}));

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
}));

jest.mock(
  "../src/context/ThemeContext",
  () => ({
    useTheme: () => ({ theme: "light", setTheme: jest.fn() }),
  }),
  { virtual: true },
);

jest.mock("@/components/basic/ShowToast", () => ({
  ShowToast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/utils/basic", () => ({
  SERVICES: [{ id: "web_dev", label: "Web Development" }],
  BUDGET_OPTIONS: [{ id: "10k-20k", label: "$10,000 - $20,000" }],
}));

jest.mock("@/components/basic/CustomButton", () => {
  return function MockButton({ title, onClick, disabled }) {
    return (
      <button onClick={onClick} disabled={disabled} data-testid="submit-btn">
        {title}
      </button>
    );
  };
});

describe("CreateSomething Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the 'Say Hi' form by default", () => {
    render(<CreateSomething />);

    expect(screen.getByPlaceholderText("What should I call you?")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Company or project name")).not.toBeInTheDocument();
  });

  it("shows validation error if required fields are missing", async () => {
    render(<CreateSomething />);
    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Name and Email are required fields.")).toBeInTheDocument();
    });
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("shows error if message is less than 10 characters", async () => {
    render(<CreateSomething />);

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("How I'll reach you"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your message here..."), {
      target: { value: "Short" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Your message body must be at least 10 characters long.")).toBeInTheDocument();
    });
  });

  it("fails Work form if Organization or Role is missing", async () => {
    render(<CreateSomething />);
    fireEvent.click(screen.getByText("Build A Project"));

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("How I'll reach you"), {
      target: { value: "jane@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Provide an overview of objectives, tech requirements, scope..."), {
      target: { value: "Valid message length here" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Please fill out your Organization and Role details.")).toBeInTheDocument();
    });
  });

  it("fails Work form if no Service is selected", async () => {
    render(<CreateSomething />);
    fireEvent.click(screen.getByText("Build A Project"));

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("How I'll reach you"), {
      target: { value: "jane@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Company or project name"), {
      target: { value: "Acme" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Founder, Product Lead"), {
      target: { value: "CEO" },
    });
    fireEvent.change(screen.getByPlaceholderText("Provide an overview of objectives, tech requirements, scope..."), {
      target: { value: "Valid message length here" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Please select at least one engineering project service type.")).toBeInTheDocument();
    });
  });

  it("fails Work form if Budget is not selected", async () => {
    render(<CreateSomething />);
    fireEvent.click(screen.getByText("Build A Project"));

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByPlaceholderText("How I'll reach you"), {
      target: { value: "jane@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Company or project name"), {
      target: { value: "Acme" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. Founder, Product Lead"), {
      target: { value: "CEO" },
    });
    fireEvent.click(screen.getByText("Web Development"));
    fireEvent.change(screen.getByPlaceholderText("Provide an overview of objectives, tech requirements, scope..."), {
      target: { value: "Valid message length here" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Please select an estimated allocation budget option.")).toBeInTheDocument();
    });
  });

  it("trims whitespace and formats payload correctly before submitting", async () => {
    axios.post.mockResolvedValueOnce({ status: 200, data: { success: true, message: "Success!" } });
    render(<CreateSomething />);

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "  John Doe  " },
    });
    fireEvent.change(screen.getByPlaceholderText("How I'll reach you"), {
      target: { value: " JOHN@TEST.com " },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your message here..."), {
      target: { value: "  Hello, just saying hi!  " },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String),
        {
          name: "John Doe",
          email: "john@test.com",
          message: "Hello, just saying hi!",
          purpose: "say_hi",
        },
        expect.any(Object),
      );
      expect(ShowToast.success).toHaveBeenCalledWith("Success!", { theme: "light" });
    });
  });

  it("handles API failure correctly and displays error toast", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Email already submitted recently." } },
    });
    render(<CreateSomething />);

    fireEvent.change(screen.getByPlaceholderText("What should I call you?"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("How I'll reach you"), {
      target: { value: "john@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your message here..."), {
      target: { value: "Valid message here" },
    });

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(screen.getByText("Email already submitted recently.")).toBeInTheDocument();
      expect(ShowToast.error).toHaveBeenCalledWith("Email already submitted recently.", { theme: "light" });
      expect(ShowToast.success).not.toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
