import React, { FunctionComponent, useState, useEffect } from "react";

import { Container, Form } from "./styles";
import axios from "axios";
import { useAppSelector } from "../../hooks";
import { selectBestAsk, selectBestBid } from "../OrderBook/orderbookSlice";

export enum OrderType {
  BIDS,
  ASKS,
}

interface OrderFormProps {
  market: string;
  fetchOrdersCallback: () => void;
  setCreatedDataCallback: (data: object) => void;
  setErrorDataCallback: (data: object) => void;
}

const OrderForm: FunctionComponent<OrderFormProps> = ({
  market,
  fetchOrdersCallback,
  setCreatedDataCallback,
  setErrorDataCallback,
}) => {
  const bestAsk: number[] = useAppSelector(selectBestAsk);
  const bestBid: number[] = useAppSelector(selectBestBid);

  const [price, setPrice] = useState<string | undefined>(undefined);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [orderType, setOrderType] = useState("limit");
  const [orderSide, setOrderSide] = useState("ask");

  useEffect(() => {
    if (price === undefined && size === undefined) {
      if (orderSide === "ask" && bestAsk.length > 0) {
        setPrice(bestAsk[0].toString());
        setSize(bestAsk[1].toString());
      } else if (orderSide === "bid" && bestBid.length > 0) {
        setPrice(bestBid[0].toString());
        setSize(bestBid[1].toString());
      }
    }
  }, [market, bestAsk, bestBid]);

  useEffect(() => {
    setCreatedDataCallback({});
    setErrorDataCallback({});
    setPrice(undefined);
    setSize(undefined);
    setOrderSide("ask");
  }, [market]);

  const handleSideChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCreatedDataCallback({});
    setErrorDataCallback({});
    setOrderSide(e.target.value);

    if (e.target.value === "bid" && bestBid.length > 0) {
      setPrice(bestBid[0].toString());
      setSize(bestBid[1].toString());
    } else if (e.target.value === "ask" && bestAsk.length > 0) {
      setPrice(bestAsk[0].toString());
      setSize(bestAsk[1].toString());
    }
  };

  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCreatedDataCallback({});
    setErrorDataCallback({});
    setOrderType(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_OCTGOPUS_API_URL}/orders`, {
        base: market.split("/")[0],
        quote: market.split("/")[1],
        price: Number(price),
        size: Number(size),
        type: orderType,
        side: orderSide,
      })
      .then((response) => {
        setCreatedDataCallback(response.data);
        fetchOrdersCallback();
      })
      .catch((error) => {
        setErrorDataCallback(error.response.data);
      });
  };

  return (
    <Container>
      <Form>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Side:
              <select value={orderSide} onChange={handleSideChange}>
                <option value="bid">BID</option>
                <option value="ask">ASK</option>
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Type:
              <select value={orderType} onChange={handleOrderTypeChange}>
                <option value="limit">LIMIT</option>
                <option value="market">MARKET</option>
              </select>
            </label>
          </div>
          {orderType !== "market" && (
            <div className="form-group">
              <label>
                Price:
                <input
                  type="number"
                  step="any"
                  min="0.000000000001"
                  value={price}
                  onChange={(e) => setPrice((e.target.value))}
                />
              </label>
            </div>
          )}
          <div className="form-group">
            <label>
              Size:
              <input
                type="number"
                step="any"
                min="0.000000000001"
                value={size}
                onChange={(e) => setSize((e.target.value))}
              />
            </label>
          </div>
          <button type="submit">Submit Order</button>
        </form>
      </Form>
    </Container>
  );
};

export default OrderForm;
