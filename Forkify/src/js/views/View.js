import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *
   * @param {object | object[]} data
   * @param {boolean} render
   * @returns {undefined | string}
   * @author Mehdi Samardan
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.displayErorMsg();

    this._data = data;
    const html = this._generateMarkUp();

    if (!render) return html;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
  update(data) {
    this._data = data;
    // To convert string to Dom
    const newHtml = this._generateMarkUp();
    const newDOM = document.createRange().createContextualFragment(newHtml);

    // To convert NodeList to Array (find a diffrence)
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEL, index) => {
      const curEL = curElements[index];
      // updates changed !Text
      if (
        !newEL.isEqualNode(curEL) &&
        newEL.firstChild?.nodeValue.trim() !== ''
      ) {
        curEL.textContent = newEL.textContent;
      }

      // updates changed !Attribute
      if (!newEL.isEqualNode(curEL)) {
        Array.from(newEL.attributes).forEach(atr =>
          curEL.setAttribute(atr.name, atr.value)
        );
      }
    });
  }
  renderLoadingSpinner = function () {
    const htmlLoad = `
        <div class="spinner">
          <svg>
             <use href="${icons}#icon-loader"></use>
           </svg>
        </div> -->
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', htmlLoad);
  };
  _clear() {
    this._parentElement.innerHTML = '';
  }

  displayErorMsg(message = this._errorMessage) {
    const htmlDisplayErors = `
      <div class="error">
          <div>
              <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
              <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', htmlDisplayErors);
  }

  displaySuccesMsg(message = this._succesMessage) {
    const htmlDisplaySucces = `
      <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
              <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', htmlDisplaySucces);
  }
}
