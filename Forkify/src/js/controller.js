import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/pagination.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Update results to mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Loading Spinner
    recipeView.renderLoadingSpinner();

    // Loading Recipe
    await model.loadingRecipe(id);

    // Rendering Recipe
    recipeView.render(model.state.recipe);

    // Update bookmarked recipes
    bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    recipeView.displayErorMsg();
    console.error(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderLoadingSpinner();

    // 1) Searching querry
    const query = searchView.getQuery();
    if (!query) return; // Guard!

    // 2) Load search Results
    await model.loadSearchResults(query);

    // 3) Renderig results and pagination
    console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (dataGoTo) {
  resultsView.render(model.getSearchResultsPage(dataGoTo));
  paginationView.render(model.state.search);
};

const controlerServings = function (newServings) {
  // Update the recipe servings (state)
  model.updateServings(newServings);
  // Update the recipe View with new information
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddAndDeleteBookmark = function () {
  // add/remove bookmark via bookmarked = true ? false
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe.id);

  // Update recipeView
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner to user
    addRecipeView.renderLoadingSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render Recipe tot View
    recipeView.render(model.state.recipe);

    // Succes message
    addRecipeView.displaySuccesMsg();

    // Re-Render bookmarkView
    bookmarksView.render(model.state.bookmarks);

    // Changhe ID in URL with history API
    window.history.pushState(null, null, `#${model.state.recipe.id}`);

    // Close upload Window after (after a certain period of time)
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error + '🦁');
    addRecipeView.displayErorMsg(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlerServings);
  recipeView.addHandlerAddBookmark(controlAddAndDeleteBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHanadlerUploadRecipe(controlAddRecipe);
};

init();
