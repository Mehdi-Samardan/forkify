class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    return this._parentElement.querySelector('.search__field').value;
  }

  _clearInputSearch() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
      this._clearInputSearch();
    });
  }
}

export default new SearchView();

// const recipeContainer = document.querySelector('.recipe');
