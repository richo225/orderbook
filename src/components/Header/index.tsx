import React, { FunctionComponent } from 'react';

import { Container } from "./styles";
import MarketSelectBox from "../MarketSelectBox";

interface HeaderProps {
  options: string[];
}

const Header: FunctionComponent<HeaderProps> = ({options}) => {
  return (
    <Container>
      <h3>Order Book</h3>
      <MarketSelectBox options={options} />
    </Container>
  );
};

export default Header;
