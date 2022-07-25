import createGSLModule from './gsl.mjs';
import { Module } from '../module';

export type GnuScientificLibrary = {
  besselJ0: (argument: number) => number;
  doubleNumbers: (array: number[]) => number[];
} & Module;

export let gnuScientificLibraryModule: GnuScientificLibrary;

const initGnuScientificLibrary = async (): Promise<GnuScientificLibrary> => {
  const module = await createGSLModule();
  const besselJ0 = module.cwrap('_gsl_sf_bessel_J0', 'number', [
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
