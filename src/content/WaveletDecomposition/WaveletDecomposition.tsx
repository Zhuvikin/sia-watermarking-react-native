import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectDecomposition,
  waveletDecompose,
} from '../../features/wavelet/waveletSlice';

export const WaveletDecomposition = () => {
  const dispatch = useAppDispatch();
  const decomposition = useAppSelector(selectDecomposition);
  return (
    <div>
      <div>
        <button type="button" onClick={() => dispatch(waveletDecompose(1))}>
          Decompose Image
        </button>
      </div>
      <div>Decomposition: {decomposition}</div>
    </div>
  );
};
