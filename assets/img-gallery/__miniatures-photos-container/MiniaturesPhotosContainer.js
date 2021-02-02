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
    this._firstDisplayedPhotoIndex = 0;
    this._lastHiddenPhotoIndex = -1;
  }

  get miniaturesArray() {
    return [...this._itsMiniaturesArray];
  }

  get currentDisplayedPhotoIndex() {
    return this._currentDisplayedMiniatureIndex;
  }

  set currentDisplayedPhotoIndex(newIndex) {
    this._throwErrorIfIsntNumber(newIndex);

    if (newIndex >= 0 && newIndex < this._itsMiniaturesArray.length) {
      let indexOfMiniatureInTheMiddle = this._getIndexOfMiniatureInTheMiddle();
      if (newIndex > this._currentDisplayedMiniatureIndex) {
        if (newIndex > indexOfMiniatureInTheMiddle) {
          this._hideNextMiniatureIfNecessary();
        }
      }
      if (newIndex < this._currentDisplayedMiniatureIndex) {
        if (newIndex < indexOfMiniatureInTheMiddle) {
          this._showNextMiniatureIfAnyLeftHidden();
        }
      }
      this._currentDisplayedMiniatureIndex = newIndex;
    }
    this.dispatchEvent(new Event(`markedMiniatureChanged`));

    this._unmarkCurrentMarkedMiniature();
    this._markMiniatureOfCurrentDisplayedPhoto();
  }

  _getIndexOfMiniatureInTheMiddle() {
    return Math.floor(
      this._firstDisplayedPhotoIndex +
        this._countHowManyMiniaturesMayFitIn() / 2
    );
  }

  _hideNextMiniatureIfNecessary() {
    if (!this._isLastMiniatureShown()) {
      const miniatureToHide = this._itsMiniaturesArray[
        this._firstDisplayedPhotoIndex
      ];
      this._hideMiniature(miniatureToHide);
      this._firstDisplayedPhotoIndex++;
      this._lastHiddenPhotoIndex++;
    }
  }

  _isLastMiniatureShown() {
    return (
      this._indexOfLastDisplayedMiniature() ==
      this._itsMiniaturesArray.length - 1
    );
  }

  _indexOfLastDisplayedMiniature() {
    return (
      this._firstDisplayedPhotoIndex +
      this._countHowManyMiniaturesMayFitIn() -
      1
    );
  }

  _showNextMiniatureIfAnyLeftHidden() {
    if (this._lastHiddenPhotoIndex >= 0) {
      const miniatureToShow = this._itsMiniaturesArray[
        this._lastHiddenPhotoIndex
      ];
      this._showMiniature(miniatureToShow);
      this._lastHiddenPhotoIndex--;
      this._firstDisplayedPhotoIndex--;
    }
  }

  _throwErrorIfIsntNumber(index) {
    if (typeof index != `number`) {
      throw new TypeError(
        `Value passed to "currentDisplaying" property must be of type "number".`
      );
    }
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
        `Second value passed to "MiniaturesPhotosContainer" must be instance of IImgMiniaturesUriProvider.`
      );
    }
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

  /**
   * @param {string} miniatureUri
   */
  _getMiniatureFileName(miniatureUri) {
    const nameSubstringStartIndex = miniatureUri.lastIndexOf("/") + 1;
    return miniatureUri.substring(nameSubstringStartIndex);
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

  _getDisplayedMiniatures() {
    const displayedMiniatures = this._itsMiniaturesArray.filter((miniature) => {
      if (
        miniature.element.classList.contains(`miniature-photo-btn_display_none`)
      ) {
        return;
      }
      return miniature.element;
    });
    return displayedMiniatures;
  }

  _countHowManyMiniaturesMayFitIn() {
    const displayedMiniatures = this._getDisplayedMiniatures();
    let amountOfMiniaturesThatMayFitIn = 0;
    let sumOfDisplayedMiniaturesWidths =
      displayedMiniatures[amountOfMiniaturesThatMayFitIn].element.offsetWidth;

    while (
      sumOfDisplayedMiniaturesWidths <= this._itsElement.clientWidth &&
      amountOfMiniaturesThatMayFitIn < displayedMiniatures.length
    ) {
      amountOfMiniaturesThatMayFitIn++;
      if (amountOfMiniaturesThatMayFitIn < displayedMiniatures.length) {
        sumOfDisplayedMiniaturesWidths +=
          displayedMiniatures[amountOfMiniaturesThatMayFitIn].element
            .offsetWidth;
      }
    }
    return amountOfMiniaturesThatMayFitIn;
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

  _showMiniature(miniatureElement) {
    miniatureElement.element.classList.remove(
      `miniature-photo-btn_display_none`
    );
  }

  _hideMiniature(miniatureElement) {
    miniatureElement.element.classList.add(`miniature-photo-btn_display_none`);
  }
}
