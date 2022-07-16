import React, { useEffect, useState } from 'react';
import './App.css';
import { ImageMagick, initImageMagick } from "./lib/imagemagick";
import { GSL, initGSL } from "./lib/gsl";
import {Header} from "./header/Header";
import {Content} from "./content/Content";

function App() {
  const [gslModule, setGSLModule] : [GSL | undefined, React.Dispatch<React.SetStateAction<GSL | undefined>>] = useState();
  const [imageMagickModule, setImageMagickModule] : [ImageMagick | undefined, React.Dispatch<React.SetStateAction<ImageMagick | undefined>>] = useState();

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

  return (
    <div className="App">
      <Header />
      <Content gslModule={gslModule} imageMagickModule={imageMagickModule} />
    </div>
  );
}

export default App;
