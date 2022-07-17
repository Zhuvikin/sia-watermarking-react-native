src/lib/imagemagick/imagemagick.mjs: src/lib/imagemagick/interface.o src/lib/imagemagick/imagemagick.o src/lib/libjpeg/install/lib/libjpeg.a
	export PKG_CONFIG_PATH=${PWD}/src/lib/imagemagick/install/lib/pkgconfig/:${PWD}/src/lib/libjpeg/install/lib/pkgconfig/; \
    	echo `src/lib/imagemagick/install/bin/MagickCore-config --cflags --cppflags --ldflags --libs` && \
		em++ -Wall --bind src/lib/imagemagick/interface.o src/lib/imagemagick/imagemagick.o \
		  src/lib/libjpeg/install/lib/libjpeg.a \
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
 		  -L./src/lib/imagemagick/install/lib \
 		  -L./src/lib/libjpeg/install/lib \
 		  -lMagickCore-7.Q16 \
 		  -O3

src/lib/imagemagick/imagemagick.o: src/lib/imagemagick/install/lib/libMagickCore-7.Q16.a src/lib/libjpeg/install/lib/libjpeg.a
	emcc -c src/lib/imagemagick/imagemagick.c \
 		  -o src/lib/imagemagick/imagemagick.o \
 		  -DMAGICKCORE_HDRI_ENABLE=0 \
 		  -DMAGICKCORE_QUANTUM_DEPTH=16 \
 		  -I./src/lib/imagemagick/install/include/ImageMagick-7 \
 		  -I./src/lib/libjpeg/install/include \
 		  -L./src/lib/imagemagick/install/lib \
 		  -L./src/lib/libjpeg/install/lib \
 		  -lMagickCore-7.Q16 \
 		  -O3

src/lib/imagemagick/install/lib/libMagickCore-7.Q16.a: src/lib/libjpeg/install/lib/libjpeg.a src/lib/imagemagick/source/configure
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

src/lib/libjpeg/install/lib/libjpeg.a: src/lib/libjpeg/source/configure src/lib/gsl/gsl.mjs
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
		emmake make LDFLAGS=-all-static

clean-libjpeg:
	git rm -rf src/lib/libjpeg/source || true;
	rm -rf .git/modules/src/lib/libjpeg/source;
	git config --remove-section submodule.src/lib/libjpeg/source || true;
	git submodule add https://gitlab.com/zhuvikin/libjpeg.git src/lib/libjpeg/source;

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