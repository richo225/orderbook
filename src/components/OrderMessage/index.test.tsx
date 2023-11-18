import { render, screen } from "@testing-library/react";
import OrderMessage from "./index";

test("renders deafult message when createdData and errorData are empty", () => {
  render(<OrderMessage createdData={{}} errorData={{}} />);
  const txtElement = screen.getByText(/Select a market and place an order/i);
  expect(txtElement).toBeInTheDocument();
});

test("renders error message when errorData is not empty", () => {
  render(<OrderMessage createdData={{}} errorData={{code: 422, message: 'oops'}} />);
  const txtElement = screen.getByText(/Error creating order/i);
  expect(txtElement).toBeInTheDocument();
});

test("renders created message when createdData is not empty", () => {
  render(<OrderMessage createdData={{side: 'ask', size: 2}} errorData={{}} />);
  const txtElement = screen.getByText(/Order created successfully/i);
  expect(txtElement).toBeInTheDocument();
});


