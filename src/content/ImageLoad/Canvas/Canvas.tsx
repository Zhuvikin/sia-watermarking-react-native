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
    imageData.data.set(image.pixels, 0);
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
