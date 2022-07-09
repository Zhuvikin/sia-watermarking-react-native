import React, { useState } from "react";
import {
  webViewRender,
  emit,
  useNativeMessage,
} from "react-native-react-bridge/lib/web";

import "./example.css";
import image from "./logo.png";

const Root = () => {
  return (
    <div className="app">
      <img src={image} />
      <h1>SIA Watermarking App</h1>
    </div>
  );
};

export default webViewRender(<Root />);