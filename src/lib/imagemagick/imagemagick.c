#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <MagickCore/MagickCore.h>
#include "imagemagick.h"

Image* test_imagemagick_c(const char* imgBase64, unsigned char* decodedBlob, ImageInfo* imageInfo, ExceptionInfo* exceptionInfo)
{
    size_t decodedBlobLength;
    decodedBlob = Base64Decode(imgBase64, &decodedBlobLength);

    Image* image = BlobToImage(imageInfo, decodedBlob, decodedBlobLength, exceptionInfo);
    if (exceptionInfo->severity != UndefinedException)
        CatchException(exceptionInfo);

    printf("image width=%lu, height=%lu, colorspace=%i, depth=%lu, blob length=%lu\n",
           image->columns, image->rows, image->colorspace, image->depth, decodedBlobLength);
    return image;
}