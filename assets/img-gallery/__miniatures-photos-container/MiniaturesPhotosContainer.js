import { MiniaturePhotoButton } from "../../miniature-photo-btn/MiniaturePhotoBtn.js";
import { IImgMiniaturesUriProvider } from "../interfaces/IImgMiniaturesUriProvider.js";

export class MiniaturesPhotosContainer extends EventTarget {
  constructor(hmtlElement, miniaturesUriProvider) {
    super();
    this._throwErrorIfIsntHtmlElement(hmtlElement);
    this._throwErrorIfIsntIImgMiniaturesUriProvider(miniaturesUriProvider);

    this._itsElement = hmtlElement;
    this._itsMiniaturesUriProvider = miniaturesUriProvider;
    this._itsMiniaturesArray = this._getMiniaturesElements();
    this._appendMiniaturesToHtmlElement();
    this.currentDisplayedPhotoIndex = 0;
    // this._markedMiniatureChangedEvent = ;
  }

  get miniaturesArray() {
    return [...this._itsMiniaturesArray];
  }

  get currentDisplayedPhotoIndex() {
    return this._currentDisplayedPhotoIndex;
  }

  set currentDisplayedPhotoIndex(index) {
    this._throwErrorIfIsntNumber(index);

    this._currentDisplayedPhotoIndex = 0;
    if (index > 0 && index < this._itsMiniaturesArray.length) {
      this._currentDisplayedPhotoIndex = index;
    }
    this.dispatchEvent(new Event(`markedMiniatureChanged`));

    this._unmarkCurrentMarkedMiniature();
    this._markMiniatureOfCurrentDisplayedPhoto();
  }

  _unmarkCurrentMarkedMiniature() {
    const currentMarkedMiniature = this._itsElement.querySelector(
      `.miniature-photo-btn_mark_current`
    );
    if (currentMarkedMiniature) {
      this._removeMiniatureElementCurrentDisplayingMark(currentMarkedMiniature);
    }
  }

  _markMiniatureOfCurrentDisplayedPhoto() {
    const miniatureToMark = this._itsMiniaturesArray[
      this.currentDisplayedPhotoIndex
    ];
    this._markMiniatureElementAsCurrentDisplaying(miniatureToMark.element);
  }

  _getMiniaturesElements() {
    let miniaturesElements = [];
    const miniaturesUri = this._itsMiniaturesUriProvider.getImgMiniaturesUri();
    for (const miniatureUri of miniaturesUri) {
      const miniatureFileName = this._getMiniatureFileName(miniatureUri);
      miniaturesElements.push(
        new MiniaturePhotoButton(miniatureUri, miniatureFileName)
      );
    }
    return miniaturesElements;
  }

  _appendMiniaturesToHtmlElement() {
    this._itsMiniaturesArray.forEach((miniaturePhoto, itsIndex) => {
      this._addMiniaturePhotoButtonFunctionality(
        miniaturePhoto.element,
        itsIndex
      );
      this._itsElement.appendChild(miniaturePhoto.element);
    });
  }

  _addMiniaturePhotoButtonFunctionality(miniaturePhotoButtonElement, itsIndex) {
    miniaturePhotoButtonElement.addEventListener(`click`, () => {
      this.currentDisplayedPhotoIndex = itsIndex;
    });
  }

  _markMiniatureElementAsCurrentDisplaying(miniaturePhotoButtonElement) {
    miniaturePhotoButtonElement.classList.add(
      `miniature-photo-btn_mark_current`
    );
  }

  _removeMiniatureElementCurrentDisplayingMark(miniaturePhotoButtonElement) {
    miniaturePhotoButtonElement.classList.remove(
      `miniature-photo-btn_mark_current`
    );
  }

  /**
   * @param {string} miniatureUri
   */
  _getMiniatureFileName(miniatureUri) {
    const nameSubstringStartIndex = miniatureUri.lastIndexOf("/") + 1;
    return miniatureUri.substring(nameSubstringStartIndex);
  }

  _throwErrorIfIsntHtmlElement(hmtlElement) {
    if (!(hmtlElement instanceof HTMLElement)) {
      throw new TypeError(
        `First value passed to "MiniaturesPhotosContainer" must be instance of HTMLElement.`
      );
    }
  }

  _throwErrorIfIsntIImgMiniaturesUriProvider(miniaturesUriProvider) {
    if (!(miniaturesUriProvider instanceof IImgMiniaturesUriProvider)) {
      throw new TypeError(
        `Second value passed to "MiniaturesPhotosContainer" must be instance of IImgMiniaturesUriProvider`
      );
    }
  }

  _throwErrorIfIsntNumber(index) {
    if (typeof index != `number`) {
      throw new TypeError(
        `Value passed to "currentDisplaying" property must be of type "number"`
      );
    }
  }
}
