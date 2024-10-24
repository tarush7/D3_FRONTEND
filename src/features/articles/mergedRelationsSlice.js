import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mergedRelations: [],
};

const mergedRelationsSlice = createSlice({
  name: 'mergedRelations',
  initialState,
  reducers: {
    mergeRelations(state, action) {
      const selectedArticles = action.payload; // Get the selected articles from the action payload
      const profilesMap = new Map(); // Create a map to group relations by name

      selectedArticles.forEach(article => { // Iterate over each selected article
        if (article.analyticsData && article.analyticsData.relationExtraction) {
          article.analyticsData.relationExtraction.forEach(relation => { // Iterate over each relation in the article
            const { name, relations: relationDetails } = relation;
            if (!profilesMap.has(name)) {
              profilesMap.set(name, []);
            }

            // Merge relations and include article context (author, newsSource, publishDate)
            relationDetails.forEach(relationDetail => {
              profilesMap.get(name).push({
                ...relationDetail,
                articleId: article.articleId, // Add articleId to each relation
                articleTitle: article.articleTitle, // Add article title
                articleAuthor: article.articleAuthor || article.articleNewsSource, // Add article author or news source
                articlePublishDate: article.articlePublishDate // Add article publish date
              });
            });
          });
        }
      });

      // Convert the map to an array of profile objects with relations and article info
      const profiles = Array.from(profilesMap.entries()).map(([name, relations]) => ({
        name,
        relations,
      }));

      // Update the state with the merged relations
      state.mergedRelations = [{
        profile: profiles,
        status: Array.from(new Set(profiles.flatMap(profile => profile.relations.map(relation => relation.status)))),
        has_person: "true",
      }];
    },
    clearMergedRelations(state) {
      state.mergedRelations = [];
    },
  },
});

export const { mergeRelations, clearMergedRelations } = mergedRelationsSlice.actions;
export default mergedRelationsSlice.reducer;
