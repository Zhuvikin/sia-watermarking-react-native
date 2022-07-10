import React from "react";
import { webViewRender } from "react-native-react-bridge/lib/web";
import App from './src/App';

export default webViewRender(<App />);