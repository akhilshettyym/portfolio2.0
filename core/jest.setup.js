import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  usePathname: jest.fn(),
}));
