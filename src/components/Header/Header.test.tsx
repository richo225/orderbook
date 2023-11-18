import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import Header from "./index";

const initialState = {
  orderbook: {
    market: "ETH/USD",
  },
};

const mockStore = configureStore();
const store = mockStore(initialState);

test("renders header component with text", () => {
  render(
    <Provider store={store}>
      <Header options={["ETH/USD", "ETH/GBP"]} />
    </Provider>
  );
  const txtElement = screen.getByText(/Octgopus/i);
  expect(txtElement).toBeInTheDocument();
});
