import { useEffect, useState } from "react";
import GlobalStyle from "../../styles/global";
import Header from "../Header";
import OrderBook from "../OrderBook";
import Footer from "../Footer";
import StatusMessage from "../StatusMessage";
import OrderForm from "../OrderForm";
import OrderMessage from "../OrderMessage";
import { GridContainer } from "./styles";
import { selectMarket } from "../OrderBook/orderbookSlice";
import { useAppSelector } from "../../hooks";
import { MarketPairs } from "../../constants";
import axios from "axios";

const options: any = Object.values(MarketPairs);

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
    axios
      .get(`${process.env.REACT_APP_OCTGOPUS_API_URL}/orderbooks/reset`)
      .then((response) => {
        setIsBookReset(true);
        setFetchOrders(!fetchOrders);
      })
      .catch((error) => {
        setErrorData(error);
      });
  };

  const killFeed = () => {
    setIsFeedKilled(!isFeedKilled);
    setIsBookReset(false);
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
