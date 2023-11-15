import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { MarketSelectBox } from './index';

const initialState = {
  orderbook: {
    market: 'ETH/USD'
  }
};
const mockStore = configureStore();

test('renders a select box with certain market options', () => {
  const store = mockStore(initialState)

  render(<Provider store={store}><MarketSelectBox options={['ETH/USD', 'ETH/GBP']}/></Provider>);
  const selectElement = screen.getByTestId(/market/i);
  expect(selectElement).toBeInTheDocument();
  let optionElement = screen.getByText(/Market ETH/i);
  expect(optionElement).toBeInTheDocument();

  render(<Provider store={store}><MarketSelectBox options={['BTC/USD', 'BTC/GBP']}/></Provider>);
  optionElement = screen.getByText(/Market BTC/i);
  expect(optionElement).toBeInTheDocument();
});
