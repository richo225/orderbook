import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./index";

test("renders two button when feed is active", () => {
  render(
    <Footer
      resetOrderBooksCallback={jest.fn}
      killFeedCallback={jest.fn}
      isFeedKilled={false}
    />
  );
  const resetBooksButton = screen.getByText(/Reset Books/i);
  expect(resetBooksButton).toBeInTheDocument();

  const killFeedButton = screen.getByText(/Kill feed/i);
  expect(killFeedButton).toBeInTheDocument();
});

test("renders `Renew feed` button when feed is not active", () => {
  render(
    <Footer
      resetOrderBooksCallback={jest.fn}
      killFeedCallback={jest.fn}
      isFeedKilled={true}
    />
  );
  const renewFeedButton = screen.getByText(/Renew feed/i);
  expect(renewFeedButton).toBeInTheDocument();
});
