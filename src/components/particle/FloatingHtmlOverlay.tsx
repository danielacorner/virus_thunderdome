import React, { useState } from "react";
import { useMount } from "../../utils/utils";
import { Html } from "@react-three/drei";
import styled from "styled-components/macro";
import { PROTEIN_TYPES } from "../../utils/PROTEINS";
import { useStore } from "../../store";
import { ICONS } from "../Game/WAVES";
import Block from "@material-ui/icons/GpsFixed";

export function FloatingHtmlOverlay({
  name,
  lifespan,
  type,
  virusHpPct,
  iconIdx = null,
}) {
  const Icon = iconIdx || iconIdx === 0 ? ICONS[iconIdx] : null;
  const showHp = useStore((s) => s.showHp);
  const [mounted, setMounted] = useState(false);
  useMount(() => {
    setTimeout(() => {
      // timeout to ensure bar starts 100% width
      setMounted(true);
    }, 1);
  });
  const isAntibody = type === PROTEIN_TYPES.antibody;

  return showHp ? (
    <Html>
      <HtmlOverlayStyles {...{ mounted, lifespan, type, virusHpPct }}>
        {Icon ? (
          <div className="icon">
            <Icon />
            {isAntibody ? (
              <div className="blockIcon">
                <Block />
              </div>
            ) : null}
          </div>
        ) : null}
        {/* <div className="name">{name}</div> */}
        <div className="hpBar">
          <div className="hp" />
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
  .icon {
    width: 100%;
    height: 100%;
    svg {
      position: absolute;
      top: -40px;
      right: -16px;
      width: 32px;
      height: 32px;
    }
    .blockIcon {
      opacity: 0.3;
      svg {
        transform: scale(1.6);
      }
      color: red;
    }
  }
  transform: translateY(16px);
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
