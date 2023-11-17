import React, { FunctionComponent } from 'react';
import { Container } from "./styles";

interface StatusMessageProps {
  selectedMarket: string;
  isFeedKilled: boolean;
  isBookReset: boolean;
}

const StatusMessage: FunctionComponent<StatusMessageProps> = ({selectedMarket = '', isFeedKilled, isBookReset}) => {
  return (
    <Container>
      {isFeedKilled ? 'Feed killed.' : `Selected market: ${selectedMarket}`}
      <br></br>
      <br></br>
      {isBookReset && 'Order books reset.'}
    </Container>
  );
};

export default StatusMessage;
