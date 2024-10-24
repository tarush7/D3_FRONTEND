import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from '../features/articles/articleSlice';
import relationsReducer from '../features/relations/relationSlice'
import selectedArticlesReducer from '../features/articles/selectedArticlesSlice';
import mergedRelationsReducer from '../features/articles/mergedRelationsSlice';
import apiRelationsReducer from '../features/relations/apiRelationsSlice'; 


export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    relations: relationsReducer,
    selectedArticles: selectedArticlesReducer,
    mergedRelations: mergedRelationsReducer,
    apiRelations: apiRelationsReducer,
   
  },
});
