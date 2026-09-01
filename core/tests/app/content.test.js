import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContentPage from "../../app/content/page";

jest.mock("../../utils/api", () => ({
  apiFetch: jest.fn((url) => {
    if (url.includes("experiences")) {
      return Promise.resolve({
        data: [{ _id: "1", title: "Software Engineer", company: "Tech Corp", timeline: "2023 - Present" }],
      });
    }
    if (url.includes("works")) {
      return Promise.resolve({
        data: [{ _id: "2", title: "Awesome Project", tagline: "A great app", when: "2024" }],
      });
    }
    return Promise.resolve({ data: {} });
  }),
}));

describe("ContentPage", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test("renders the modal form and allows typing into Title", async () => {
    render(<ContentPage />);
    const user = userEvent.setup();

    const createButton = screen.getByRole("button", { name: /\+ Create New Work/i });
    await user.click(createButton);

    const titleInput = screen.getByLabelText(/^Title$/i);
    expect(titleInput).toBeInTheDocument();

    await user.type(titleInput, "New Project Title");
    expect(titleInput).toHaveValue("New Project Title");
  });

  test('displays experiences tab correctly with "Software Engineer"', async () => {
    render(<ContentPage />);
    const user = userEvent.setup();

    const experiencesTab = screen.getByLabelText(/experiences/i);
    await user.click(experiencesTab);

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
  });

  test('displays works tab correctly with "Awesome Project"', async () => {
    render(<ContentPage />);

    await waitFor(() => {
      expect(screen.getByText("Awesome Project")).toBeInTheDocument();
    });
  });
});
