import { gnuScientificLibraryModule } from '../../lib/gsl';

export const GSLTest = () => (
  <div>J0(5) = {gnuScientificLibraryModule.besselJ0(5)}</div>
);
