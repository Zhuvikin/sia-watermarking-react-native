import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import webApp from "./WebApp";

const App = () => {
  return (
    <WebView
      source={{ html: webApp }}
    />
  );
};

export default App;