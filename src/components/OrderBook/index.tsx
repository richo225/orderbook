import React, { FunctionComponent, useEffect, useState } from "react";

import TitleRow from "./TitleRow";
import { Container, TableContainer } from "./styles";
import PriceLevelRow from "./PriceLevelRow";
import Spread from "../Spread";
import { MOBILE_WIDTH, ORDERBOOK_LEVELS } from "../../constants";
import Loader from "../Loader";
import DepthVisualizer from "../DepthVisualizer";
import { PriceLevelRowContainer } from "./PriceLevelRow/styles";
import { formatNumber } from "../../helpers";
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
}

const OrderBook: FunctionComponent<OrderBookProps> = ({
  windowWidth,
  market,
  isFeedKilled,
}) => {
  const [asks, setAsks] = useState<number[][]>([]);
  const [bids, setBids] = useState<number[][]>([]);
  const dispatch = useAppDispatch();

  const fetchOrderbook = () => {
    if (isFeedKilled) return;

    const base = market.split("/")[0];
    const quote = market.split("/")[1];

    axios
      .get(`http://localhost:8080/orderbooks?base=${base}&quote=${quote}`)
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
  }, [market, isFeedKilled]);

  const processData = (response: any) => {
    const data: { asks: number[][]; bids: number[][] } = {
      asks: [],
      bids: [],
    };

    var totalTotalVolume = 0;
    for (const ask of response.data.asks) {
      var array = [];
      array.push(ask.price);
      array.push(ask.total_volume);
      totalTotalVolume += ask.total_volume;
      array.push(totalTotalVolume);
      data.asks.push(array);
    }

    for (const ask of data.asks) {
      ask.push(ask[2] / totalTotalVolume);
      ask[3] = parseFloat((ask[3] * 100).toFixed(2));
    }

    totalTotalVolume = 0;
    for (const bid of response.data.bids) {
      var array = [];
      array.push(bid.price);
      array.push(bid.total_volume);
      totalTotalVolume += bid.total_volume;
      array.push(totalTotalVolume);
      data.bids.push(array);
    }

    for (const bid of data.bids) {
      bid.push(bid[2] / totalTotalVolume);
      bid[3] = parseFloat((bid[3] * 100).toFixed(2));
    }

    setAsks(data.asks);
    setBids(data.bids);

    dispatch(setBestAsk(data.asks[data.asks.length - 1]));
    dispatch(setBestBid(data.bids[0]));
  };

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", {
      useGrouping: true,
      minimumFractionDigits: 2,
    });
  };

  const buildPriceLevels = (
    levels: number[][],
    orderType: OrderType = OrderType.BIDS
  ): React.ReactNode => {
    console.log("Levels", levels);
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
