import createImageMagickModule from "./imagemagick.mjs";

export type ImageMagick = {
    module: any;
    testImagemagick: any;
};

export const initImageMagick = async (): Promise<ImageMagick> => {
    const module = await createImageMagickModule();
    const testImagemagick = module.cwrap("test_imagemagick", "number", ["string"]);

    return new Promise<ImageMagick>((resolve, reject) => {
        resolve({
            module,
            testImagemagick
        });
    });
}

