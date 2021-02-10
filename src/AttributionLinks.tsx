import { IconButton, Modal } from "@material-ui/core";
import { GitHub } from "@material-ui/icons";
import React, { useState } from "react";
import styled from "styled-components/macro";

export function AttributionLinks() {
  // TODO: show when you finish the levels
  // TODO: show on iconbutton click
  const [open, setOpen] = useState(false);
  return (
    <AttributionLinksStyles>
      <BtnOpenModal {...{ setOpen }} />
      <Modal open={open}>
        <div className="modalContent">
          <div>
            <div className="mediaType">Music</div>
            <div className="source">
              Nõpi - Aqiral (Mixed) -
              https://www.traxsource.com/artist/587036/nopi
            </div>
          </div>

          <div>
            <div className="mediaType">Code</div>
            <div className="source">
              https://github.com/danielacorner/virus_thunderdome
            </div>
          </div>

          <div>
            <div className="mediaType">Protein Data</div>
            <div className="source">rcdsb.org</div>
          </div>

          <div>
            <div className="mediaType">3d Models</div>
            <div className="source">
              UCSF ChimeraX https://www.cgl.ucsf.edu/chimerax/
            </div>
          </div>

          <div>
            <div className="mediaType">Icons</div>
            <div className="source">
              <a href="https://www.freepik.com" title="Freepik">
                Freepik
              </a>
              from
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </AttributionLinksStyles>
  );
}
const AttributionLinksStyles = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  .btnOpenModal {
  }
  .modalContent {
    .mediaType {
    }
    .source {
    }
  }
`;

function BtnOpenModal({ setOpen }) {
  return (
    <IconButton className="btnOpenModal" onClick={() => setOpen(true)}>
      <GitHub />
    </IconButton>
  );
}
