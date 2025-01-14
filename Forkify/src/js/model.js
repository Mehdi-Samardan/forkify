import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
import { RES_PER_PAGE } from './config.js';
import { API_KEY } from './config.js';

export const state = {
  bookmarks: [],
  recipe: {},
  search: {
    querry: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
};

const createObjectRecipe = function (data) {
  const recipe = data.data.recipe;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // Conditionally add property to OBJ
  };
};

// Loading result to recipeContainer
export const loadingRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createObjectRecipe(data);

    if (state.bookmarks.some(bookmark => bookmark.id == id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(error + '🛩️');
    throw error;
  }
};

//Getting all of recipeis via API
export const loadSearchResults = async function (querry) {
  try {
    state.search.querry = querry;
    const data = await getJSON(`${API_URL}?search=${querry}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    console.error(error + '🛩️');
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; //0
  const end = page * state.search.resultsPerPage; //9

  return state.search.results.slice(start, end);
};
// Updating servings
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(element => {
    element.quantity = (element.quantity / state.recipe.servings) * newServings;
    console.log();
  });
  state.recipe.servings = newServings;
};

const localingBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add to bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Add to LocalStorage
  localingBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete from bookmark
  const index = state.bookmarks.findIndex(el => el.id == id);
  state.bookmarks.splice(index, 1);

  // Mark as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Add to LocalStorage
  localingBookmarks();
};

const init = function () {
  const storageBookmark = localStorage.getItem('bookmarks');
  if (storageBookmark) state.bookmarks = JSON.parse(storageBookmark);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Please try again :)');

        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // console.log(ingredients);
    const uploadRecipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${API_KEY}`, uploadRecipe);
    console.log(data);
    state.recipe = createObjectRecipe(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
