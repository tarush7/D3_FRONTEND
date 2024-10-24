import { createSlice } from '@reduxjs/toolkit';
import { fetchArticles } from '../articles/articleThunk';

const articlesSlice = createSlice({
  name: 'articles',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default articlesSlice.reducer;
