import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  Decomposition,
  selectDecomposition,
  waveletDecompose,
} from '../../features/wavelet/waveletSlice';

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
  const { besselJ0, numbers } = decomposition;
  return (
    <div>
      <div>Decomposition</div>
      <div>Bessel J0: {besselJ0}</div>
      <div>
        2 * [{sourceNumbers.toString()}] = [{numbers.toString()}]
      </div>
    </div>
  );
};
