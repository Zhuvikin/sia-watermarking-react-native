import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import createGSLModule from "./lib/gsl/gsl.mjs";

function App() {
  const [besselJ0, setBesselJ0] : [any, any] = useState();

  useEffect(
    () => {
      createGSLModule().then((Module : any) => {
        setBesselJ0(() => Module.cwrap("_gsl_sf_bessel_J0", "number", ["number", "number"]));
      });
    },
    []
  );

  if (!besselJ0) {
    return (
      <div className="App">Loading webassembly...</div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Watermarking</h1>
        <div>J0(5) = {besselJ0(5)}</div>
      </header>
    </div>
  );
}

export default App;
