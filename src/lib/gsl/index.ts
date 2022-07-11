import createGSLModule from "./gsl.mjs";

export type GSL = {
    module: any;
    besselJ0: any;
} | undefined;

export const initGSL = async (): Promise<GSL> => {
    const module = await createGSLModule();
    const besselJ0 = module.cwrap("_gsl_sf_bessel_J0", "number", ["number", "number"]);

    return new Promise<GSL>((resolve, reject) => {
        resolve({
            module,
            besselJ0
        });
    });
}

