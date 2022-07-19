src/lib/imagemagick/imagemagick.mjs: src/lib/imagemagick/interface.o src/lib/imagemagick/imagemagick.o src/lib/libjpeg/install/lib/libjpeg.a
	export PKG_CONFIG_PATH=${PWD}/src/lib/imagemagick/install/lib/pkgconfig:${PWD}/src/lib/libjpeg/install/lib/pkgconfig; \
    	echo `src/lib/imagemagick/install/bin/MagickCore-config --cflags --cppflags --ldflags --libs` && \
		em++ -Wall --bind src/lib/imagemagick/interface.o src/lib/imagemagick/imagemagick.o \
		  src/lib/libjpeg/install/lib/libjpeg.a \
		  src/lib/libpng/install/lib/libpng.a \
		  src/lib/zlib/install/lib/libz.a \
		  src/lib/openjpeg/install/lib/libopenjp2.a \
		  src/lib/libheif/install/lib/libheif.a \
		  src/lib/libde265/install/lib/libde265.a \
		  src/lib/libtiff/install/lib/libtiff.a \
		  -o src/lib/imagemagick/imagemagick.mjs \
		  -s ENVIRONMENT='web' \
		  -s SINGLE_FILE=1 \
		  -s DISABLE_EXCEPTION_CATCHING=0 \
		  -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
		  -s EXPORT_NAME='createImageMagickModule' \
		  -s USE_ES6_IMPORT_META=0 \
		  -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' \
		  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
		  -s ALLOW_MEMORY_GROWTH=1 \
		  `src/lib/imagemagick/install/bin/MagickCore-config --cflags --cppflags --ldflags --libs` \
		  -I./src/lib/libjpeg/install/include \
		  -I./src/lib/imagemagick \
		  -L./src/lib/libjpeg/install/libs \
		  -O3

src/lib/imagemagick/interface.o: src/lib/imagemagick/imagemagick.o
	em++ -c src/lib/imagemagick/interface.cpp \
 		  -o src/lib/imagemagick/interface.o \
 		  -DMAGICKCORE_HDRI_ENABLE=0 \
 		  -DMAGICKCORE_QUANTUM_DEPTH=16 \
 		  -I./src/lib/imagemagick/install/include/ImageMagick-7 \
 		  -I./src/lib/libjpeg/install/include \
 		  -O3

src/lib/imagemagick/imagemagick.o: src/lib/imagemagick/install/lib/libMagickCore-7.Q16.a
	emcc -c src/lib/imagemagick/imagemagick.c \
 		  -o src/lib/imagemagick/imagemagick.o \
 		  -DMAGICKCORE_HDRI_ENABLE=0 \
 		  -DMAGICKCORE_QUANTUM_DEPTH=16 \
 		  -I./src/lib/imagemagick/install/include/ImageMagick-7 \
 		  -I./src/lib/libjpeg/install/include \
 		  -O3

src/lib/imagemagick/install/lib/libMagickCore-7.Q16.a: src/lib/libjpeg/install/lib/libjpeg.a src/lib/libpng/install/lib/libpng.a src/lib/openjpeg/install/lib/libopenjp2.a src/lib/libheif/install/lib/libheif.a src/lib/libtiff/install/lib/libtiff.a src/lib/imagemagick/source/configure
	export PKG_CONFIG_PATH="${PWD}/src/lib/imagemagick/install/lib/pkgconfig:${PWD}/src/lib/libjpeg/install/lib/pkgconfig:${PWD}/src/lib/libpng/install/lib/pkgconfig:${PWD}/src/lib/zlib/install/lib/pkgconfig:${PWD}/src/lib/openjpeg/install/lib/pkgconfig:${PWD}/src/lib/libde265/install/lib/pkgconfig:${PWD}/src/lib/libheif/install/lib/pkgconfig:${PWD}/src/lib/libtiff/install/lib/pkgconfig"; \
	export CFLAGS="-I${PWD}/src/lib/libjpeg/install/include -I${PWD}/src/lib/libpng/install/include -I${PWD}/src/lib/zlib/install/include -I${PWD}/src/lib/openjpeg/install/include -I${PWD}/src/lib/libde265/install/include -I${PWD}/src/lib/libheif/install/include -I${PWD}/src/lib/libtiff/install/include -O3"; \
	export LDFLAGS="-L${PWD}/src/lib/libjpeg/install/lib -L${PWD}/src/lib/libpng/install/lib -L${PWD}/src/lib/zlib/install/lib -L${PWD}/src/lib/openjpeg/install/lib -L${PWD}/src/lib/libde265/install/lib -L${PWD}/src/lib/libheif/install/lib -L${PWD}/src/lib/libtiff/install/lib"; \
		cd src/lib/imagemagick/source; \
		git checkout 7.1.0.43 && \
			emconfigure ./configure \
			--disable-shared \
            --disable-largefile \
            --disable-openmp \
            --without-bzlib \
            --without-dps \
            --without-freetype \
            --without-jbig \
            --without-lcms \
            --without-wmf \
            --without-xml \
            --without-fftw \
            --without-flif \
            --without-fpx \
            --without-djvu \
            --without-fontconfig \
            --without-raqm \
            --without-gslib \
            --without-gvc \
            --without-lqr \
            --without-openexr \
            --without-pango \
            --without-raw \
            --without-rsvg \
            --without-webp \
            --without-xml \
			--without-threads \
			--without-x \
			--with-quantum-depth=16 \
			--without-perl \
			--enable-hdri=no \
			--with-utilities=no \
			--with-heic=yes \
			--without-magick-plus-plus \
			--prefix=${PWD}/src/lib/imagemagick/install \
			PKG_CONFIG_PATH="${PWD}/src/lib/imagemagick/install/lib/pkgconfig:${PWD}/src/lib/libjpeg/install/lib/pkgconfig:${PWD}/src/lib/libpng/install/lib/pkgconfig:${PWD}/src/lib/zlib/install/lib/pkgconfig:${PWD}/src/lib/openjpeg/install/lib/pkgconfig:${PWD}/src/lib/libde265/install/lib/pkgconfig:${PWD}/src/lib/libheif/install/lib/pkgconfig:${PWD}/src/lib/libtiff/install/lib/pkgconfig" && \
			emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 && \
			emmake make install

