import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input Component", () => {
  it("renders input with placeholder", () => {
    render(<Input placeholder="Enter your name" />);

    const input = screen.getByPlaceholderText("Enter your name");
    expect(input).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("applies disabled state correctly", () => {
    render(<Input disabled />);

    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("renders with correct type", () => {
    render(<Input type="email" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders password input type", () => {
    render(<Input type="password" />);

    const input = screen.getByRole("textbox", { hidden: true });
    expect(input).toHaveAttribute("type", "password");
  });

  it("accepts default value", () => {
    render(<Input defaultValue="default text" />);

    const input = screen.getByDisplayValue("default text");
    expect(input).toBeInTheDocument();
  });
});
