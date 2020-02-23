import React, { Component, createRef, MutableRefObject } from 'react';
import Scene from './scripts/Scene';
import './App.css';
import giovannnnna from './assets/giovannnnna.jpg';


type Props = {};
type State = {
  scene: Scene | null
};

declare global {
  interface Window { scene: Scene }
}

class App extends Component<Props, State> {
  private canvasRef = createRef() as MutableRefObject<HTMLCanvasElement>;
  private tileImageRef = createRef() as MutableRefObject<HTMLImageElement>;
  state: State = {
    scene: null
  };

  handleImageLoaded = () => {
    this.initApp();
  }

  handleImageErrored = () => {
    console.error("ERROR!");
  }

  initApp = () => {
    const scene = new Scene(this.canvasRef.current, this.tileImageRef.current);
    window.scene = scene;
    this.setState({
      scene
    });
    this.update();
  }

  update = () => {
    const { scene } = this.state;
    if (scene !== null) {
      scene.update();
    }
    requestAnimationFrame(this.update);
  }

  render() {
    return (
      <div className="App" >
        <section className="tile__container">
          <article className="tile">
            <figure className="title__figure">
              <img
                ref={this.tileImageRef}
                src={giovannnnna}
                className="tile__image"
                alt="tile"
                width="400"
                onLoad={this.handleImageLoaded}
                onError={this.handleImageErrored}
              />
            </figure>
          </article>
        </section>
        <canvas ref={this.canvasRef} id="stage" />
      </div>
    )
  }
};

export default App;
