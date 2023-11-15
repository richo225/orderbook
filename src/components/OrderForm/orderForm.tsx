import React, { FunctionComponent, useState, useEffect } from "react";

import { Container, Form } from "./styles";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectBestAsk, selectBestBid } from "../OrderBook/orderbookSlice";

export enum OrderType {
  BIDS,
  ASKS,
}

interface OrderFormProps {
  market: string;
}

const OrderForm: FunctionComponent<OrderFormProps> = ({market}) => {
  const bestAsk: number[] = useAppSelector(selectBestAsk);
  const bestBid: number[] = useAppSelector(selectBestBid);

  const [price, setPrice] = useState<number | undefined>(undefined);
  const [size, setSize] = useState<number | undefined>(undefined);
  const [orderType, setOrderType] = useState('limit');
  const [orderSide, setOrderSide] = useState('ask');

  useEffect(() => {
    setPrice(undefined);
    setSize(undefined);
  }, [market]);

  useEffect(() => {
    if (bestAsk.length > 0 && price === undefined) {
      setPrice(bestAsk[0]);
    }
    if (bestAsk.length > 0 && size === undefined) {
      setSize(bestAsk[1]);
    }
  }, [bestAsk, price, size]);

  const handleSideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderSide(e.target.value);
    
    if (e.target.value === 'bid' && bestBid.length > 0) {
      setPrice(bestBid[0]);
      setSize(bestBid[1]);
    } else if (e.target.value === 'ask' && bestAsk.length > 0) {
      setPrice(bestAsk[0]);
      setSize(bestAsk[1]);
    }
  };


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
            <select value={orderSide} onChange={handleSideChange}>
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
