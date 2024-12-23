import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _succesMessage = 'The recipe was successfully uploaded.';

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  constructor() {
    // To use this keywoord correctly
    super();

    // call immediately
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHanadlerUploadRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // Making new data array via FormData
      const dataArr = [...new FormData(this)];

      // To make from entries a new object
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  _generateMarkUp() {}
}

export default new AddRecipeView();
