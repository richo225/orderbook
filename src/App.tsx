import React, { useEffect, useState } from "react";
import GlobalStyle from "./styles/global";
import Header from "./components/Header";
import OrderBook from "./components/OrderBook";
import Footer from "./components/Footer";
import StatusMessage from "./components/StatusMessage";
import OrderForm from "./components/OrderForm/orderForm";
import {
  clearOrdersState,
  selectMarket,
} from "./components/OrderBook/orderbookSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import OrderMessage from "./components/OrderMessage";
import { error } from "console";

export const MarketPairs = {
  ETHUSD: "ETH/USD",
  ETHGBP: "ETH/GBP",
  BTCUSD: "BTC/USD",
  BTCGBP: "BTC/GBP",
};

const options: any = Object.values(MarketPairs);

function App() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isFeedKilled, setIsFeedKilled] = useState(false);
  const [fetchOrders, setFetchOrders] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [createdData, setCreatedData] = useState({});
  const [errorData, setErrorData] = useState({});
  const market: string = useAppSelector(selectMarket);

  // Window width detection
  useEffect(() => {
    window.onresize = () => {
      setWindowWidth(window.innerWidth);
    };
    setWindowWidth(() => window.innerWidth);
  }, []);

  // Page Visibility detection
  useEffect(() => {
    // Set the name of the hidden property and the change event for visibility
    let hidden: string = "";
    let visibilityChange: string = "";

    if (typeof document.hidden !== "undefined") {
      // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else {
      // @ts-ignore
      if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
      } else {
        // @ts-ignore
        if (typeof document.webkitHidden !== "undefined") {
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
        }
      }
    }

    const handleVisibilityChange = () => {
      const isHidden = document["hidden"];
      if (isHidden) {
        document.title = "Orderbook Paused";
        setIsPageVisible(false);
      } else {
        document.title = "Orderbook";
        setIsPageVisible(true);
      }
    };

    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || hidden === "") {
      console.log(
        "This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API."
      );
    } else {
      // Handle page visibility change
      document.addEventListener(
        visibilityChange,
        handleVisibilityChange,
        false
      );
    }
  }, []);

  const toggleFeed = (): void => {
    setIsFeedKilled(!isFeedKilled);
  };

  const fetchOrdersCallback = (): void => {
    setFetchOrders(!fetchOrders);
  };

  const setErrorDataCallback = (data: object): void => {
    setErrorData(data);
  };

  const setCreatedDataCallback = (data: object): void => {
    setCreatedData(data);
  };

  return (
    <>
      {isPageVisible ? (
        <>
          <GlobalStyle />
          <Header options={options} />
          <OrderBook
            windowWidth={windowWidth}
            market={market}
            isFeedKilled={isFeedKilled}
            fetchOrders={fetchOrders}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1fr",
              gap: "20px",
              padding: "5px"
            }}
          >
            <div>
              <OrderForm
                market={market}
                fetchOrdersCallback={fetchOrdersCallback}
                setCreatedDataCallback={setCreatedDataCallback}
                setErrorDataCallback={setErrorDataCallback}
              />
            </div>
            <div style={{ borderLeft: "1px solid #29303e", borderRight: "1px solid #29303e" }}>
              <OrderMessage errorData={errorData} createdData={createdData} />
            </div>
            <div>
              <Footer
                toggleFeedCallback={clearOrdersState}
                killFeedCallback={toggleFeed}
                isFeedKilled={isFeedKilled}
              />
              <StatusMessage
                isFeedKilled={isFeedKilled}
                selectedMarket={market}
              />
            </div>
          </div>
        </>
      ) : (
        "HIDDEN PAGE."
      )}
    </>
  );
}

export default App;