src/lib/libpng/install/lib/libpng.a: src/lib/libpng/source/CMakeLists.txt src/lib/zlib/install/lib/libz.a
	export CPPFLAGS="-I${PWD}/src/lib/zlib/install/include" LDFLAGS="-L${PWD}/src/lib/zlib/install/lib"; \
	cd src/lib/libpng/source && \
	git checkout v1.6.37 && \
		libtoolize && \
        autoreconf && \
        automake --add-missing && \
        emconfigure ./configure \
			--disable-shared \
			--prefix=${PWD}/src/lib/libpng/install && \
        emmake make -s BINARYEN_TRAP_MODE=clamp -s ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" CXXFLAGS="-O3" && \
		emmake make install

src/lib/zlib/install/lib/libz.a: src/lib/zlib/source/CMakeLists.txt src/lib/gsl/gsl.mjs
	cd src/lib/zlib/source && \
	git checkout v1.2.12 && \
        emconfigure ./configure \
			--static \
			--prefix=${PWD}/src/lib/zlib/install && \
        emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" CXXFLAGS="-O3" && \
		emmake make install

src/lib/libjpeg/install/lib/libjpeg.a: src/lib/libjpeg/source/configure src/lib/gsl/gsl.mjs
	cd src/lib/libjpeg/source; \
		autoreconf -fvi && \
		emconfigure ./configure \
			--disable-shared \
			--prefix=${PWD}/src/lib/libjpeg/install && \
		emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" CXXFLAGS="-O3" && \
		emmake make install

src/lib/libheif/install/lib/libheif.a: src/lib/libde265/install/lib/libde265.a
	export MACOSX_DEPLOYMENT_TARGET="10.14.1"; \
	export PKG_CONFIG_PATH="${PWD}/src/lib/libde265/install/lib/pkgconfig"; \
	export CFLAGS="-I${PWD}/src/lib/libde265/install/include -O3"; \
	export CXXLAGS="-I${PWD}/src/lib/libde265/install/include -O3"; \
	export CPPLAGS="-I${PWD}/src/lib/libde265/install/include -O3"; \
	export LDFLAGS="-L${PWD}/src/lib/libde265/install/lib "; \
	cd src/lib/libheif/source && \
		git checkout v1.12.0 && \
		./autogen.sh && \
    	emconfigure ./configure \
    		--disable-shared \
    		--disable-multithreading \
    		--disable-go \
    		--disable-examples \
    		--prefix=${PWD}/src/lib/libheif/install \
			PKG_CONFIG_PATH="${PWD}/src/lib/libde265/install/lib/pkgconfig" \
			libde265_CFLAGS="-I${PWD}/src/lib/libde265/install/include" \
			libde265_LIBS="-L${PWD}/src/lib/libde265/install/lib" && \
		emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" CXXFLAGS="-O3" && \
		emmake make install

src/lib/libde265/install/lib/libde265.a: src/lib/libde265/source/CMakeLists.txt src/lib/gsl/gsl.mjs
	cd src/lib/libde265/source && \
		git checkout v1.0.8 && \
		./autogen.sh && \
		emconfigure ./configure \
			--disable-shared \
			--disable-dec265 \
			--disable-sherlock265 \
			--prefix=${PWD}/src/lib/libde265/install && \
		emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" CXXFLAGS="-O3" && \
		emmake make install

