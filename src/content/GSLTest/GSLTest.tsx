import { GSL } from '../../lib/gsl';

type GSLTestProps = {
  gslModule: GSL;
};

export const GSLTest = ({ gslModule }: GSLTestProps) => (
  <div>J0(5) = {gslModule.besselJ0(5)}</div>
);
