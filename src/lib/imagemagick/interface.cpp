#include <emscripten.h>
#include <emscripten/bind.h>
#include <string>

extern "C" {
#include <MagickCore/MagickCore.h>
#include "imagemagick.h"
}

using namespace emscripten;

struct ImageDetails {
    int width;
    int height;
    int colorspace;
    int depth;
};

ImageDetails ImageDetailsFromBase64(std::string imgBase64) {
    unsigned char* decodedBlob;
    ImageInfo* imageInfo = AcquireImageInfo();
    ExceptionInfo* exceptionInfo = AcquireExceptionInfo();

    Image* image = test_imagemagick_c(imgBase64.c_str(), decodedBlob, imageInfo, exceptionInfo);
    ImageDetails imageDetails;
    imageDetails.width = image->columns;
    imageDetails.height = image->rows;
    imageDetails.colorspace = image->colorspace;
    imageDetails.depth = image->depth;

    free(decodedBlob);
    image = DestroyImage(image);
    imageInfo = DestroyImageInfo(imageInfo);
    exceptionInfo = DestroyExceptionInfo(exceptionInfo);

    return imageDetails;
}

EMSCRIPTEN_BINDINGS(image_details) {
    class_<ImageDetails>("ImageDetails")
        .constructor<>()
        .property("width", &ImageDetails::width)
        .property("height", &ImageDetails::height)
        .property("colorspace", &ImageDetails::colorspace)
        .property("depth", &ImageDetails::depth)
    ;

    function("ImageDetailsFromBase64", &ImageDetailsFromBase64);
}