import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import styled from "styled-components/macro";

export function IncomingWarning() {
  const currentWave = useStore((s) => s.currentWave);

  // when the wave changes, show "incoming!!",
  // then stop after a bit
  const [isIncoming, setIsIncoming] = useState(false);
  useEffect(() => {
    if(currentWave){
    setIsIncoming(true);
    }
    setTimeout(() => {
      setIsIncoming(false);
    }, 6 * 1000);
  }, [currentWave]);

  return isIncoming ? (
    <IncomingStyles>
      <div className="text">Wave {currentWave} Incoming!!</div>
    </IncomingStyles>
  ) : null;
}
const IncomingStyles = styled.div`
  font-size: 2em;
  color: #f0461b;
  .text {
    white-space: nowrap;
  }
  animation-name: appearDisappear;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  display: grid;
  place-items: center;

  @keyframes appearDisappear {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
