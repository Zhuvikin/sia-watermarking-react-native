import React from "react";
import {GSL} from "../lib/gsl";
import { ImageMagick } from "../lib/imagemagick";
import {StepView} from "./StepView";
import {GSLTest} from "./GSLTest/GSLTest";
import {ImageMagickTest} from "./ImageMagickTest/ImageMagickTest";

type ContentProps = {
    gslModule: GSL
    imageMagickModule: ImageMagick
};

export const Content = ({ gslModule, imageMagickModule }: ContentProps) => <div className="content">
    <StepView title="GNU Scientific Library" >
        <GSLTest gslModule={gslModule} />
    </StepView>
    <StepView title="Image Magick Library">
        <ImageMagickTest imageMagickModule={imageMagickModule} />
    </StepView>
</div>;