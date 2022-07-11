src/lib/gsl/gsl.mjs: src/lib/gsl/source/.libs/libgsl.a
	emcc --no-entry \
	  src/lib/gsl/source/**/*.o \
	  --bind src/lib/gsl/gsl.c \
	  -o src/lib/gsl/gsl.mjs \
	  -s ENVIRONMENT='web' \
	  -s SINGLE_FILE=1 \
	  -s EXPORT_NAME='createGSLModule' \
	  -s USE_ES6_IMPORT_META=0 \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
	  -I./src/lib/gsl/source/ \
	  -O3

src/lib/gsl/source/.libs/libgsl.a: src/lib/gsl/source/gsl
	cd src/lib/gsl/source; \
		autoreconf -i; \
		emconfigure ./configure; \
		emmake make LDFLAGS=-all-static