src/lib/gsl/gsl.mjs: src/lib/gsl/source/.libs/libgsl.a
	emcc -g -o src/lib/gsl/gsl.mjs \
		-s LINKABLE=1 \
		-s EXPORT_ALL=1 \
		-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
		-s ENVIRONMENT='web' \
	  	-s SINGLE_FILE=1 \
	  	-s EXPORT_NAME='createGSLModule' \
	  	-s USE_ES6_IMPORT_META=0 \
		-s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
		src/lib/gsl/source/.libs/libgsl.a -lm \
		-O3 

#-s MODULARIZE 

src/lib/gsl/source/.libs/libgsl.a: src/lib/add/add.mjs
	cd src/lib/gsl/source; \
		autoreconf -i; \
		emconfigure ./configure; \
		emmake make LDFLAGS=-all-static

src/lib/add/add.mjs: src/lib/add/add.c
	emcc --no-entry src/lib/add/add.c -o src/lib/add/add.mjs \
	  -s ENVIRONMENT='web' \
	  -s SINGLE_FILE=1 \
	  -s EXPORT_NAME='createAddModule' \
	  -s USE_ES6_IMPORT_META=0 \
	  -s EXPORTED_FUNCTIONS='["_add", "_malloc", "_free"]' \
	  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
	  -O3
