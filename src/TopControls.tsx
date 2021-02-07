import React from "react";
import styled from "styled-components/macro";
import { ScaleControls } from "./ScaleControls";

const StyledDiv = styled.div``;
export default function TopControls() {
  return (
    <StyledDiv
      css={`
        position: fixed;
        top: 16px;
        left: 30vw;
        right: 30vw;
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        grid-gap: 2em;
      `}
    >
      <ScaleControls />
      {/* <ShuffleControls /> */}
    </StyledDiv>
  );
}
