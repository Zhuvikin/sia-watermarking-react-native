import createImageMagickModule from './imagemagick.mjs';
import { Image, ImageDetails } from './types/image';
import { Module } from '../module';

export type ImageMagick = {
  imageFromBase64: (imageBase64: string) => Image;
} & Module;

const colorChannels = 4;
const bytesPerQuantum = 1;

export let imageMagickModule: ImageMagick;

const initImageMagick = async (): Promise<ImageMagick> => {
  const module = await createImageMagickModule();
  return new Promise<ImageMagick>((resolve, reject) => {
    const result = {
      module,
      imageFromBase64: (base64: string): Image => {
        const imageDetails: ImageDetails = new module.ImageDetails(base64);

        const pixelsAmount = imageDetails.width * imageDetails.height;
        const endPointer =
          imageDetails.pixelsPointer +
          colorChannels * bytesPerQuantum * pixelsAmount;

        const outputHeap8Array = module.HEAPU8.subarray(
          imageDetails.pixelsPointer,
          endPointer,
        );
        const outputUInt8Array = new Uint8ClampedArray(outputHeap8Array);

        module._free(imageDetails.pixelsPointer);

        const amountOfPixels = outputUInt8Array.length / 4;
        const redChannel = new Array(amountOfPixels);
        const greenChannel = new Array(amountOfPixels);
        const blueChannel = new Array(amountOfPixels);
        const alphaChannel = new Array(amountOfPixels);
        for (let i = 0; i < amountOfPixels; i++) {
          redChannel[i] = outputUInt8Array[4 * i];
          greenChannel[i] = outputUInt8Array[4 * i + 1];
          blueChannel[i] = outputUInt8Array[4 * i + 2];
          alphaChannel[i] = outputUInt8Array[4 * i + 3];
        }

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

          redChannel,
          greenChannel,
          blueChannel,
          alphaChannel,

          base64Data: base64,
        };
      },
    };
    imageMagickModule = result;
    resolve(result);
  });
};

export const getImageMagick = async (): Promise<ImageMagick> => {
  if (imageMagickModule) {
    return new Promise<ImageMagick>((resolve, reject) => {
      resolve(imageMagickModule);
    });
  } else {
    return initImageMagick();
  }
};
