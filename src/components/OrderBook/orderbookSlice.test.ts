import reducer, {
  setBestAsk,
  setBestBid,
  setMarket,
} from "./orderbookSlice";

test("should return the initial state", () => {
  // @ts-ignore
  expect(reducer(undefined, {})).toEqual({
    market: "ETH/USD",
    rawBids: [],
    bids: [],
    maxTotalBids: 0,
    rawAsks: [],
    asks: [],
    maxTotalAsks: 0,
    groupingSize: 0.5,
    bestBid: [],
    bestAsk: [],
  });
});

test("should handle setting market", () => {
  expect(reducer(undefined, setMarket("BTC/GBP"))).toEqual({
    market: "BTC/GBP",
    rawBids: [],
    bids: [],
    maxTotalBids: 0,
    rawAsks: [],
    asks: [],
    maxTotalAsks: 0,
    groupingSize: 0.5,
    bestBid: [],
    bestAsk: [],
  });
});

test("should handle setting best bid", () => {
  expect(reducer(undefined, setBestBid([1, 2]))).toEqual({
    market: "ETH/USD",
    rawBids: [],
    bids: [],
    maxTotalBids: 0,
    rawAsks: [],
    asks: [],
    maxTotalAsks: 0,
    groupingSize: 0.5,
    bestBid: [1, 2],
    bestAsk: [],
  });
});

test("should handle setting best ask", () => {
  expect(reducer(undefined, setBestAsk([1, 2]))).toEqual({
    market: "ETH/USD",
    rawBids: [],
    bids: [],
    maxTotalBids: 0,
    rawAsks: [],
    asks: [],
    maxTotalAsks: 0,
    groupingSize: 0.5,
    bestBid: [],
    bestAsk: [1, 2],
  });
});
