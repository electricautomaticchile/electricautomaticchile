import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "@/app/auth/login/page";
import { apiService } from "@/lib/api/apiService";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/lib/api/apiService", () => ({
  apiService: {
    login: jest.fn(),
  },
}));

const mockPush = jest.fn();
const mockSearchParams = {
  get: jest.fn(),
};

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    mockSearchParams.get.mockReturnValue(null);
  });

  it("renders login form elements", () => {
    render(<LoginPage />);

    expect(screen.getByText("Portal de Clientes")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Formato: 111111-1")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ingrese su contraseña")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
  });

  it("validates client number format", async () => {
    render(<LoginPage />);

    const clientInput = screen.getByPlaceholderText("Formato: 111111-1");
    const passwordInput = screen.getByPlaceholderText("Ingrese su contraseña");

    // Proporcionar contraseña para que la validación de formato sea la que falle
    fireEvent.change(clientInput, { target: { value: "invalid-format" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("El formato del número de cliente es incorrecto")
      ).toBeInTheDocument();
    });
  });

  it("shows error when fields are empty", async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/complete todos los campos/i)
      ).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    const mockUser = {
      id: "1",
      email: "123456-7",
      tipoUsuario: "cliente",
      role: "cliente",
    };

    (apiService.login as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: mockUser },
    });

    render(<LoginPage />);

    const clientInput = screen.getByPlaceholderText("Formato: 111111-1");
    const passwordInput = screen.getByPlaceholderText("Ingrese su contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.change(clientInput, { target: { value: "123456-7" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(apiService.login).toHaveBeenCalledWith({
        email: "123456-7",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard-cliente");
    });
  });

  it("handles login failure", async () => {
    (apiService.login as jest.Mock).mockResolvedValue({
      success: false,
      error: "Credenciales incorrectas",
    });

    render(<LoginPage />);

    const clientInput = screen.getByPlaceholderText("Formato: 111111-1");
    const passwordInput = screen.getByPlaceholderText("Ingrese su contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.change(clientInput, { target: { value: "123456-7" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
  });

  it("redirects admin users to superadmin dashboard", async () => {
    const mockAdminUser = {
      id: "1",
      email: "admin@test.com",
      tipoUsuario: "admin",
      role: "admin",
    };

    (apiService.login as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: mockAdminUser },
    });

    render(<LoginPage />);

    const clientInput = screen.getByPlaceholderText("Formato: 111111-1");
    const passwordInput = screen.getByPlaceholderText("Ingrese su contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.change(clientInput, { target: { value: "123456-7" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard-superadmin");
    });
  });

  it("uses callback URL when provided", async () => {
    mockSearchParams.get.mockImplementation((param) => {
      if (param === "callbackUrl") return "/dashboard-empresa";
      return null;
    });

    const mockUser = {
      id: "1",
      email: "123456-7",
      tipoUsuario: "cliente",
      role: "cliente",
    };

    (apiService.login as jest.Mock).mockResolvedValue({
      success: true,
      data: { user: mockUser },
    });

    render(<LoginPage />);

    const clientInput = screen.getByPlaceholderText("Formato: 111111-1");
    const passwordInput = screen.getByPlaceholderText("Ingrese su contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.change(clientInput, { target: { value: "123456-7" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard-empresa");
    });
  });

  it("shows loading state during login", async () => {
    (apiService.login as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, data: { user: {} } }), 100)
        )
    );

    render(<LoginPage />);

    const clientInput = screen.getByPlaceholderText("Formato: 111111-1");
    const passwordInput = screen.getByPlaceholderText("Ingrese su contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    fireEvent.change(clientInput, { target: { value: "123456-7" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
