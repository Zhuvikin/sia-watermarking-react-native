#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <stdio.h>

#include <config.h>
#include <gsl/gsl_sf_bessel.h>
#include <gsl/gsl_wavelet2d.h>

EMSCRIPTEN_KEEPALIVE double _gsl_sf_bessel_J0(double x) {
    return gsl_sf_bessel_J0(x);
}

EMSCRIPTEN_KEEPALIVE void dwt_forward(const double *inPtr, double *outPtr, const int width, const int height) {
    const gsl_wavelet_type * T = gsl_wavelet_haar_centered;
    size_t member = 2;

    gsl_wavelet_workspace *work;
    gsl_matrix *m2;
    gsl_wavelet *w;
    gsl_matrix *m1;
    gsl_matrix_view m;
    size_t i;
    size_t j;

    double *data = (double *)malloc (width * height * sizeof (double));
    const char * name = "nonstd";

    for (i = 0; i < width * height; i++) {
        data[i] = inPtr[i];
    }

    m = gsl_matrix_view_array_with_tda (data, width, height, width);
    m1 = &(m.matrix);

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            double val = inPtr[i + width * j];
            // printf("(%lu, %lu): %f\n", i, j, val);
            gsl_matrix_set (m1, i, j, val);
        }
    }

    m2 = gsl_matrix_alloc (width, height);
    gsl_matrix_memcpy (m2, m1);

    work = gsl_wavelet_workspace_alloc (width);
    w = gsl_wavelet_alloc (T, member);
    gsl_wavelet2d_nstransform_matrix_forward (w, m2, work);

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            double x1 = gsl_matrix_get (m1, i, j);
            double x2 = gsl_matrix_get (m2, i, j );
            // printf("fwd (%lu, %lu): %f -> %f\n", i, j, x1, x2);
            outPtr[i + width * j] = x2;
        }
    }

    //gsl_wavelet2d_nstransform_matrix_inverse (w, m2, work);
    //
    //for (i = 0; i < N; i++) {
    //    for (j = 0; j < N; j++) {
    //        double x1 = gsl_matrix_get (m1, i, j);
    //        double x2 = gsl_matrix_get (m2, i, j );
    //        printf("inv (%lu, %lu): %f -> %f\n", i, j, x1, x2);
    //    }
    //}

    free (data);
    gsl_wavelet_workspace_free (work);
    gsl_wavelet_free (w);
    gsl_matrix_free (m2);
    return;
}

// EMSCRIPTEN_KEEPALIVE double gsl_wavelet2d_transform_inverse(double x)
// {
//     return gsl_wavelet2d_transform_inverse(x);
// }

EMSCRIPTEN_KEEPALIVE void double_numbers(const double *inPtr, const int inLength, double *outPtr, const int outLength) {
    int i = 0;
    for (i = 0; i < outLength; i++)
    {
        outPtr[i] = 2 * inPtr[i];
    }
}

