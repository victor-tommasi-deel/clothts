import React, { Component } from "react";
import Scene from "../scripts/Scene";
import ClothComponent from "../components/ClothComponent";

type Props = {
  images: Array<string>;
  startApp: (refs: Array<HTMLImageElement>) => void;
};
type State = {
  scene: Scene | null;
  refs: Array<HTMLImageElement>;
  imageLoaded: number;
};

declare global {
  interface Window {
    scene: Scene;
    scenes: Array<Scene>;
  }
}

class TileContainer extends Component<Props, State> {
  state: State = {
    scene: null,
    refs: [],
    imageLoaded: 1
  };

  handleImageLoaded = () => {
    console.log(
      this.state.imageLoaded,
      this.props.images.length,
      this.state.refs
    );
    if (
      this.state.imageLoaded === this.props.images.length &&
      this.state.imageLoaded === this.state.refs.length
    ) {
      this.initApp();
    } else {
      this.setState({
        imageLoaded: this.state.imageLoaded + 1
      });
    }
  };

  handleImageErrored = () => {
    console.error("ERROR!");
  };

  initApp = () => {
    this.props.startApp(this.state.refs);
  };

  clothRef = (ref: HTMLImageElement) => {
    console.log(ref);
    const { refs } = this.state;
    refs.push(ref);
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
      <section className="tile__container">
        {this.props.images.map((image, index) => (
          <ClothComponent
            key={`${index}-tile`}
            index={index}
            img={image}
            handleImageLoaded={this.handleImageLoaded}
            clothInitRef={this.clothRef}
          />
        ))}
      </section>
    );
  }
}

export default TileContainer;
