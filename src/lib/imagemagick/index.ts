import createImageMagickModule from "./imagemagick.js";

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
                var v1 = new Float64Array(arr);
                var uarray = new Uint8Array(v1.buffer);

                var ptr = module._malloc(v1.byteLength);
                doubleNumbers(uarray, ptr, arr.length);
                
                const result = new Float64Array(arr.length);
                for (var i=0; i<arr.length; i++) {
                    result[i] = module.getValue(ptr+i*v1.BYTES_PER_ELEMENT, 'double');
                }
                return result;
            }
        });
    });
}