src/lib/openjpeg/install/lib/libopenjp2.a: src/lib/openjpeg/source/CMakeLists.txt
	cd src/lib/openjpeg/source && \
		git checkout v2.5.0 && \
		mkdir build && \
		cd build && \
		emcmake cmake .. -DCMAKE_BUILD_TYPE=Release \
		 	  -DCMAKE_INSTALL_PREFIX=${PWD}/src/lib/openjpeg/install && \
		emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" CXXFLAGS="-O3" && \
		emmake make install

src/lib/libtiff/install/lib/libtiff.a: src/lib/libtiff/source/CMakeLists.txt
	cd src/lib/libtiff/source; \
		git checkout v4.2.0 && \
		./autogen.sh && \
		emconfigure ./configure \
			--disable-shared \
			--prefix=${PWD}/src/lib/libtiff/install && \
		emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" CXXFLAGS="-O3" && \
		emmake make install

src/lib/gsl/gsl.mjs: src/lib/gsl/source/.libs/libgsl.a
	emcc --no-entry \
	  src/lib/gsl/source/**/*.o \
	  --bind src/lib/gsl/gsl.c \
	  -o src/lib/gsl/gsl.mjs \
	  -s ENVIRONMENT='web' \
	  -s SINGLE_FILE=1 \
	  -s EXPORT_NAME='createGSLModule' \
	  -s USE_ES6_IMPORT_META=0 \
	  -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
	  -s ALLOW_MEMORY_GROWTH=1 \
	  -I./src/lib/gsl/source/ \
	  -O3

src/lib/gsl/source/.libs/libgsl.a: src/lib/gsl/source/gsl
	cd src/lib/gsl/source; \
		autoreconf -i; \
		emconfigure ./configure; \
		emmake make LDFLAGS=-all-static

clean-libjpeg:
	git rm -rf src/lib/libjpeg/source || true;
	rm -rf .git/modules/src/lib/libjpeg/source;
	git config --remove-section submodule.src/lib/libjpeg/source || true;
	git submodule add https://gitlab.com/zhuvikin/libjpeg.git src/lib/libjpeg/source;

clean-zlib:
	git rm -rf src/lib/zlib/source || true;
	rm -rf .git/modules/src/lib/zlib/source;
	git config --remove-section submodule.src/lib/zlib/source || true;
	git submodule add https://github.com/madler/zlib.git src/lib/zlib/source;

clean-libpng:
	git rm -rf src/lib/libpng/source || true;
	rm -rf .git/modules/src/lib/libpng/source;
	git config --remove-section submodule.src/lib/libpng/source || true;
	git submodule add git://git.code.sf.net/p/libpng/code src/lib/libpng/source;

clean-openjpeg:
	git rm -rf src/lib/openjpeg/source || true;
	rm -rf .git/modules/src/lib/openjpeg/source;
	git config --remove-section submodule.src/lib/openjpeg/source || true;
	git submodule add https://github.com/uclouvain/openjpeg.git src/lib/openjpeg/source;

clean-libheif:
	git rm -rf src/lib/libheif/source || true;
	rm -rf .git/modules/src/lib/libheif/source;
	git config --remove-section submodule.src/lib/libheif/source || true;
	git submodule add https://github.com/strukturag/libheif.git src/lib/libheif/source;

clean-libde265:
	git rm -rf src/lib/libde265/source || true;
	rm -rf .git/modules/src/lib/libde265/source;
	git config --remove-section submodule.src/lib/libde265/source || true;
	git submodule add https://github.com/strukturag/libde265.git src/lib/libde265/source;

clean-libtiff:
	git rm -rf src/lib/libtiff/source || true;
	rm -rf .git/modules/src/lib/libtiff/source;
	git config --remove-section submodule.src/lib/libtiff/source || true;
	git submodule add git@gitlab.com:libtiff/libtiff.git src/lib/libtiff/source;

clean-imagemagick:
	git rm -f src/lib/imagemagick/source || true;
	rm -rf .git/modules/src/lib/imagemagick/source;
	git config --remove-section submodule.src/lib/imagemagick/source || true;
	git submodule add https://github.com/ImageMagick/ImageMagick.git src/lib/imagemagick/source;

clean-gsl:
	git rm -rf src/lib/gsl/source || true;
	rm -rf .git/modules/src/lib/gsl/source;
	git config --remove-section submodule.src/lib/gsl/source || true;
	git submodule add git://git.savannah.gnu.org/gsl.git src/lib/gsl/source;

clean-im:
	rm src/lib/imagemagick/imagemagick.mjs || true; \
		rm src/lib/imagemagick/interface.o || true; \
		rm src/lib/imagemagick/imagemagick.o || true