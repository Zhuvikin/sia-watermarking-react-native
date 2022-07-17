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

    printf("imgBase64 = %s\n", imgBase64);
    printf("width=%lu, height=%lu, colorspace=%i, depth=%lu\n", image->columns, image->rows, image->colorspace, image->depth);
    return image;
}