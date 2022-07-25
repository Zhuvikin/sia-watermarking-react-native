import { getGnuScientificLibrary } from './index';

describe('GSL Tests', () => {
  test('should calculate bessel J0 function', async () => {
    const gnuScientificLibraryModule = await getGnuScientificLibrary();

    const result = gnuScientificLibraryModule.besselJ0(1);
    expect(result).toBeCloseTo(0.765, 3);
  });

  test('should calculate doubled numbers', async () => {
    const gnuScientificLibraryModule = await getGnuScientificLibrary();

    const result = gnuScientificLibraryModule.doubleNumbers([1, 2, 4]);
    expect(result).toEqual([2, 4, 8]);
  });
});
