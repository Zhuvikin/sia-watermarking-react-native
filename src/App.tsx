import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './App.css';
import createAddModule from "./lib/add/add.mjs";

function App() {
  const [add, setAdd] : [any, any] = useState();

  useEffect(
    () => {
      createAddModule().then((Module : any) => {
        setAdd(() => Module.cwrap("add", "number", ["number", "number"]));
      });
    },
    []
  );

  if (!add) {
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
      </header>
    </div>
  );
}

export default App;
