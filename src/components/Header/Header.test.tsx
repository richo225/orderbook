import { render, screen } from "@testing-library/react";
import configureStore from "redux-mock-store";

import Header from "./index";

const mockStore = configureStore();

test("renders header component with text", () => {
  render(<Header options={["ETH/USD", "ETH/GBP"]} />);
  const txtElement = screen.getByText(/Octgopus/i);
  expect(txtElement).toBeInTheDocument();
});
