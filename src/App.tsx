import React, { useEffect, useState } from "react";
import GlobalStyle from "./styles/global";
import Header from "./components/Header";
import OrderBook from "./components/OrderBook";
import Footer from "./components/Footer";
import StatusMessage from "./components/StatusMessage";
import OrderForm from "./components/OrderForm/orderForm";
import styled from "styled-components";
import { MOBILE_WIDTH } from "./constants";
import {
  clearOrdersState,
  selectMarket,
} from "./components/OrderBook/orderbookSlice";
import { useAppSelector } from "./hooks";
import OrderMessage from "./components/OrderMessage";
import axios from "axios";

export const MarketPairs = {
  ETHUSD: "ETH/USD",
  ETHGBP: "ETH/GBP",
  BTCUSD: "BTC/USD",
  BTCGBP: "BTC/GBP",
};

const options: any = Object.values(MarketPairs);

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  grid-template-areas: "orderform ordermessage footer";
  gap: 20px;
  padding: 5px;

  .footer {
    grid-area: footer;
    position: relative;
  }

  .orderform {
    grid-area: orderform;
    position: relative;
  }

  .ordermessage {
    grid-area: ordermessage;
    position: relative;
  }

  .ordermessage::before {
    content: "";
    position: absolute;
    top: 10%;
    bottom: 10%;
    right: 0;
    left: 0;
    border-left: 1px solid #29303e;
    border-right: 1px solid #29303e;
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "orderform footer"
      "ordermessage ordermessage";

      .orderform::before {
        content: "";
        position: absolute;
        top: 10%;
        bottom: 10%;
        right: 0;
        border-right: 1px solid #29303e;
      }
      
      .orderform::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 10%;
        right: 10%;
        border-bottom: 1px solid #29303e;
      }

      .footer::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 5%;
        right: 10%; /* Adjust this to change the ending point of the border */
        border-bottom: 1px solid #29303e;
      }

    ordermessage {
      border: none !important;
    }
  }

  @media (max-width: ${MOBILE_WIDTH}px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "footer"
      "orderform"
      "ordermessage";

    .orderform {
      border: none !important;
      border-bottom: 1px solid #29303e;
    }
    .footer {
      border: none !important;
      border-bottom: 1px solid #29303e;
      padding-bottom: 2em;
    }
    .ordermessage {
      border: none !important;
    }
  }
`;

function App() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [isFeedKilled, setIsFeedKilled] = useState(false);
  const [isBookReset, setIsBookReset] = useState(false);
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

  const resetOrderBooks = (): void => {
    axios.get("http://localhost:8080/orderbooks/reset").then((response) => {
      setIsBookReset(true);
      setFetchOrders(!fetchOrders);
    }).catch((error) => {
      setErrorData(error);
    });
  };

  const killFeed = () => {
    setIsFeedKilled(!isFeedKilled);
    setIsBookReset(false);
  }

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
          <GridContainer>
            <div className="orderform">
              <OrderForm
                market={market}
                fetchOrdersCallback={fetchOrdersCallback}
                setCreatedDataCallback={setCreatedDataCallback}
                setErrorDataCallback={setErrorDataCallback}
              />
            </div>
            <div className="ordermessage">
              <OrderMessage errorData={errorData} createdData={createdData} />
            </div>
            <div className="footer">
              <Footer
                resetOrderBooksCallback={resetOrderBooks}
                killFeedCallback={killFeed}
                isFeedKilled={isFeedKilled}
              />
              <StatusMessage
                isBookReset={isBookReset}
                isFeedKilled={isFeedKilled}
                selectedMarket={market}
              />
            </div>
          </GridContainer>
        </>
      ) : (
        "HIDDEN PAGE."
      )}
    </>
  );
}

export default App;
