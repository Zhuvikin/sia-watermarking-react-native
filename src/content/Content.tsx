import React, {useEffect, useState} from "react";
import {GSL, initGSL} from "../lib/gsl";
import {initImageMagick, ImageMagick} from "../lib/imagemagick";
import {StepView} from "./StepView";
import {GSLTest} from "./GSLTest/GSLTest";
import {ImagePreview} from "./ImageLoad/ImagePreview";
import {Module} from "../lib/module";

function registerModule<T extends Module>(initModule: () => Promise<T>, setModule: React.Dispatch<React.SetStateAction<T | undefined>>) {
    initModule().then((module: T) => {
        setModule(() => module);
    });
}

export default () => {
    const [gslModule, setGSLModule]: [GSL | undefined, React.Dispatch<React.SetStateAction<GSL | undefined>>] = useState();
    const [imageMagickModule, setImageMagickModule]: [ImageMagick | undefined, React.Dispatch<React.SetStateAction<ImageMagick | undefined>>] = useState();

    useEffect(() => {
        registerModule(initImageMagick, setImageMagickModule);
        registerModule(initGSL, setGSLModule);
    }, []);

    if (!gslModule || !imageMagickModule) {
        return (
            <div className="App">Loading webassembly...</div>
        )
    }

    return <div className="content">
        <StepView title="GNU Scientific Library">
            <GSLTest gslModule={gslModule}/>
        </StepView>
        <StepView title="Load Image">
            <ImagePreview imageMagickModule={imageMagickModule}/>
        </StepView>
    </div>;
};