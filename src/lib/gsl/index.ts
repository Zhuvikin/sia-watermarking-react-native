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
        const markDwtPerformed = 'mark_dwt_performed';

        performance.mark(markStart);

        const [outputRedChannel, outputGreenChannel, outputBlueChannel] = [
          image.redChannel,
          image.greenChannel,
          image.blueChannel,
        ].map(channel =>
          dwtOneChannel(channel, image.width, image.height, direction, levels),
        );

        performance.mark(markDwtPerformed);
        performance.measure('measure DWT', markStart, markDwtPerformed);
        console.log(performance.getEntriesByType('measure'));

        return {
          width: image.width,
          height: image.height,
          depth: image.depth,
          format: image.format,
          colorspace: image.colorspace,
          channels: image.channels,
          number_channels: image.number_channels,
          number_meta_channels: image.number_meta_channels,
          metacontent_extent: image.metacontent_extent,

          redChannel: outputRedChannel,
          greenChannel: outputGreenChannel,
          blueChannel: outputBlueChannel,
          alphaChannel: image.alphaChannel,

          base64Data: image.base64Data,
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
