import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import createMathModule from "./lib/math/math.mjs";

function App() {
  const [add, setAdd] : [any, any] = useState();
  const [besselJ0, setBesselJ0] : [any, any] = useState();

  useEffect(
    () => {
      createMathModule().then((Module : any) => {
        setAdd(() => Module.cwrap("add", "number", ["number", "number"]));
        setBesselJ0(() => Module.cwrap("_gsl_sf_bessel_J0", "number", ["number", "number"]));
      });
    },
    []
  );

  if (!add || !besselJ0) {
    return (
      <div className="App">Loading webassembly...</div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Watermarking</h1>
        <div>1 + 2 = {add(1, 2)}</div>
        <div>J0(5) = {besselJ0(5)}</div>
      </header>
    </div>
  );
}

export default App;
