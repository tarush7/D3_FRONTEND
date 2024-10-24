import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for merging relations via API
export const postMergedRelations = createAsyncThunk(
  'apiRelations/postMergedRelations',
  async (mergedRelations, { rejectWithValue }) => {
    try {
      console.log("Attempting to send merged relations to API:", mergedRelations); // Debugging log
      const response = await axios.post('https://d3-backend.onrender.com/get_merged_json/', mergedRelations, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log("API response received:", response.data); // Debugging log
      return response.data;
    } catch (error) {
      console.error("API request failed:", error.response ? error.response.data : error.message); // Debugging log
      return rejectWithValue(error.response ? error.response.data : { message: 'Unknown error occurred' });
    }
  }
);

const initialState = {
  apiStatus: 'idle',
  apiResponse: null,
  error: null,
};

const apiRelationsSlice = createSlice({
  name: 'apiRelations',
  initialState,
  reducers: {
    clearApiResponse(state) {
      state.apiStatus = 'idle';
      state.apiResponse = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postMergedRelations.pending, (state) => {
        console.log("API call pending..."); // Debugging log
        state.apiStatus = 'loading';
      })
      .addCase(postMergedRelations.fulfilled, (state, action) => {
        console.log("API call succeeded:", action.payload); // Debugging log
        state.apiStatus = 'succeeded';
        state.apiResponse = action.payload;
        state.error = null;
      })
      .addCase(postMergedRelations.rejected, (state, action) => {
        console.error("API call failed:", action.payload); // Debugging log
        state.apiStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearApiResponse } = apiRelationsSlice.actions;
export default apiRelationsSlice.reducer;
