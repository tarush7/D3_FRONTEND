// src/features/articles/selectedArticlesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedArticles: [],
};

const selectedArticlesSlice = createSlice({
  name: 'selectedArticles',
  initialState,
  reducers: {
    toggleArticle(state, action) {
      const article = action.payload;
      const index = state.selectedArticles.findIndex((a) => a.articleId === article.articleId);
      if (index === -1) {
        state.selectedArticles.push(article);
      } else {
        state.selectedArticles.splice(index, 1);
      }
    },
  },
});

export const { toggleArticle } = selectedArticlesSlice.actions;
export default selectedArticlesSlice.reducer;
