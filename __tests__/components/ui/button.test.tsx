import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Delete</Button>);

    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("bg-destructive");
  });

  it("applies size classes correctly", () => {
    render(<Button size="lg">Large Button</Button>);

    const button = screen.getByRole("button", { name: /large button/i });
    expect(button).toHaveClass("h-11");
  });

  it("renders as disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it("renders loading state", () => {
    render(<Button disabled>Loading...</Button>);

    const button = screen.getByRole("button", { name: /loading/i });
    expect(button).toBeDisabled();
  });
});
