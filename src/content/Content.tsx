import React, { useEffect, useState } from 'react';
import { getGnuScientificLibrary, GnuScientificLibrary } from '../lib/gsl';
import { getImageMagick, ImageMagick } from '../lib/imagemagick';
import { StepView } from './StepView';
import { ImagePreview } from './ImageLoad/ImagePreview';
import { Module } from '../lib/module';
import { WaveletDecomposition } from './WaveletDecomposition/WaveletDecomposition';
import { useAppSelector } from '../store/hooks';
import { selectImage } from '../features/image/imageSlice';

function registerModule<T extends Module>(
  getModule: () => Promise<T>,
  setModule: React.Dispatch<React.SetStateAction<T | undefined>>,
) {
  getModule().then((module: T) => {
    setModule(() => module);
  });
}

export default () => {
  const [gslModule, setGSLModule]: [
    GnuScientificLibrary | undefined,
    React.Dispatch<React.SetStateAction<GnuScientificLibrary | undefined>>,
  ] = useState();
  const [imageMagickModule, setImageMagickModule]: [
    ImageMagick | undefined,
    React.Dispatch<React.SetStateAction<ImageMagick | undefined>>,
  ] = useState();

  const image = useAppSelector(selectImage);

  useEffect(() => {
    registerModule(getImageMagick, setImageMagickModule);
    registerModule(getGnuScientificLibrary, setGSLModule);
  }, [image]);

  if (!gslModule || !imageMagickModule) {
    return <div className="App">Loading webassembly...</div>;
  }

  return (
    <div className="content">
      <StepView title="Load Image">
        <ImagePreview />
      </StepView>
      {image && (
        <StepView title="Wavelet Decomposition">
          <WaveletDecomposition />
        </StepView>
      )}
    </div>
  );
};
