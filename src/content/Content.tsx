import React from "react";
import {GSL} from "../lib/gsl";
import {ImageMagick} from "../lib/imagemagick";
import {StepView} from "./StepView";
import {GSLTest} from "./GSLTest/GSLTest";
import {ImageLoad} from "./ImageLoad/ImageLoad";

type ContentProps = {
    gslModule: GSL
    imageMagickModule: ImageMagick
};

export const Content = ({gslModule, imageMagickModule}: ContentProps) => <div className="content">
    <StepView title="GNU Scientific Library">
        <GSLTest gslModule={gslModule}/>
    </StepView>
    <StepView title="Load Image">
        <ImageLoad imageMagickModule={imageMagickModule}/>
    </StepView>
</div>;