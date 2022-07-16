#include <emscripten/emscripten.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <MagickCore/MagickCore.h>

EMSCRIPTEN_KEEPALIVE double test_imagemagick(const char* imgBase64)
{
    size_t decodedBlobLength;
    unsigned char* decodedBlob = Base64Decode(imgBase64, &decodedBlobLength);

    ExceptionInfo* exceptionInfo = AcquireExceptionInfo();
    ImageInfo* imageInfo = AcquireImageInfo();
    Image* image = BlobToImage(imageInfo, decodedBlob, decodedBlobLength, exceptionInfo);
    if (exceptionInfo->severity != UndefinedException)
        CatchException(exceptionInfo);

    printf("imgBase64 = %s\n", imgBase64);
    printf("width=%lu, height=%lu, colorspace=%i, depth=%lu\n", image->columns, image->rows, image->colorspace, image->depth);

    free(decodedBlob);
    image = DestroyImage(image);
    imageInfo = DestroyImageInfo(imageInfo);
    exceptionInfo = DestroyExceptionInfo(exceptionInfo);
    return 0;
}