import React, { useState } from "react";
import { useMount } from "../../utils/utils";
import { HTML } from "@react-three/drei";
import styled from "styled-components/macro";
import { PROTEIN_TYPES } from "../../utils/PROTEINS";

export function HTMLInfo({ name, lifespan, type }) {
  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setTimeout(() => {
      // timeout to ensure bar starts 100% width
      setMounted(true);
    }, 1);
  });

  return (
    <HTML>
      <HTMLInfoStyles {...{ mounted, lifespan, type }}>
        <div className="name">{name}</div>
        <div className="hpBar">
          <div className="hp"></div>
        </div>
      </HTMLInfoStyles>
    </HTML>
  );
}

const HTMLInfoStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 0;
  .name {
    font-size: 8px;
    font-weight: bold;
    white-space: nowrap;
    text-shadow: 0px 0px 2px white, 0px 0px 6px white;
    padding-bottom: 0.5em;
    text-align: center;
  }
  .hpBar {
    width: 50px;
    height: 5px;
    outline: 1px solid grey;
    .hp {
      width: 100%;
      height: 100%;
      background: ${(p) =>
        p.type === PROTEIN_TYPES.antibody
          ? "cornflowerblue"
          : p.type === PROTEIN_TYPES.virus
          ? "limegreen"
          : "none"};
      transition: transform ${(p) => p.lifespan}ms linear;
      transform: scaleX(
        ${(p) => (p.type === PROTEIN_TYPES.antibody && p.mounted ? 0 : 1)}
      );
      transform-origin: left;
    }
  }
`;
