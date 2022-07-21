import React, {Suspense} from 'react';
import './App.css';
import {Header} from "./header/Header";

const Content = React.lazy(() => import('./content/Content'));

export default () => <div className="App">
    <Suspense fallback={<div>Loading...</div>}>
        <Header/>
        <Content/>
    </Suspense>
</div>;
