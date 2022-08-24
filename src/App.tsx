import React from "react";
import WebGL from "./WebGL";

function App() {
  React.useEffect(() => {
    const webGL = new WebGL("canvas");
    loop();
    function loop() {
      webGL.update();
      window.requestAnimationFrame(loop);
    }
  }, []);
  return (
    <div className="App">
      <canvas id="canvas" width="640" height="480"></canvas>
    </div>
  );
}

export default App;
