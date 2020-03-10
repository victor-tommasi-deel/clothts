import React, { Component, createRef, MutableRefObject } from "react";
import Scene from "./scripts/Scene";
import TileContainer from "./container/TileContainer";
import "./App.css";
import giovannnnna from "./assets/giovannnnna.jpg";
import onepiece from "./assets/1007550.jpg";
import luffy from "./assets/luuffy.png";

type Props = {};
type State = {
  scene: Scene | null;
  images: Array<string>;
};

declare global {
  interface Window {
    scene: Scene;
    scenes: Array<Scene>;
  }
}

class App extends Component<Props, State> {
  private canvasRef = createRef() as MutableRefObject<HTMLCanvasElement>;
  state: State = {
    scene: null,
    images: [giovannnnna, onepiece, luffy]
  };

  handleImageErrored = () => {
    console.error("ERROR!");
  };

  initApp = (refs: Array<HTMLImageElement>) => {
    const scene = new Scene(this.canvasRef.current, refs);
    window.scene = scene;
    this.setState({
      scene
    });
    this.update();
  };

  update = () => {
    const { scene } = this.state;
    if (scene !== null) {
      scene.update();
    }
    requestAnimationFrame(this.update);
  };

  render() {
    return (
      <div className="App">
        <TileContainer images={this.state.images} startApp={this.initApp} />
        <canvas ref={this.canvasRef} id="stage" />
      </div>
    );
  }
}

export default App;
