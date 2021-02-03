import React, { useState } from "react";
import { useMount } from "../../utils/utils";
import { Html } from "@react-three/drei";
import styled from "styled-components/macro";
import { PROTEIN_TYPES } from "../../utils/PROTEINS";
import { useStore } from "../../store";

export function FloatingHtmlOverlay({ name, lifespan, type, virusHpPct }) {
  const showHp = useStore((s) => s.showHp);
  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setTimeout(() => {
      // timeout to ensure bar starts 100% width
      setMounted(true);
    }, 1);
  });

  return showHp ? (
    <Html>
      <HtmlOverlayStyles {...{ mounted, lifespan, type, virusHpPct }}>
        <div className="name">{name}</div>
        <div className="hpBar">
          <div className="hp"></div>
        </div>
      </HtmlOverlayStyles>
    </Html>
  ) : null;
}

type HtmlOverlayProps = {
  type: keyof typeof PROTEIN_TYPES;
  virusHpPct: number;
  lifespan: number;
  mounted: boolean;
};

const HtmlOverlayStyles = styled.div<HtmlOverlayProps>`
  pointer-events: none;
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
        ${(p) => {
          return p.type === PROTEIN_TYPES.antibody && p.mounted
            ? 0
            : p.type === PROTEIN_TYPES.virus && p.virusHpPct
            ? p.virusHpPct
            : 1;
        }}
      );
      transform-origin: left;
    }
  }
`;
