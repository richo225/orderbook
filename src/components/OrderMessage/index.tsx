import React, { FunctionComponent } from 'react';
import { Container } from "./styles";

interface OrderMessageProps {
  isCreated: boolean;
}

const OrderMessage: FunctionComponent<OrderMessageProps> = ({isCreated}) => {
  return (
    <Container>
      {isCreated && 'Order successfully placed'}
    </Container>
  );
};

export default OrderMessage;
