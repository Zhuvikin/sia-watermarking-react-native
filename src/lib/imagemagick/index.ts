import createImageMagickModule from "./imagemagick.mjs";

export type BaseImage = {
    width: number,
    height: number,
    colorspace: number,
    depth: number,
}

export type ImageDetails = BaseImage & {
    pixelsPointer: number,
}

export type Image = BaseImage & {
    pixels: Uint8ClampedArray,
}

export type ImageMagick = {
    module: any;
    imageFromBase64: (imageBase64: string) => Image;
};

const colorChannels = 4;
const bytesPerQuantum = 1;

export const initImageMagick = async (): Promise<ImageMagick> => {
    const module = await createImageMagickModule();
    return new Promise<ImageMagick>((resolve, reject) => {
        resolve({
            module,
            imageFromBase64: (base64 : string) : Image => {
                const imageDetails: ImageDetails = new module.ImageDetails(base64);

                const pixelsAmount = imageDetails.width * imageDetails.height;
                const endPointer = imageDetails.pixelsPointer + colorChannels * bytesPerQuantum * pixelsAmount;

                const outputHeap8Array = module.HEAPU8.subarray(imageDetails.pixelsPointer, endPointer);
                const outputUInt8Array = new Uint8ClampedArray(outputHeap8Array);

                for (let i = 0; i < pixelsAmount; i++) {
                    const offset = i * 4 + 3;
                    outputUInt8Array[offset] = 255 - outputUInt8Array[offset];
                }
                return {
                    width: imageDetails.width,
                    height: imageDetails.height,
                    depth: imageDetails.depth,
                    colorspace: imageDetails.colorspace,
                    pixels: outputUInt8Array,
                }
            },
        });
    });
}

