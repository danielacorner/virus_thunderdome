import React, { Suspense, useEffect } from "react";
import Tooltip from "./components/SelectedParticle/SelectedParticleTooltip";
import { Button, Typography } from "@material-ui/core";
import WarningOutlined from "@material-ui/icons/WarningOutlined";
import { CanvasAndSceneEmpty } from "./CanvasAndSceneEmpty";
import { useStore } from "./store";
import { LoadingIndicator } from "./components/Scene/LoadingIndicator";
import { useMount } from "./utils/utils";
import { render } from "react-dom";
import MemoryStats from "react-memorystats";
import { BtnStartNextWave } from "./components/Scene/BtnStartNextWave";
import { CellAndAntibodyButtons } from "./components/CellAndAntibodyButtons/CellAndAntibodyButtons";
import { useLocalStorageState } from "./utils/useLocalStorageState";
import { AttributionLinks } from "./AttributionLinks";

function App() {
  useMount(() => {
    render(
      <MemoryStats corner="topLeft" />,
      document.getElementById("memoryStats")
    );
  });
  return (
    <div className="App">
      <LoadingIndicator />
      <LazyLoadedScene />
      <div id="memoryStats"></div>
      <Tooltip />
      <BtnStartNextWave />
      <CellAndAntibodyButtons />
      {/* <GuidedTour /> */}
      <AttributionLinks />
      <SaveControlsSettingsToLocalStorage />
    </div>
  );
}

export default App;

const CanvasAndSceneLazy = React.lazy(() => import("./CanvasAndScene"));

function LazyLoadedScene() {
  const set = useStore((s) => s.set);
  const started = useStore((s) => s.started);

  return started ? (
    <Suspense fallback={null}>
      <CanvasAndSceneLazy />
    </Suspense>
  ) : (
    <>
      <CanvasAndSceneEmpty />
      <div
        style={{
          pointerEvents: "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "grid",
          placeItems: "center",
          alignContent: "center",
          gridGap: "1em",
          minHeight: "100vh",
        }}
      >
        <Typography style={{ textAlign: "center" }} variant="h3">
          <div>Virus</div>
          <div>ThunderDome</div>
          <div>⚡🦠⚡</div>
        </Typography>
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            placeItems: "center",
            gridGap: "0.25em",
          }}
        >
          <WarningOutlined />
          <Typography variant="body2">
            Requirements: 20MB download, 1GB memory
          </Typography>
        </div>
        <Button
          style={{ padding: "0.25em 3em", pointerEvents: "auto" }}
          onClick={() => set({ started: true })}
          variant="outlined"
        >
          Start
        </Button>
      </div>
    </>
  );
}

function SaveControlsSettingsToLocalStorage() {
  const set = useStore((s) => s.set);
  const soundOn = useStore((s) => s.soundOn);

  const [settings, setSettings] = useLocalStorageState("settings", {
    soundOn,
  });

  // when app mounts, retrieve settings from local storage
  useMount(() => {
    if (!settings) {
      return;
    }
    if (settings.soundOn) {
      set({ soundOn: settings.soundOn });
    }
  });

  useEffect(() => {
    setSettings({ soundOn });
  }, [soundOn, setSettings]);

  return null;
}
