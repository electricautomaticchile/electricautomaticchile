import { renderHook, waitFor, act } from "@testing-library/react";
import { useAuth } from "@/lib/hooks/useApi";
import { apiService } from "@/lib/api/apiService";

// Mock del apiService
jest.mock("@/lib/api/apiService", () => ({
  apiService: {
    login: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  },
}));

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("initializes with null user and loading true", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it("sets loading to false when no token exists", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("fetches user profile when token exists", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      nombre: "Test User",
      rol: "cliente",
    };

    localStorageMock.getItem.mockReturnValue("mock-token");
    (apiService.getProfile as jest.Mock).mockResolvedValue({
      success: true,
      data: mockUser,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(apiService.getProfile).toHaveBeenCalled();
  });

  it("handles login successfully", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      nombre: "Test User",
      rol: "cliente",
    };

    const mockLoginResponse = {
      success: true,
      data: { user: mockUser },
    };

    (apiService.login as jest.Mock).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth());

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login({
        email: "test@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    expect(loginResult.success).toBe(true);
    expect(apiService.login).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("handles login failure", async () => {
    const mockLoginResponse = {
      success: false,
      error: "Credenciales incorrectas",
    };

    (apiService.login as jest.Mock).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth());

    const loginResult = await result.current.login({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toBe("Credenciales incorrectas");
    expect(result.current.user).toBeNull();
  });

  it("handles logout correctly", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      nombre: "Test User",
      rol: "cliente",
    };

    // Mock window.location
    delete (window as any).location;
    (window as any).location = { href: "" };

    const { result } = renderHook(() => useAuth());

    // Set initial user
    result.current.user = mockUser;

    await result.current.logout();

    expect(apiService.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  it("clears tokens when getProfile fails", async () => {
    localStorageMock.getItem.mockReturnValue("invalid-token");
    (apiService.getProfile as jest.Mock).mockResolvedValue({
      success: false,
      error: "Token inválido",
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith("auth_token");
    expect(localStorageMock.removeItem).toHaveBeenCalledWith("refresh_token");
    expect(result.current.user).toBeNull();
  });
});
