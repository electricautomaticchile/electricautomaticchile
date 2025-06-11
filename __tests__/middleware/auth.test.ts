import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware";

// Mock de jwtVerify
jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
}));

const { jwtVerify } = require("jose");

describe("Auth Middleware", () => {
  let mockRequest: Partial<NextRequest>;
  let mockCookies: Map<string, any>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCookies = new Map();

    mockRequest = {
      nextUrl: {
        pathname: "/dashboard-cliente",
      } as URL,
      cookies: {
        get: jest.fn((name) => mockCookies.get(name)),
      } as any,
      url: "http://localhost:3000/dashboard-cliente",
    };
  });

  it("allows access to public routes without authentication", async () => {
    mockRequest.nextUrl!.pathname = "/";

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    // Should not redirect to login
    expect(response.headers.get("location")).toBeNull();
  });

  it("allows access to auth routes", async () => {
    mockRequest.nextUrl!.pathname = "/auth/login";

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBeNull();
  });

  it("allows access to API routes", async () => {
    mockRequest.nextUrl!.pathname = "/api/test";

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects to login when no auth token exists for dashboard routes", async () => {
    mockRequest.nextUrl!.pathname = "/dashboard-cliente";
    mockCookies.set("auth_token", undefined);

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toContain("/auth/login");
    expect(response.headers.get("location")).toContain(
      "callbackUrl=/dashboard-cliente"
    );
  });

  it("redirects to login when JWT verification fails", async () => {
    mockRequest.nextUrl!.pathname = "/dashboard-cliente";
    mockCookies.set("auth_token", { value: "invalid-token" });

    jwtVerify.mockRejectedValue(new Error("Invalid token"));

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toContain("/auth/login");
  });

  it("allows access with valid token for correct role", async () => {
    mockRequest.nextUrl!.pathname = "/dashboard-cliente";
    mockCookies.set("auth_token", { value: "valid-token" });

    jwtVerify.mockResolvedValue({
      payload: {
        role: "cliente",
        tipoUsuario: "cliente",
      },
    });

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects admin to correct dashboard", async () => {
    mockRequest.nextUrl!.pathname = "/dashboard-cliente";
    mockCookies.set("auth_token", { value: "admin-token" });

    jwtVerify.mockResolvedValue({
      payload: {
        role: "admin",
        tipoUsuario: "admin",
      },
    });

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toContain("/dashboard-superadmin");
  });

  it("redirects empresa user to correct dashboard", async () => {
    mockRequest.nextUrl!.pathname = "/dashboard-cliente";
    mockCookies.set("auth_token", { value: "empresa-token" });

    jwtVerify.mockResolvedValue({
      payload: {
        role: "empresa",
        tipoUsuario: "empresa",
      },
    });

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toContain("/dashboard-empresa");
  });

  it("prevents unauthorized access to admin dashboard", async () => {
    mockRequest.nextUrl!.pathname = "/dashboard-superadmin";
    mockCookies.set("auth_token", { value: "client-token" });

    jwtVerify.mockResolvedValue({
      payload: {
        role: "cliente",
        tipoUsuario: "cliente",
      },
    });

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toContain("/dashboard-cliente");
  });

  it("handles missing environment variables gracefully", async () => {
    const originalEnv = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    mockRequest.nextUrl!.pathname = "/dashboard-cliente";
    mockCookies.set("auth_token", { value: "some-token" });

    // Should still attempt verification with fallback
    jwtVerify.mockRejectedValue(new Error("No secret"));

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toContain("/auth/login");

    // Restore env
    if (originalEnv) {
      process.env.JWT_SECRET = originalEnv;
    }
  });

  it("preserves query parameters in callback URL", async () => {
    mockRequest.nextUrl!.pathname = "/dashboard-cliente";
    mockRequest.url = "http://localhost:3000/dashboard-cliente?tab=settings";

    const response = await middleware(mockRequest as NextRequest);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.headers.get("location")).toContain(
      "callbackUrl=/dashboard-cliente?tab=settings"
    );
  });
});
