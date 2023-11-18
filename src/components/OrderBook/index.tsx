import React, { FunctionComponent, useEffect, useState } from "react";

import TitleRow from "./TitleRow";
import { Container, TableContainer } from "./styles";
import PriceLevelRow from "./PriceLevelRow";
import Spread from "../Spread";
import { MOBILE_WIDTH } from "../../constants";
import Loader from "../Loader";
import DepthVisualizer from "../DepthVisualizer";
import { PriceLevelRowContainer } from "./PriceLevelRow/styles";
import { formatNumber, formatPrice } from "../../helpers";
import axios from "axios";
import { useAppDispatch } from "../../hooks";
import { setBestBid, setBestAsk } from "../OrderBook/orderbookSlice";

export enum OrderType {
  BIDS,
  ASKS,
}

interface OrderBookProps {
  windowWidth: number;
  market: string;
  isFeedKilled: boolean;
  fetchOrders: boolean;
}

const OrderBook: FunctionComponent<OrderBookProps> = ({
  windowWidth,
  market,
  isFeedKilled,
  fetchOrders,
}) => {
  const [asks, setAsks] = useState<number[][]>([]);
  const [bids, setBids] = useState<number[][]>([]);
  const dispatch = useAppDispatch();

  const fetchOrderbook = () => {
    if (isFeedKilled) return;

    const base = market.split("/")[0];
    const quote = market.split("/")[1];

    axios
      .get(`${process.env.REACT_APP_OCTGOPUS_API_URL}/orderbooks?base=${base}&quote=${quote}`)
      .then((response) => {
        processData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchOrderbook();
    const interval = setInterval(() => {
      fetchOrderbook();
    }, 5000);
    return () => clearInterval(interval);
  }, [market, isFeedKilled, fetchOrders]);

  const processData = (response: any) => {
    const data: { asks: number[][]; bids: number[][] } = {
      asks: [],
      bids: [],
    };

    var totalTotalVolume = 0;
    for (const ask of response.data.asks) {
      var askArray = [];
      askArray.push(ask.price);
      askArray.push(ask.total_volume);
      totalTotalVolume += ask.total_volume;
      askArray.push(totalTotalVolume);
      data.asks.push(askArray);
    }

    for (const ask of data.asks) {
      ask.push(ask[2] / totalTotalVolume);
      ask[3] = parseFloat((ask[3] * 100).toFixed(2));
    }

    totalTotalVolume = 0;
    for (const bid of response.data.bids) {
      var bidArray = [];
      bidArray.push(bid.price);
      bidArray.push(bid.total_volume);
      totalTotalVolume += bid.total_volume;
      bidArray.push(totalTotalVolume);
      data.bids.push(bidArray);
    }

    for (const bid of data.bids) {
      bid.push(bid[2] / totalTotalVolume);
      bid[3] = parseFloat((bid[3] * 100).toFixed(2));
    }

    setAsks(data.asks);
    setBids(data.bids);

    dispatch(setBestAsk(data.asks[data.asks.length - 1]));
    dispatch(setBestBid(data.bids[data.bids.length - 1]));
  };

  const buildPriceLevels = (
    levels: number[][],
    orderType: OrderType = OrderType.BIDS
  ): React.ReactNode => {
    const sortedLevelsByPrice: number[][] = [...levels].sort(
      (currentLevel: number[], nextLevel: number[]): number => {
        let result: number = 0;
        if (orderType === OrderType.BIDS || windowWidth < MOBILE_WIDTH) {
          result = nextLevel[0] - currentLevel[0];
        } else {
          result = currentLevel[0] - nextLevel[0];
        }
        return result;
      }
    );

    return sortedLevelsByPrice.map((level, idx) => {
      const calculatedTotal: number = level[2];
      const total: string = formatNumber(calculatedTotal);
      const depth = level[3];
      const size: string = formatNumber(level[1]);
      const price: string = formatPrice(level[0]);

      return (
        <PriceLevelRowContainer key={idx + depth}>
          <DepthVisualizer
            key={depth}
            windowWidth={windowWidth}
            depth={depth}
            orderType={orderType}
          />
          <PriceLevelRow
            key={size + total}
            total={total}
            size={size}
            price={price}
            reversedFieldsOrder={orderType === OrderType.ASKS}
            windowWidth={windowWidth}
          />
        </PriceLevelRowContainer>
      );
    });
  };

  return (
    <Container>
      {bids.length && asks.length ? (
        <>
          <TableContainer>
            {windowWidth > MOBILE_WIDTH && (
              <TitleRow windowWidth={windowWidth} reversedFieldsOrder={false} />
            )}
            <div>{buildPriceLevels(bids, OrderType.BIDS)}</div>
          </TableContainer>
          <Spread bids={bids} asks={asks} />
          <TableContainer>
            <TitleRow windowWidth={windowWidth} reversedFieldsOrder={true} />
            <div>{buildPriceLevels(asks, OrderType.ASKS)}</div>
          </TableContainer>
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default OrderBook;
