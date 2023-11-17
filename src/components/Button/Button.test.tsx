import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "./index";

test("renders button with title", () => {
  render(
    <Button backgroundColor={"red"} callback={jest.fn} title={"Kill Feed"} />
  );
  const btnElement = screen.getByText(/Kill Feed/i);
  expect(btnElement).toBeInTheDocument();
});
