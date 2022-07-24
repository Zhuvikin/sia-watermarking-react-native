import React, { useEffect, useState } from 'react';
import { getGnuScientificLibrary, GnuScientificLibrary } from '../lib/gsl';
import { getImageMagick, ImageMagick } from '../lib/imagemagick';
import { StepView } from './StepView';
import { GSLTest } from './GSLTest/GSLTest';
import { ImagePreview } from './ImageLoad/ImagePreview';
import { Module } from '../lib/module';

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

  useEffect(() => {
    registerModule(getImageMagick, setImageMagickModule);
    registerModule(getGnuScientificLibrary, setGSLModule);
  }, []);

  if (!gslModule || !imageMagickModule) {
    return <div className="App">Loading webassembly...</div>;
  }

  return (
    <div className="content">
      <StepView title="GNU Scientific Library">
        <GSLTest />
      </StepView>
      <StepView title="Load Image">
        <ImagePreview />
      </StepView>
    </div>
  );
};
