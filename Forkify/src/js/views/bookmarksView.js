import View from './View.js';
import previewView from './previewView.js';

class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'Not bookmarks yet. Find a nice recipe and bookmark it :)';
  _succesMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkUp() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new BookMarksView();
