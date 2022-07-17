#include <emscripten.h>
#include <emscripten/bind.h>
#include <string>

extern "C" {
#include <MagickCore/MagickCore.h>
#include "imagemagick.h"
}

using namespace emscripten;

class ImageDetails {
public:
    int width;
    int height;
    int colorspace;
    int depth;
    unsigned int pixelsPointer;

    ImageDetails(std::string imgBase64) {
        unsigned char *decodedBlob;
        ImageInfo *imageInfo = AcquireImageInfo();
        ExceptionInfo *exception = AcquireExceptionInfo();
        Image *image = test_imagemagick_c(imgBase64.c_str(), decodedBlob, imageInfo, exception);

        width = image->columns;
        height = image->rows;
        colorspace = image->colorspace;
        depth = image->depth;
        pixelsPointer = (unsigned int) GetVirtualPixels(image, 0, 0, image->columns, image->rows, exception);

        free(decodedBlob);
        image = DestroyImage(image);
        imageInfo = DestroyImageInfo(imageInfo);
        exception = DestroyExceptionInfo(exception);
    };
};

EMSCRIPTEN_BINDINGS(imagemagick) {
        class_<ImageDetails>("ImageDetails")
                .constructor<std::string>()
                .property("width", &ImageDetails::width)
                .property("height", &ImageDetails::height)
                .property("colorspace", &ImageDetails::colorspace)
                .property("depth", &ImageDetails::depth)
                .property("pixelsPointer", &ImageDetails::pixelsPointer);
}