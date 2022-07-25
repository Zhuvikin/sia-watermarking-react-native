import createGSLModule from './gsl.mjs';
import { Module } from '../module';
import { Image } from '../imagemagick/types/image';
import { DwtDirection } from './types/wavelet';

export type GnuScientificLibrary = {
  dwt: (image: Image, direction: DwtDirection, levels: number) => Image;
} & Module;

export let gnuScientificLibraryModule: GnuScientificLibrary;

const initGnuScientificLibrary = async (): Promise<GnuScientificLibrary> => {
  const module = await createGSLModule();
  const dwt = module.cwrap('dwt', null, [
    'number', // input pointer
    'number', // output pointer
    'number', // width
    'number', // height
    'number', // forward = 0, inverse = 1
    'number', // levels
  ]);

  return new Promise<GnuScientificLibrary>((resolve, reject) => {
    const dwtOneChannel = (
      source: number[],
      width: number,
      height: number,
      direction: DwtDirection,
      levels: number,
    ): number[] => {
      const inputFloat64Array = new Float64Array(source);
      const inputUInt8Array = new Uint8Array(inputFloat64Array.buffer);
      const inputPtr = module._malloc(
        width * height * inputUInt8Array.BYTES_PER_ELEMENT,
      );
      module.HEAPU8.set(inputUInt8Array, inputPtr);

      const outputPtr = module._malloc(inputFloat64Array.byteLength);

      dwt(inputPtr, outputPtr, width, height, direction, levels);
      module._free(inputPtr);

      const outputHeap8Array = module.HEAPU8.subarray(
        outputPtr,
        outputPtr + inputFloat64Array.byteLength,
      );
      const outputUInt8Array = new Uint8Array(outputHeap8Array);
      module._free(outputPtr);
      const outputFloat64Array = new Float64Array(outputUInt8Array.buffer);
      return Array.from(outputFloat64Array);
    };

    const result = {
      module,
      dwt: (image: Image, direction: DwtDirection, levels: number) => {
        const markStart = 'mark_start';
        const markChannelsSeparated = 'mark_channels_separated';
        const markDwtPerformed = 'mark_dwt_performed';
        const markChannelsCombined = 'mark_channels_combined';

        performance.mark(markStart);

        const inputRedChannel = [];
        const inputGreenChannel = [];
        const inputBlueChannel = [];
        for (let i = 0; i < image.pixels.length; i = i + 4) {
          inputRedChannel.push(image.pixels[i]);
          inputGreenChannel.push(image.pixels[i + 1]);
          inputBlueChannel.push(image.pixels[i + 2]);
        }
        performance.mark(markChannelsSeparated);

        const [outputRedData, outputGreenData, outputBlueData] = [
          inputRedChannel,
          inputGreenChannel,
          inputBlueChannel,
        ].map(channel =>
          dwtOneChannel(channel, image.width, image.height, direction, levels),
        );

        performance.mark(markDwtPerformed);

        const outPixels = [...image.pixels];
        for (let i = 0; i < outputRedData.length; i++) {
          outPixels[4 * i] = outputRedData[i];
          outPixels[4 * i + 1] = outputGreenData[i];
          outPixels[4 * i + 2] = outputBlueData[i];
        }
        performance.mark(markChannelsCombined);

        performance.measure(
          'measure channels separation',
          markStart,
          markChannelsSeparated,
        );
        performance.measure(
          'measure DWT',
          markChannelsSeparated,
          markDwtPerformed,
        );
        performance.measure(
          'measure channels composition',
          markDwtPerformed,
          markChannelsCombined,
        );
        console.log(performance.getEntriesByType('measure'));

        return {
          ...image,
          pixels: outPixels,
        };
      },
    };
    gnuScientificLibraryModule = result;
    resolve(result);
  });
};

export const getGnuScientificLibrary =
  async (): Promise<GnuScientificLibrary> => {
    if (gnuScientificLibraryModule) {
      return new Promise<GnuScientificLibrary>((resolve, reject) => {
        resolve(gnuScientificLibraryModule);
      });
    } else {
      return initGnuScientificLibrary();
    }
  };
