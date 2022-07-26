import React, { MutableRefObject, useEffect, useRef } from 'react';
import { Image } from '../../../lib/imagemagick/types/image';

type CanvasProps = {
  image: Image;
};

const Canvas = ({
  image,
  ...rest
}: CanvasProps &
  JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLCanvasElement> &
  React.CanvasHTMLAttributes<HTMLCanvasElement>) => {
  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context!.createImageData(image.width, image.height);

    const outPixels = new Array(4 * image.width * image.height);
    for (let i = 0; i < image.width * image.height; i++) {
      outPixels[4 * i] = image.redChannel[i];
      outPixels[4 * i + 1] = image.greenChannel[i];
      outPixels[4 * i + 2] = image.blueChannel[i];
      outPixels[4 * i + 3] = image.alphaChannel[i];
    }

    imageData.data.set(outPixels, 0);
    context!.putImageData(imageData, 0, 0);
  }, [image.base64Data]);

  return (
    <canvas
      width={image.width}
      height={image.height}
      ref={canvasRef}
      {...rest}
    />
  );
};

export default Canvas;
