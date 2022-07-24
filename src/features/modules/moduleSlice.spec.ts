import { initialState, initModules, modulesSlice } from './modulesSlice';
import { getImageMagick } from '../../lib/imagemagick/index';
import { getGnuScientificLibrary } from '../../lib/gsl';

jest.setTimeout(20 * 1000);

describe('Modules slice tests', () => {
  test('should set isLoaded true and modules', async () => {
    const gnuScientificLibraryModule = await getGnuScientificLibrary();
    const imageMagickModule = await getImageMagick();

    const nextState = modulesSlice.reducer(initialState, {
      type: initModules.fulfilled,
      payload: {
        imageMagickModule,
        gnuScientificLibraryModule,
      },
    });
    expect(nextState.isLoaded).toEqual(true);
  });
});
