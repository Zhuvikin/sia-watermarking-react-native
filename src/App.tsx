import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import createAddModule from "./lib/add/add.mjs";
import createGSLModule from "./lib/gsl/gsl.mjs";

function App() {
  const [add, setAdd] : [any, any] = useState();
  const [gslCdfHypergeometricP, setGslCdfHypergeometricP] : [any, any] = useState();

  useEffect(
    () => {
      createAddModule().then((Module : any) => {
        setAdd(() => Module.cwrap("add", "number", ["number", "number"]));
      });
      createGSLModule().then((Module : any) => {
        setGslCdfHypergeometricP(() => Module.cwrap("gsl_cdf_hypergeometric_P", "number", ["number", "number", "number", "number" ]));
      });
    },
    []
  );

  if (!add || !gslCdfHypergeometricP) {
    return (
      <div className="App">Loading webassembly...</div>
    )
  }

  const [k, n1, n2, t] = [4, 7, 19, 13];
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Watermarking</h1>
        <div>1 + 2 = {add(1, 2)}</div>
        <div>CDF Hypergeometric P({k}, {n1}, {n2}, {t}) = {gslCdfHypergeometricP(4, 7, 19, 13)}</div>
      </header>
    </div>
  );
}

export default App;
