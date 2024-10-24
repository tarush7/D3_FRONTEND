import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRelations = createAsyncThunk('relations/fetchRelations', async () => {
  const response = await axios.get('https://d3-backend.onrender.com/get_folder_data', {
    headers: {
      'accept': 'application/json',
    },
  });
  const relations = response.data.data.flatMap(article => article.analyticsData?.relationExtraction || []);
  console.log('Fetched relations:', relations);
  return relations;
});
