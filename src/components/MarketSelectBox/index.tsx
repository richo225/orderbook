import { ChangeEvent, FunctionComponent } from "react";

import { Container } from "./Container";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectMarket, setMarket } from "../OrderBook/orderbookSlice";

interface MarketSelectBoxProps {
  options: string[];
}

export const MarketSelectBox: FunctionComponent<MarketSelectBoxProps> = ({
  options,
}) => {
  const market: string = useAppSelector(selectMarket);
  const dispatch = useAppDispatch();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setMarket(event.target.value));
  };

  return (
    <Container>
      <select
        data-testid="market"
        name="market"
        onChange={handleChange}
        defaultValue={market}
      >
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            Market {option}
          </option>
        ))}
      </select>
    </Container>
  );
};

export default MarketSelectBox;
