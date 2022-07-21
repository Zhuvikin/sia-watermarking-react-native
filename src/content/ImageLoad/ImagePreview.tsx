import {Image} from "../../lib/imagemagick/types/image";
import React, {MutableRefObject, useRef, useState} from "react";
import {ImageMagick} from "../../lib/imagemagick";
import Canvas from "./Canvas/Canvas";
import download from "downloadjs";
import {formatImageBase64Data, formatImageFilename, formatImageMime, getColorspaceName, toBase64} from "./utils";

type ImageMagickLoadProps = {
    imageMagickModule: ImageMagick
};

export const ImagePreview = ({imageMagickModule}: ImageMagickLoadProps) => {
    const inputFile = useRef() as MutableRefObject<HTMLInputElement>;
    const [file, setFile]: [File | undefined, React.Dispatch<React.SetStateAction<File | undefined>>] = useState();
    const [image, setImage]: [Image | undefined, React.Dispatch<React.SetStateAction<Image | undefined>>] = useState();
    const [isLoading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let target = event.target;
        const file = target.files![0];
        setFile(file);
        setLoading(true);

        toBase64(file).then(base64 => {
            const image = imageMagickModule.imageFromBase64(base64);
            setImage(image);
            setLoading(false);
        })
    };

    const resetFile = () => {
        setFile(undefined);
        setImage(undefined);
    };

    if (isLoading) {
        return <div>Loading...</div>
    }

    const saveFile = () => {
        if (image) {
            let data = formatImageBase64Data(image.base64Data, image.format);
            let filename = formatImageFilename(image.format);
            let mimeType = formatImageMime(image.format);
            download(data, filename, mimeType);
        }
    }

    return <div>
        <div className="file-selector">
            <input type='file' ref={inputFile} onChange={changeHandler}/>
            {file && <button type="button" onClick={resetFile}>Reset</button>}
            {file && <button type="button" onClick={saveFile}>Save</button>}
        </div>
        {image && <div>
            <Canvas image={image}/>
            <div>Format: {image.format}</div>
            <div>Dimensions: {image.width} x {image.height}</div>
            <div>Depth: {image.depth} bits</div>
            <div>Color Space: {getColorspaceName(image)}</div>
            <div>Channels: {image.number_channels}</div>
        </div>}
    </div>;
};