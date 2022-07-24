import React from 'react';
import Canvas from './Canvas/Canvas';
import { downloadImage, getColorspaceName } from './utils';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  loadImage,
  resetImage,
  selectImage,
  selectIsImageLoaded,
  selectIsImageSelected,
} from '../../features/sia/siaSlice';

export const ImagePreview = () => {
  const isImageSelected = useAppSelector(selectIsImageSelected);
  const isImageLoaded = useAppSelector(selectIsImageLoaded);
  const image = useAppSelector(selectImage);
  const dispatch = useAppDispatch();

  if (isImageSelected && !isImageLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="file-selector">
        <input
          type="file"
          onChange={e => dispatch(loadImage(e.target.files![0]))}
        />
        {isImageSelected && isImageLoaded && image && (
          <>
            <button type="button" onClick={() => dispatch(resetImage())}>
              Reset
            </button>
            <button type="button" onClick={() => downloadImage(image)}>
              Save
            </button>
          </>
        )}
      </div>
      {image && (
        <div>
          <Canvas image={image} />
          <div>Format: {image.format}</div>
          <div>
            Dimensions: {image.width} x {image.height}
          </div>
          <div>Depth: {image.depth} bits</div>
          <div>Color Space: {getColorspaceName(image)}</div>
          <div>Channels: {image.number_channels}</div>
        </div>
      )}
    </div>
  );
};
