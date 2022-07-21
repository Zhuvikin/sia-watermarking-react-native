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
    int channels;
    std::string format;

    int number_channels;
    int number_meta_channels;
    int metacontent_extent;

    unsigned int pixelsPointer;

    ImageDetails(std::string imgBase64);
};

ImageDetails::ImageDetails(std::string imgBase64) {
    unsigned char *decodedBlob;
    int channels, x, y;
    const Quantum *quantumSrc;

    ImageInfo *imageInfo = AcquireImageInfo();
    ExceptionInfo *exception = AcquireExceptionInfo();
    QuantumInfo *quantumInfo;
    Image *image = test_imagemagick_c(imgBase64.c_str(), decodedBlob, imageInfo, exception);
    channels = GetPixelChannels(image);

    width = image->columns;
    height = image->rows;
    colorspace = image->colorspace;
    depth = image->depth;

    const char* end = std::find(image->magick, image->magick + sizeof(image->magick), '\0');
    format.resize(end - image->magick);
    std::copy(image->magick, image->magick + (end - image->magick), begin(format));

    number_channels = image->number_channels;
    number_meta_channels = image->number_meta_channels;
    metacontent_extent = image->metacontent_extent;

    printf("channels=%i\n", channels);
    quantumSrc = GetVirtualPixels(image, 0, 0, width, height, exception);

    unsigned char* pixels = new unsigned char[width * height * 4];
    long accessPixelsPtr = 0;
    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            pixels[accessPixelsPtr + 0] = ScaleQuantumToChar(GetPixelRed(image, quantumSrc));
            pixels[accessPixelsPtr + 1] = ScaleQuantumToChar(GetPixelGreen(image, quantumSrc));
            pixels[accessPixelsPtr + 2] = ScaleQuantumToChar(GetPixelBlue(image, quantumSrc));
            pixels[accessPixelsPtr + 3] = ScaleQuantumToChar(GetPixelAlpha(image, quantumSrc));

            quantumSrc += channels;
            accessPixelsPtr += 4;
        }
    }

    pixelsPointer = (unsigned int) pixels;

    free(decodedBlob);
    image = DestroyImage(image);
    imageInfo = DestroyImageInfo(imageInfo);
    exception = DestroyExceptionInfo(exception);
}

EMSCRIPTEN_BINDINGS(imagemagick) {
        class_<ImageDetails>("ImageDetails")
                .constructor<std::string>()
                .property("width", &ImageDetails::width)
                .property("height", &ImageDetails::height)
                .property("colorspace", &ImageDetails::colorspace)
                .property("depth", &ImageDetails::depth)
                .property("format", &ImageDetails::format)
                .property("channels", &ImageDetails::depth)
                .property("number_channels", &ImageDetails::number_channels)
                .property("number_meta_channels", &ImageDetails::number_meta_channels)
                .property("metacontent_extent", &ImageDetails::metacontent_extent)
                .property("pixelsPointer", &ImageDetails::pixelsPointer);
}