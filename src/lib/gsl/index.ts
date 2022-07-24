import createGSLModule from './gsl.mjs';
import { Module } from '../module';

export type GnuScientificLibrary = {
  besselJ0: any;
} & Module;

export let gnuScientificLibraryModule: GnuScientificLibrary;

const initGnuScientificLibrary = async (): Promise<GnuScientificLibrary> => {
  const module = await createGSLModule();
  const besselJ0 = module.cwrap('_gsl_sf_bessel_J0', 'number', [
    'number',
    'number',
  ]);

  return new Promise<GnuScientificLibrary>((resolve, reject) => {
    const result = {
      module,
      besselJ0,
    };
    gnuScientificLibraryModule = result;
    resolve(result);
  });
};

export const getGnuScientificLibrary =
  async (): Promise<GnuScientificLibrary> => {
    if (gnuScientificLibraryModule) {
      return new Promise<GnuScientificLibrary>((resolve, reject) => {
        resolve(gnuScientificLibraryModule);
      });
    } else {
      return initGnuScientificLibrary();
    }
  };
