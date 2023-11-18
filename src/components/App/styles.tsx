import styled from "styled-components";
import { MOBILE_WIDTH } from "../../constants";

export const Container = styled.div`
  width: 100%;
  max-width: 100%;
`;

export const GridContainer = styled.div`
  max-width: 100%;
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

  @media (max-width: 1270px) {
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
