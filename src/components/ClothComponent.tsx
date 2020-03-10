import React, { Component } from "react";
import Scene from "../scripts/Scene";
import "./Cloth.css";

type Props = {
  index: number;
  img: string;
  handleImageLoaded: () => void;
  clothInitRef: any;
};
type State = {};

declare global {
  interface Window {
    scene: Scene;
  }
}

class ClothComponent extends Component<Props, State> {
  state: State = {};

  handleImageLoaded = () => {
    this.props.handleImageLoaded();
  };

  handleImageErrored = () => {
    console.error("ERROR!");
  };

  render() {
    return (
      <article key={`${this.props.index}-tile`} className="tile">
        <figure className="title__figure">
          <img
            ref={this.props.clothInitRef}
            src={this.props.img}
            className="tile__image"
            alt="tile"
            width="400"
            onLoad={this.handleImageLoaded}
            onError={this.handleImageErrored}
          />
        </figure>
      </article>
    );
  }
}

export default ClothComponent;
