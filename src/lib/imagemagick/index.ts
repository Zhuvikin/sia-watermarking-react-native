import createImageMagickModule from "./imagemagick.mjs";

export type ImageMagick = {
    module: any;
    doubleNumbers: any;
} | undefined;

export const initImageMagick = async (): Promise<ImageMagick> => {
    const module = await createImageMagickModule();
    const doubleNumbers = module.cwrap('double_numbers', null, ['number', 'number', 'number', 'number']);

    return new Promise<ImageMagick>((resolve, reject) => {
        resolve({
            module,
            doubleNumbers: (input : number[]) => {
                const inputFloat64Array = new Float64Array(input);
                const inputUInt8Array = new Uint8Array(inputFloat64Array.buffer);
                const inputPtr = module._malloc(inputUInt8Array.length * inputUInt8Array.BYTES_PER_ELEMENT);
                module.HEAPU8.set(inputUInt8Array, inputPtr);
                
                const outputPtr = module._malloc(inputFloat64Array.byteLength);
                doubleNumbers(inputPtr, input.length, outputPtr, input.length);
                module._free(inputPtr);

                const outputHeap8Array = module.HEAPU8.subarray(outputPtr, outputPtr + inputFloat64Array.byteLength);
                const outputUInt8Array = new Uint8Array(outputHeap8Array);
                module._free(outputPtr);
                const outputFloat64Array = new Float64Array(outputUInt8Array.buffer);
                return outputFloat64Array
            }
        });
    });
}

