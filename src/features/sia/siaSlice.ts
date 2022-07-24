import {
  createAsyncThunk,
  createSlice,
  SerializedError,
} from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { Image } from '../../lib/imagemagick/types/image';
import { toBase64 } from '../../content/ImageLoad/utils';
import { getImageMagick } from '../../lib/imagemagick';

export interface SiaState {
  image: Image | undefined;
  isLoaded: boolean;
  isSelected: boolean;
  error: SerializedError | undefined;
}

export const initialState: SiaState = {
  image: undefined,
  isLoaded: false,
  isSelected: false,
  error: undefined,
};

export const loadImage = createAsyncThunk<Image, File, { state: RootState }>(
  'load/openImage',
  async (file: File, thunkAPI) => {
    const base64EncodedImage = await toBase64(file);
    const imageMagick = await getImageMagick();
    return imageMagick.imageFromBase64(base64EncodedImage);
  },
);

export const siaSlice = createSlice({
  name: 'sia',
  initialState,
  reducers: {
    resetImage: state => {
      state.isSelected = false;
      state.isLoaded = false;
      state.image = undefined;
      state.error = undefined;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadImage.pending, state => {
        state.isSelected = true;
        state.isLoaded = false;
        state.image = undefined;
        state.error = undefined;
      })
      .addCase(loadImage.fulfilled, (state, action) => {
        state.isSelected = true;
        state.isLoaded = true;
        state.image = action.payload;
        state.error = undefined;
      })
      .addCase(loadImage.rejected, (state, action) => {
        state.isSelected = false;
        state.isLoaded = false;
        state.image = undefined;
        state.error = action.error;
      });
  },
});

export const { resetImage } = siaSlice.actions;

export const selectImage = (state: RootState) => state.sia.image;
export const selectIsImageLoaded = (state: RootState) => state.sia.isLoaded;
export const selectIsImageSelected = (state: RootState) => state.sia.isSelected;

export default siaSlice.reducer;
