#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE void double_numbers(const double *v1, double *v2, const int length)
{
   int i = 0;
   for (i = 0; i < length; i++)
   {
       v2[i] = 2 * v1[i];
   }
}