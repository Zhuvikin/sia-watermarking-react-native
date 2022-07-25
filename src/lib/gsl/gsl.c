#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <stdio.h>

#include <math.h>
#include <config.h>
#include <gsl/gsl_wavelet2d.h>

#define ELEMENT(a,stride,i) ((a)[(stride)*(i)])

static int binary_logn(const size_t n);
static void dwt_step (const gsl_wavelet * w, double *a, size_t stride, size_t n, gsl_wavelet_direction dir, gsl_wavelet_workspace * work);

static int binary_logn (const size_t n)
{
    size_t ntest;
    size_t logn = 0;
    size_t k = 1;

    while (k < n)
    {
        k *= 2;
        logn++;
    }

    ntest = ((size_t)1 << logn);

    if (n != ntest)
    {
        return -1;                /* n is not a power of 2 */
    }

    return logn;
}

static void dwt_step (const gsl_wavelet * w, double *a, size_t stride, size_t n,
          gsl_wavelet_direction dir, gsl_wavelet_workspace * work) {
    double ai, ai1;
    size_t i, ii;
    size_t jf;
    size_t k;
    size_t n1, ni, nh, nmod;

    for (i = 0; i < work->n; i++)
    {
        work->scratch[i] = 0.0;
    }

    nmod = w->nc * n;
    nmod -= w->offset;            /* center support */

    n1 = n - 1;
    nh = n >> 1;

    if (dir == gsl_wavelet_forward)
    {
        for (ii = 0, i = 0; i < n; i += 2, ii++)
        {
            double h = 0, g = 0;

            ni = i + nmod;

            for (k = 0; k < w->nc; k++)
            {
                jf = n1 & (ni + k);
                h += w->h1[k] * ELEMENT (a, stride, jf);
                g += w->g1[k] * ELEMENT (a, stride, jf);
            }

            work->scratch[ii] += h;
            work->scratch[ii + nh] += g;
        }
    }
    else
    {
        for (ii = 0, i = 0; i < n; i += 2, ii++)
        {
            ai = ELEMENT (a, stride, ii);
            ai1 = ELEMENT (a, stride, ii + nh);
            ni = i + nmod;
            for (k = 0; k < w->nc; k++)
            {
                jf = (n1 & (ni + k));
                work->scratch[jf] += (w->h2[k] * ai + w->g2[k] * ai1);
            }
        }
    }

    for (i = 0; i < n; i++)
    {
        ELEMENT (a, stride, i) = work->scratch[i];
    }
}

int gsl_wavelet2d_nstransform_up_to_levels(const gsl_wavelet * w,
                           double *data, size_t tda, size_t size1,
                           size_t size2, gsl_wavelet_direction dir,
                           gsl_wavelet_workspace * work, const int levels) {
    size_t i, j;
    if (size1 != size2) {
        GSL_ERROR ("2d dwt works only with square matrix", GSL_EINVAL);
    }
    if (work->n < size1) {
        GSL_ERROR ("not enough workspace provided", GSL_EINVAL);
    }
    if (binary_logn (size1) == -1) {
        GSL_ERROR ("n is not a power of 2", GSL_EINVAL);
    }
    if (size1 < 2) {
        return GSL_SUCCESS;
    }

    int level = 1;
    if (dir == gsl_wavelet_forward) {
        for (i = size1; i >= 2 && level <= levels; i >>= 1) {
            //printf("level = %d\n", level);
            for (j = 0; j < i; j++) {      /* for every row j */
                dwt_step (w, &ELEMENT(data, tda, j), 1, i, dir, work);
            }
            for (j = 0; j < i; j++) {      /* for every column j */
                dwt_step (w, &ELEMENT(data, 1, j), tda, i, dir, work);
            }
            level++;
        }
    } else {
        //printf("start from = %d\n", (int) (size1 / pow(2, levels - 1)));
        for (i = (int) (size1 / pow(2, levels - 1)); i <= size1 && level <= levels; i <<= 1) {
            //printf("inverse level = %d\n", level);
            for (j = 0; j < i; j++) {     /* for every column j */
                dwt_step (w, &ELEMENT(data, 1, j), tda, i, dir, work);
            }
            for (j = 0; j < i; j++) {     /* for every row j */
                dwt_step (w, &ELEMENT(data, tda, j), 1, i, dir, work);
            }
            level++;
        }
    }
    return GSL_SUCCESS;
}

int gsl_wavelet2d_nstransform_matrix_forward_up_to_levels(const gsl_wavelet * w, gsl_matrix * a,
                                          gsl_wavelet_workspace * work, const int levels) {
    return gsl_wavelet2d_nstransform_up_to_levels(w, a->data, a->tda, a->size1, a->size2, gsl_wavelet_forward, work, levels);
}

int gsl_wavelet2d_nstransform_matrix_inverse_up_to_levels(const gsl_wavelet * w, gsl_matrix * a,
                                                          gsl_wavelet_workspace * work, const int levels) {
    return gsl_wavelet2d_nstransform_up_to_levels(w, a->data, a->tda, a->size1, a->size2, gsl_wavelet_backward, work, levels);
}

EMSCRIPTEN_KEEPALIVE void dwt(const double *inPtr, double *outPtr, const int width, const int height, const char direction, const int levels) {
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
            gsl_matrix_set (m1, i, j, val);
        }
    }

    m2 = gsl_matrix_alloc (width, height);
    gsl_matrix_memcpy (m2, m1);

    work = gsl_wavelet_workspace_alloc (width);
    w = gsl_wavelet_alloc (T, member);

    if (direction == 0) {
        gsl_wavelet2d_nstransform_matrix_forward_up_to_levels(w, m2, work, levels);
    } else {
        gsl_wavelet2d_nstransform_matrix_inverse_up_to_levels(w, m2, work, levels);
    }

    for (i = 0; i < width; i++) {
        for (j = 0; j < height; j++) {
            double x1 = gsl_matrix_get (m1, i, j );
            double x2 = gsl_matrix_get (m2, i, j );
            // printf("(%lu, %lu): %f -> %f\n", i, j, x1, x2);
            outPtr[i + width * j] = x2;
        }
    }

    free (data);
    gsl_wavelet_workspace_free (work);
    gsl_wavelet_free (w);
    gsl_matrix_free (m2);
    return;
}
