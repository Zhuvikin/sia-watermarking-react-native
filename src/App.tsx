import React, { Suspense } from 'react';
import './App.css';
import { Header } from './header/Header';
import { Provider } from 'react-redux';
import { store } from './store/store';

const Content = React.lazy(() => import('./content/Content'));

export default () => (
  <React.StrictMode>
    <Provider store={store}>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <Content />
        </Suspense>
      </div>
    </Provider>
  </React.StrictMode>
);
