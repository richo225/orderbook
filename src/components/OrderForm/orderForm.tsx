import React, { FunctionComponent, useState } from "react";

import { Container, Form } from "./styles";
import axios from "axios";

export enum OrderType {
  BIDS,
  ASKS,
}

interface OrderFormProps {
  market: string;
}

const OrderForm: FunctionComponent<OrderFormProps> = ({market}) => {
  const [price, setPrice] = useState(Number(0.000));
  const [size, setSize] = useState(Number(0.000));
  const [orderType, setOrderType] = useState('limit');
  const [orderSide, setOrderSide] = useState('ask');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.post('http://localhost:8080/orders', {
      base: market.split('/')[0],
      quote: market.split('/')[1],
      price: price,
      size: size,
      type: orderType,
      side: orderSide
    });
  };

  return (
    <Container>
      <Form>
        <form onSubmit={handleSubmit}>
          <label>
            Side:
            <select value={orderSide} onChange={e => setOrderSide(e.target.value)}>
              <option value="bid">BID</option>
              <option value="ask">ASK</option>
            </select>
          </label>
          <label>
            Type:
            <select value={orderType} onChange={e => setOrderType(e.target.value)}>
              <option value="limit">LIMIT</option>
              <option value="market">MARKET</option>
            </select>
          </label>
          <label>
            Price:
            <input type="number" step="0.001" value={price} onChange={e => setPrice(Number(e.target.value))} />
          </label>
          <label>
            Size:
            <input type="number" step="0.001" value={size} onChange={e => setSize(Number(e.target.value))} />
          </label>
          <button type="submit">Submit Order</button>
        </form>
      </Form>
    </Container>
  );
};

export default OrderForm;
