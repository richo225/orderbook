import React from "react";
import { render, screen } from "@testing-library/react";

import StatusMessage from "./index";

test("renders StatusMessage component when feed is active", () => {
  render(
    <StatusMessage
      selectedMarket={"ETH/USD"}
      isFeedKilled={false}
      isBookReset={false}
    />
  );
  const txtElement = screen.getByText(/Selected market: ETH\/USD/i);
  expect(txtElement).toBeInTheDocument();
});

test("renders StatusMessage component when feed is killed", () => {
  render(
    <StatusMessage
      selectedMarket={"ETH/USD"}
      isFeedKilled={true}
      isBookReset={false}
    />
  );
  const txtElement = screen.getByText(/Feed killed./i);
  expect(txtElement).toBeInTheDocument();
});

test("renders StatusMessage component when feed is reset", () => {
  render(
    <StatusMessage
      selectedMarket={"ETH/USD"}
      isFeedKilled={false}
      isBookReset={true}
    />
  );
  const txtElement = screen.getByText(/Order books reset./i);
  expect(txtElement).toBeInTheDocument();
});
