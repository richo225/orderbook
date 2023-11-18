import { FunctionComponent } from "react";

import { Container } from "./styles";
import MarketSelectBox from "../MarketSelectBox";

interface HeaderProps {
  options: string[];
}

const Header: FunctionComponent<HeaderProps> = ({ options }) => {
  return (
    <Container>
      <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>Octgopus</h3>
      </a>
      <MarketSelectBox options={options} />
    </Container>
  );
};

export default Header;
