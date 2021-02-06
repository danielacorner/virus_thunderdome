import React from "react";
import styled from "styled-components/macro";
import { TemperatureControls } from "./TemperatureControls";

const SideControls = () => {
  return (
    <Styles>
      <TemperatureControls />
    </Styles>
  );
};
const Styles = styled.div`
  position: fixed;
  right: 16px;
  bottom: 124px;
  height: calc(100vh - 248px);
  min-height: 50vh;
`;

export default SideControls;
