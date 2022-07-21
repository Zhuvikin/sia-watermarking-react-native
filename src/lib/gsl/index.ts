import createGSLModule from './gsl.mjs';
import { Module } from '../module';

export type GSL = {
  besselJ0: any;
} & Module;

export const initGSL = async (): Promise<GSL> => {
  const module = await createGSLModule();
  const besselJ0 = module.cwrap('_gsl_sf_bessel_J0', 'number', [
    'number',
    'number',
  ]);

  return new Promise<GSL>((resolve, reject) => {
    resolve({
      module,
      besselJ0,
    });
  });
};
