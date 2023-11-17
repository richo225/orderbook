import React from "react";
import { render, screen } from "@testing-library/react";

import OrderMessage from "./index";

test("renders OrderMessage component when order is created", () => {
  render(<OrderMessage isCreated={true} />);
  const txtElement = screen.getByText(/Order successfully placed/i);
  expect(txtElement).toBeInTheDocument();
});

test("renders OrderMessage component when order not created", () => {
  render(<OrderMessage isCreated={false} />);
  const txtElement = screen.getByText(/Order successfully placed/i);
  expect(txtElement).not.toBeInTheDocument();
});
