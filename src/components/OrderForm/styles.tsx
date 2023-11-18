import styled from "styled-components";

export const Container = styled.div`
  color: white;
  font-size: 1.2em;
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  padding: 0.5em;
  padding-top: 0em;
`;

export const Form = styled.div`
  form {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  label {
    margin: 0.2em 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    align-items: start;
  }

  select,
  input {
    border-radius: 3px;
    padding: 0.4em;
    color: white;
    border: none;
    background-color: #303947;
    &:hover {
      cursor: pointer;
    }
  }

  button {
    padding: 0.3em 0.7em;
    margin: 1em auto  ;
    border-radius: 4px;
    border: none;
    color: white;
    background: #118860;
    font-size: 1.0em;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
`;
