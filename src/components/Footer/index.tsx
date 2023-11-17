import React, { FunctionComponent } from "react";

import { Container } from "./styles";
import Button from "../Button";

interface FooterProps {
  resetOrderBooksCallback: () => void;
  killFeedCallback: () => void;
  isFeedKilled: boolean;
}

const Footer: FunctionComponent<FooterProps> = ({
  resetOrderBooksCallback,
  killFeedCallback,
  isFeedKilled,
}) => {
  return (
    <Container>
      {!isFeedKilled && (
        <Button
          title={"Reset Books"}
          backgroundColor={"#5741d9"}
          callback={resetOrderBooksCallback}
        />
      )}
      <Button
        title={isFeedKilled ? "Renew Feed" : "Kill Feed"}
        backgroundColor={"#b91d1d"}
        callback={killFeedCallback}
      />
    </Container>
  );
};

export default Footer;
