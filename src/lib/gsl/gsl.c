#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include <gsl/gsl_sf_bessel.h>

EMSCRIPTEN_KEEPALIVE double _gsl_sf_bessel_J0(double x)
{
    return gsl_sf_bessel_J0(x);
}

// EMSCRIPTEN_KEEPALIVE double _gsl_wavelet2d_transform_forward(double x)
// {
//     return gsl_wavelet2d_transform_forward(x);
// }
//
// EMSCRIPTEN_KEEPALIVE double gsl_wavelet2d_transform_inverse(double x)
// {
//     return gsl_wavelet2d_transform_inverse(x);
// }

EMSCRIPTEN_KEEPALIVE void double_numbers(const double *inPtr, const int inLength, double *outPtr, const int outLength)
{
    int i = 0;
    for (i = 0; i < outLength; i++)
    {
        outPtr[i] = 2 * inPtr[i];
    }
}

