import styled from "styled-components";

interface ContainerProps {
  backgroundColor: string;
}

export const Container = styled.button<ContainerProps>`
  padding: 0.3em 0.7em;
  margin: 1em;
  border-radius: 4px;
  border: none;
  color: white;
  background: ${(props) => props.backgroundColor};
  font-size: 1.1em;

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
