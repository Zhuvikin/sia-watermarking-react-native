import createImageMagickModule from "./imagemagick.mjs";

export type ImageMagick = {
    module: any;
    doubleNumbers: any;
} | undefined;

export const initImageMagick = async (): Promise<ImageMagick> => {
    const module = await createImageMagickModule();
    const doubleNumbers = module.cwrap('double_numbers', null, ['array', 'number']);

    return new Promise<ImageMagick>((resolve, reject) => {
        resolve({
            module,
            doubleNumbers: (arr : number[]) => {
                var float64Array = new Float64Array(arr);
                var inputUInt8Array = new Uint8Array(float64Array.buffer);
                var outputResultPtr = module._malloc(float64Array.byteLength);

                doubleNumbers(inputUInt8Array, outputResultPtr, arr.length);

                const heap8Array = module.HEAPU8.subarray(outputResultPtr, outputResultPtr + float64Array.byteLength);
                const outputUInt8Array = new Uint8Array(heap8Array);
                module._free(outputResultPtr);
                const result = new Float64Array(outputUInt8Array.buffer);
                return result
            }
        });
    });
}

