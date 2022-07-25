import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  Decomposition,
  selectDecomposition,
  waveletDecompose,
} from '../../features/wavelet/waveletSlice';
import Canvas from '../ImageLoad/Canvas/Canvas';

export const WaveletDecomposition = () => {
  const dispatch = useAppDispatch();
  const decomposition: Decomposition | undefined =
    useAppSelector(selectDecomposition);
  const sourceNumbers = [1, 2, 34];
  if (!decomposition) {
    return (
      <div>
        <button
          type="button"
          onClick={() => dispatch(waveletDecompose(sourceNumbers))}>
          Decompose Image
        </button>
      </div>
    );
  }
  const { besselJ0, numbers, dwtImage, restoredImage } = decomposition;
  return (
    <div>
      <div>Decomposition</div>
      <div>Bessel J0: {besselJ0}</div>
      <div>
        2 * [{sourceNumbers.toString()}] = [{numbers.toString()}]
      </div>
      <div>
        <Canvas image={dwtImage} />
      </div>
      <div>
        <Canvas image={restoredImage} />
      </div>
    </div>
  );
};
