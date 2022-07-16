clean-im:
	rm src/lib/imagemagick/imagemagick.mjs

src/lib/imagemagick/imagemagick.mjs: src/lib/imagemagick/install/lib/libMagickCore-7.Q16.a
	export PKG_CONFIG_PATH=${PWD}/src/lib/imagemagick/install/lib/pkgconfig/:${PWD}/src/lib/libjpeg/install/lib/pkgconfig/; \
    	echo `src/lib/imagemagick/install/bin/MagickCore-config --cflags --ldflags --libs`; \
		emcc --no-entry \
		  src/lib/libjpeg/install/lib/libjpeg.a \
		  --bind src/lib/imagemagick/imagemagick.c \
		  -o src/lib/imagemagick/imagemagick.mjs \
		  -s ENVIRONMENT='web' \
		  -s SINGLE_FILE=1 \
		  -s DISABLE_EXCEPTION_CATCHING=0 \
		  -s EXPORT_NAME='createImageMagickModule' \
		  -s USE_ES6_IMPORT_META=0 \
		  -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' \
		  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
		  -s ALLOW_MEMORY_GROWTH=1 \
		  `src/lib/imagemagick/install/bin/MagickCore-config --cflags --ldflags --libs` \
		  -I./src/lib/libjpeg/install/include \
		  -L./src/lib/libjpeg/install/libs \
		  -O3

src/lib/imagemagick/install/lib/libMagickCore-7.Q16.a: src/lib/libjpeg/source/.libs/libjpeg.a src/lib/imagemagick/source/configure
	export PKG_CONFIG_PATH=${PWD}/src/lib/imagemagick/install/lib/pkgconfig/:${PWD}/src/lib/libjpeg/install/lib/pkgconfig/; \
	export CFLAGS="-I${PWD}/src/lib/libjpeg/install/include/ -O3"; \
	export LDFLAGS="-L${PWD}/src/lib/libjpeg/install/lib/"; \
		cd src/lib/imagemagick/source; \
			emconfigure ./configure \
			--disable-shared \
			--without-threads \
			--without-x \
			--with-quantum-depth=16 \
			--without-perl \
			--enable-hdri=no \
			--without-magick-plus-plus \
			--prefix=${PWD}/src/lib/imagemagick/install \
			PKG_CONFIG_PATH="${PWD}/src/lib/imagemagick/install/lib/pkgconfig/:${PWD}/src/lib/libjpeg/install/lib/pkgconfig/" && \
			emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 && \
			emmake make install

src/lib/libjpeg/source/.libs/libjpeg.a: src/lib/libjpeg/source/configure
	cd src/lib/libjpeg/source; \
		autoreconf -fvi && \
		emconfigure ./configure \
			--disable-shared \
			--prefix=${PWD}/src/lib/libjpeg/install && \
		emmake make BINARYEN_TRAP_MODE=clamp ALLOW_MEMORY_GROWTH=1 CFLAGS="-O3" && \
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
		emcmake make LDFLAGS=-all-static

clean-libjpeg:
	git rm -f src/lib/libjpeg/source;
	rm -rf .git/modules/src/lib/libjpeg/source;
	git config --remove-section submodule.src/lib/libjpeg/source
	git submodule add https://gitlab.com/zhuvikin/libjpeg.git src/lib/libjpeg/source

clean-imagemagick:
	git rm -f src/lib/imagemagick/source;
	rm -rf .git/modules/src/lib/imagemagick/source;
	git config --remove-section submodule.src/lib/imagemagick/source
	git submodule add https://github.com/ImageMagick/ImageMagick.git src/lib/imagemagick/source