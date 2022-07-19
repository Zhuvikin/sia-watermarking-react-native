import {ImageMagick} from "../../lib/imagemagick";
import { Colorspace } from "../../lib/imagemagick/types/colorspace";
import Canvas from "./Canvas/Canvas";

type ImageMagickTestProps = {
    imageMagickModule: ImageMagick
    imgBase64: string
};

export const ImageMagickTest = ({ imageMagickModule, imgBase64 }: ImageMagickTestProps) => {
    const image = imageMagickModule.imageFromBase64(imgBase64);
    let colorspaceName = Colorspace[image.colorspace];
    if (colorspaceName) {
        colorspaceName = colorspaceName.replaceAll("Colorspace", "");
    }

    console.log('image', image);

    return <div>
        <h3>Image details:</h3>
        <p>Dimensions: {image.width} x {image.height}</p>
        <p>Depth: {image.depth} bits</p>
        <p>Color Space: {colorspaceName}</p>
        <Canvas image={image} />
    </div>;
};