import {Colorspace} from "../../lib/imagemagick/types/colorspace";
import {Image} from "../../lib/imagemagick/types/image";

const removeMime = /^data:image\/[a-zA-Z0-9]+;base64,/;

export const formatImageFilename = (extension: string) => {
    return `image.${extension.toLowerCase()}`
}

export const formatImageMime = (extension: string) => {
    return `image/${extension.toLowerCase()}`
}

export const formatImageBase64Data = (base64Data: string, extension: string) => {
    return `data:image/${extension.toLowerCase()};base64,${base64Data}`
}

export const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(('' + reader.result).replace(removeMime, ""));
    reader.onerror = error => reject(error);
});

export const getColorspaceName = (image: Image) => {
    let colorspaceName = Colorspace[image.colorspace];
    if (colorspaceName) {
        colorspaceName = colorspaceName.replaceAll("Colorspace", "");
    }
    return colorspaceName
}
