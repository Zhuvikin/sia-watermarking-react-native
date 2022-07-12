#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <stdio.h>

EMSCRIPTEN_KEEPALIVE void double_numbers(const double *inPtr, const int inLength, double *outPtr, const int outLength)
{
   int i = 0;
   for (i = 0; i < outLength; i++)
   {
       outPtr[i] = 2 * inPtr[i];
   }
}