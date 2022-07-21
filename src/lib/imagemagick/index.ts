import createImageMagickModule from "./imagemagick.mjs";
import {Image, ImageDetails} from "./types/image";
import {Module} from "../module";

export type ImageMagick = {
    imageFromBase64: (imageBase64: string) => Image;
} & Module;

const colorChannels = 4;
const bytesPerQuantum = 1;

export const initImageMagick = async (): Promise<ImageMagick> => {
    const module = await createImageMagickModule();
    return new Promise<ImageMagick>((resolve, reject) => {
        resolve({
            module,
            imageFromBase64: (base64: string): Image => {
                const imageDetails: ImageDetails = new module.ImageDetails(base64);

                const pixelsAmount = imageDetails.width * imageDetails.height;
                const endPointer = imageDetails.pixelsPointer + colorChannels * bytesPerQuantum * pixelsAmount;

                const outputHeap8Array = module.HEAPU8.subarray(imageDetails.pixelsPointer, endPointer);
                const outputUInt8Array = new Uint8ClampedArray(outputHeap8Array);

                module._free(imageDetails.pixelsPointer);

                return {
                    width: imageDetails.width,
                    height: imageDetails.height,
                    depth: imageDetails.depth,
                    format: imageDetails.format,
                    colorspace: imageDetails.colorspace,
                    channels: imageDetails.channels,
                    number_channels: imageDetails.number_channels,
                    number_meta_channels: imageDetails.number_meta_channels,
                    metacontent_extent: imageDetails.metacontent_extent,
                    pixels: outputUInt8Array,
                    base64Data: base64,
                }
            },
        });
    });
}

