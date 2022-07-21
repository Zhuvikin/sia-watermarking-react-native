import {ImageMagick} from "../../lib/imagemagick";
import Canvas from "./Canvas/Canvas";
import {getColorspaceName} from "./utils";

type ImageMagickTestProps = {
    imageMagickModule: ImageMagick
    imgBase64: string
};

export const ImageMagickTest = ({ imageMagickModule, imgBase64 }: ImageMagickTestProps) => {
    const image = imageMagickModule.imageFromBase64(imgBase64);
    return <div>
        <h3>Image details</h3>
        <p>Format: {image.format}</p>
        <p>Dimensions: {image.width} x {image.height}</p>
        <p>Depth: {image.depth} bits</p>
        <p>Color Space: {getColorspaceName(image)}</p>
        <p>Channels: {image.number_channels}</p>
        <Canvas image={image} />
    </div>;
};