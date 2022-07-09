import React from "react";
import { webViewRender } from "react-native-react-bridge/lib/web";
import App from './src/App';

const Root = () => {
  return (
    <App />
  );
};

export default webViewRender(<Root />);