import { createSlice } from '@reduxjs/toolkit';
import { fetchRelations } from '../relations/relationThunk';

const relationSlice = createSlice({
  name: 'relations',
  initialState: {
    data: [],
  },
  reducers: {
    updateRelations: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRelations.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { updateRelations } = relationSlice.actions;
export const selectRelations = (state) => state.relations.data;
export default relationSlice.reducer;
