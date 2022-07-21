import React, {useEffect, useState} from "react";
import {GSL, initGSL} from "../lib/gsl";
import {ImageMagick, initImageMagick} from "../lib/imagemagick";
import {StepView} from "./StepView";
import {GSLTest} from "./GSLTest/GSLTest";
import {ImageLoad} from "./ImageLoad/ImageLoad";

export default () => {
    const [gslModule, setGSLModule] : [GSL | undefined, React.Dispatch<React.SetStateAction<GSL | undefined>>] = useState();
    const [imageMagickModule, setImageMagickModule] : [ImageMagick | undefined, React.Dispatch<React.SetStateAction<ImageMagick | undefined>>] = useState();

    useEffect(
        () => {
            initImageMagick().then((Module : ImageMagick) => {
                setImageMagickModule(() => Module);
            });
            initGSL().then((Module : GSL) => {
                setGSLModule(() => Module);
            });
        },
        []
    );

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
            <ImageLoad imageMagickModule={imageMagickModule}/>
        </StepView>
    </div>;
};