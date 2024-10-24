import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const response = await axios.get('https://d3-backend.onrender.com/get_folder_data', {
    headers: {
      'accept': 'application/json',
    },
  });
  const articles = response.data.data;
  console.log('Fetched articles:', articles);
  return articles;
});
