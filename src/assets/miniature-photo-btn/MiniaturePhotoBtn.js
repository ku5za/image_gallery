import { IElementCreator } from "../img-gallery/interfaces/IElementCreator.js";

export class MiniaturePhotoButton extends IElementCreator {
  constructor(src, text = ``, alt = `Button's miniature photo`) {
    super();
    if (!src) {
      throw Error(
        `Url attribute not passed to MiniaturePhotoButton constructor`
      );
    }

    this._itsSrc = src;
    this._itsAlt = alt;
    this._itsText = text;
    this._isDisplayed = true;
    this._itsElement;
  }

  get element() {
    if (!this._itsElement) {
      this._itsElement = this.getElement();
    }
    return this._itsElement;
  }

  get isDisplayed() {
    return this._isDisplayed;
  }
  set isDisplayed(isDisplayed) {
    if (typeof isDisplayed != `boolean`) {
      throw new Error(
        `Value passed to "isDisplayed" property must be of type boolean.`
      );
    }

    if (isDisplayed === true) {
      this._itsElement.classList.remove("miniature-photo-btn_display_none");
    } else {
      this._itsElement.classList.add("miniature-photo-btn_display_none");
    }

    this._isDisplayed = isDisplayed;
  }

  getElement() {
    const rootElement = document.createElement(`button`);
    rootElement.classList.add(`miniature-photo-btn`);

    rootElement.innerHTML = `
    <img
      class="miniature-photo-btn__photo"
    />
    <span class="miniature-photo-btn__photo-name">
    </span>
    `;

    const imageElement = rootElement.querySelector(
      `.miniature-photo-btn__photo`
    );
    imageElement.src = this._itsSrc;
    imageElement.alt = this._itsAlt;

    const spanElement = rootElement.querySelector(
      `.miniature-photo-btn__photo-name`
    );
    spanElement.textContent = this._itsText;

    return rootElement;
  }
}
