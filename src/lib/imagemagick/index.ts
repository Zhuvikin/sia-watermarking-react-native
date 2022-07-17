import createImageMagickModule from "./imagemagick.mjs";

export type ImageDetails = {
    width: number,
    height: number,
    colorspace: number,
    depth: number
}

export type ImageMagick = {
    module: any;
    imageDetailsFromBase64: (imageBase64 : string) => ImageDetails;
};

export const initImageMagick = async (): Promise<ImageMagick> => {
    const module = await createImageMagickModule();
    return new Promise<ImageMagick>((resolve, reject) => {
        resolve({
            module,
            imageDetailsFromBase64: module.ImageDetailsFromBase64,
        });
    });
}

