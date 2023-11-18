import { FunctionComponent } from "react";

import { Container } from "./styles";
import MarketSelectBox from "../MarketSelectBox";
import { GithubIcon } from "../Icons/GithubIcon";

interface HeaderProps {
  options: string[];
}

const Header: FunctionComponent<HeaderProps> = ({ options }) => {
  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ margin: 0 }}>Octgopus</h3>
        </a>
        <a href="https://www.github.com/richo225/octgopus" target="_blank" rel="noopener noreferrer">
          <GithubIcon viewBox="0 0 100 100" style={{ paddingLeft: '1em', height: '1.7em', width: 'auto', alignSelf: 'center' }} />
        </a>
      </div>
      <MarketSelectBox options={options} />
    </Container>
  );
};

export default Header;