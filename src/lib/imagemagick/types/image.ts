import {Colorspace} from "./colorspace";

export type BaseImage = {
    width: number,
    height: number,
    colorspace: Colorspace,
    depth: number,
    format: string,
    channels: number,

    number_channels: number,
    number_meta_channels: number,
    metacontent_extent: number,
}

export type ImageDetails = BaseImage & {
    pixelsPointer: number,
}

export type Image = BaseImage & {
    pixels: Uint8ClampedArray,
}