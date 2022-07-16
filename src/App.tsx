import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import { ImageMagick, initImageMagick } from "./lib/imagemagick";
import { GSL, initGSL } from "./lib/gsl";

function App() {
  const [gslModule, setGSLModule] : [GSL, React.Dispatch<React.SetStateAction<GSL>>] = useState();
  const [imageMagickModule, setImageMagickModule] : [ImageMagick, React.Dispatch<React.SetStateAction<ImageMagick>>] = useState();

  useEffect(
    () => {
      initImageMagick().then((Module : ImageMagick) => {
        setImageMagickModule(() => Module);
      });
      initGSL().then((Module : GSL) => {
        setGSLModule(() => Module);
      });
    },
    []
  );

  if (!gslModule || !imageMagickModule) {
    return (
      <div className="App">Loading webassembly...</div>
    )
  }

  imageMagickModule.testImagemagick(2.3)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Watermarking</h1>
        <div>J0(5) = {gslModule.besselJ0(5)}</div>
      </header>
    </div>
  );
}

export default App;
