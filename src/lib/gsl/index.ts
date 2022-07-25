import createGSLModule from './gsl.mjs';
import { Module } from '../module';
import { Image } from '../imagemagick/types/image';

export type GnuScientificLibrary = {
  besselJ0: (argument: number) => number;
  doubleNumbers: (array: number[]) => number[];
  dwtForward: (image: Image) => Image;
} & Module;

export let gnuScientificLibraryModule: GnuScientificLibrary;

const initGnuScientificLibrary = async (): Promise<GnuScientificLibrary> => {
  const module = await createGSLModule();
  const besselJ0 = module.cwrap('_gsl_sf_bessel_J0', 'number', [
    'number',
    'number',
  ]);
  const dwtForward = module.cwrap('dwt_forward', null, [
    'number',
    'number',
    'number',
    'number',
  ]);
  const doubleNumbers = module.cwrap('double_numbers', null, [
    'number',
    'number',
    'number',
    'number',
  ]);

  return new Promise<GnuScientificLibrary>((resolve, reject) => {
    const dwtForwardOneChannel = (
      source: number[],
      width: number,
      height: number,
    ): number[] => {
      const inputFloat64Array = new Float64Array(source);
      const inputUInt8Array = new Uint8Array(inputFloat64Array.buffer);
      const inputPtr = module._malloc(
        width * height * inputUInt8Array.BYTES_PER_ELEMENT,
      );
      module.HEAPU8.set(inputUInt8Array, inputPtr);

      const outputPtr = module._malloc(inputFloat64Array.byteLength);
      dwtForward(inputPtr, outputPtr, width, height);
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
      besselJ0,
      doubleNumbers: (input: number[]) => {
        const inputFloat64Array = new Float64Array(input);
        const inputUInt8Array = new Uint8Array(inputFloat64Array.buffer);
        const inputPtr = module._malloc(
          inputUInt8Array.length * inputUInt8Array.BYTES_PER_ELEMENT,
        );
        module.HEAPU8.set(inputUInt8Array, inputPtr);

        const outputPtr = module._malloc(inputFloat64Array.byteLength);
        doubleNumbers(inputPtr, input.length, outputPtr, input.length);
        module._free(inputPtr);

        const outputHeap8Array = module.HEAPU8.subarray(
          outputPtr,
          outputPtr + inputFloat64Array.byteLength,
        );
        const outputUInt8Array = new Uint8Array(outputHeap8Array);
        module._free(outputPtr);
        const outputFloat64Array = new Float64Array(outputUInt8Array.buffer);
        return Array.from(outputFloat64Array);
      },
      dwtForward: (image: Image) => {
        const redChannel = [];
        const greenChannel = [];
        const blueChannel = [];
        for (let i = 0; i < image.pixels.length; i = i + 4) {
          redChannel.push(image.pixels[i]);
          greenChannel.push(image.pixels[i + 1]);
          blueChannel.push(image.pixels[i + 2]);
        }

        const [redCoefficients, greenCoefficients, blueCoefficients] = [
          redChannel,
          greenChannel,
          blueChannel,
        ].map(channel =>
          dwtForwardOneChannel(channel, image.width, image.height),
        );

        const outPixels = [...image.pixels];
        for (let i = 0; i < redCoefficients.length; i++) {
          outPixels[4 * i] = redCoefficients[i];
          outPixels[4 * i + 1] = greenCoefficients[i];
          outPixels[4 * i + 2] = blueCoefficients[i];
        }
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
