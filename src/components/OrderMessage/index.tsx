import React, { FunctionComponent } from "react";
import { Container } from "./styles";
import { DEFAULT_ORDER_DATA } from "../../constants";


interface OrderMessageProps {
  createdData: object;
  errorData: object;
}

const isEmpty = (obj: object) => Object.keys(obj).length === 0;

const OrderMessage: FunctionComponent<OrderMessageProps> = ({
  errorData,
  createdData,
}) => {
  return (
    <Container>
      {!isEmpty(errorData) ? (
        <ErrorBlock errorData={errorData} />
      ) : !isEmpty(createdData) ? (
        <CreatedBlock createdData={createdData} />
      ) : 
        <Defaultblock />
      }
    </Container>
  );
};

const CreatedBlock = ({ createdData }: any) => {
  return (
    <div>
      Order created successfully:
      <br />
      <br />
      <pre>{JSON.stringify(createdData, null, 4)}</pre>
    </div>
  );
};

const ErrorBlock = ({ errorData }: any) => {
  return (
    <div>
      Error creating order:
      <br />
      <br />
      <pre>{JSON.stringify(errorData, null, 4)}</pre>
    </div>
  );
};

const Defaultblock = () => {
  return (
    <div>
      Select a market and place an order.
      <br />
      <br />
      <pre>{JSON.stringify(DEFAULT_ORDER_DATA, null, 4)}</pre>
    </div>
  );
}

export default OrderMessage;
