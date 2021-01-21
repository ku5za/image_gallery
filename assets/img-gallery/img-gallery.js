import { MiniaturePhotoButton } from "../miniature-photo-btn/MiniaturePhotoBtn.js";
import { IElementCreator } from "./interfaces/IElementCreator.js";
import { IImgMiniaturesUriProvider } from "./interfaces/IImgMiniaturesUriProvider.js";
import { IImgMiniaturesToFullsizeMatcher } from "./interfaces/IImgMiniaturesToFullsizeMatcher.js";

export class ImgGallery extends IElementCreator {
  /**
   * @param {IImgMiniaturesUriProvider} IImgMiniaturesUriProvider
   * @param {IImgMiniaturesToFullsizeMatcher} IImgMiniaturesToFullsizeImgMatcher
   */
  constructor(IImgMiniaturesUriProvider, IImgMiniaturesToFullsizeImgMatcher) {
    super();
    this._itsMiniaturesUriProvider = IImgMiniaturesUriProvider;
    this._itsMiniaturesToFullsizeMatcher = IImgMiniaturesToFullsizeImgMatcher;
    this._itsMiniaturesArray = this._getMiniaturesElements();
    this._itsElement = this.getElement();
    this.isDisplayed = false;
    this.currentDisplayedPhotoIndex = 0;
  }

  get element() {
    return this._itsElement;
  }

  get isDisplayed() {
    return this._isDisplayed;
  }

  set isDisplayed(isDisplayed) {
    if (typeof isDisplayed != `boolean`) {
      throw new Error(
        `Value passed to "isDisplayed" property must be of type "boolean".`
      );
    }
    this._changeItsElementDisplay(isDisplayed);

    this._isDisplayed = isDisplayed;
  }

  get currentDisplayedPhotoIndex() {
    return this._currentDisplayedPhotoIndex;
  }

  set currentDisplayedPhotoIndex(index) {
    if (typeof index != `number`) {
      throw new Error(
        `Value passed to "currentDisplaying" property must be of type "number"`
      );
    }
    this._currentDisplayedPhotoIndex = 0;
    if (index > 0 && index < this._itsMiniaturesArray.length) {
      this._currentDisplayedPhotoIndex = index;
    }

    this._unmarkCurrentMarkedMiniature();
    this._markMiniatureOfCurrentDisplayedPhoto();
    this._updateCurrentDisplayedFullsizePhoto();
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
      this._currentDisplayedPhotoIndex
    ];
    this._markMiniatureElementAsCurrentDisplaying(miniatureToMark.element);
  }

  _updateCurrentDisplayedFullsizePhoto() {
    const miniatureToMark = this._itsMiniaturesArray[
      this._currentDisplayedPhotoIndex
    ];
    const fullSizePhotoUri = this._getFullsizePhotoUriFromMiniatureElement(
      miniatureToMark.element
    );
    this._showFullSizePhotoFrom(fullSizePhotoUri);
  }

  getElement() {
    const rootElement = document.createElement(`div`);
    rootElement.classList.add(`img-gallery__overlay`, `flex`, `flex_column`);

    rootElement.innerHTML = `
    <button class="img-gallery__exit-btn exit-btn btn">
      <div class="exit-btn__stripe exit-btn__stripe_first"></div>
      <div class="exit-btn__stripe exit-btn__stripe_second"></div>
    </button>
    <div
    class="img-gallery flex flex_items_aligned_center flex_content_justified_center"
    >
    <button class="btn navigation-btn img-gallery__previous-photo-btn">
      <div class="navigation-btn__stripe-wrapper">
        <div
        class="navigation-btn__stripe navigation-btn__stripe_leaning_forwards"
        ></div>
      </div>
      <div class="navigation-btn__stripe-wrapper">
        <div
        class="navigation-btn__stripe navigation-btn__stripe_leaning_backwards"
        ></div>
      </div>
    </button>
    <div
    class="img-gallery__photos-container flex flex_column flex_items_aligned_center"
    >
    <div class="img-gallery__fullsize-photo-container">
    </div>
    <div
    class="img-gallery__miniatures-photos-container flex flex_wrap flex_content_justified_center"
    >
    </div>
    </div>
    <button class="btn navigation-btn img-gallery__next-photo-btn">
      <div class="navigation-btn__stripe-wrapper">
        <div
        class="navigation-btn__stripe navigation-btn__stripe_leaning_backwards"
        ></div>
      </div>
      <div class="navigation-btn__stripe-wrapper">
        <div
        class="navigation-btn__stripe navigation-btn__stripe_leaning_forwards"
        ></div>
      </div>
    </button>
    `;

    this._appendLoadedPhotos(rootElement);
    this._addRootElementInteractions(rootElement);

    return rootElement;
  }

  _appendLoadedPhotos(rootElement) {
    this._appendMiniaturesToRootElement(rootElement);
    this._appendFullsizePhotoToRootElement(rootElement);
  }

  _addRootElementInteractions(rootElement) {
    this._addExitButtonFunctionality(rootElement);
    this._addNextPhotoButtonFunctionality(rootElement);
    this._addPreviousPhotoButtonFunctionality(rootElement);
  }

  _appendMiniaturesToRootElement(rootElement) {
    const miniaturesPhotosContainer = rootElement.querySelector(
      `.img-gallery__miniatures-photos-container`
    );

    this._itsMiniaturesArray.forEach((miniaturePhoto, itsIndex) => {
      this._addMiniaturePhotoButtonFunctionality(
        miniaturePhoto.element,
        itsIndex
      );
      miniaturesPhotosContainer.appendChild(miniaturePhoto.element);
    });
  }

  _appendFullsizePhotoToRootElement(rootElement) {
    const fullSizePhotoContainer = rootElement.querySelector(
      `.img-gallery__fullsize-photo-container`
    );
    const fullSizePhotoElement = this._getFullSizePhotoElement();
    fullSizePhotoContainer.appendChild(fullSizePhotoElement);
  }

  _addExitButtonFunctionality(rootElement) {
    const exitButton = rootElement.querySelector(`.img-gallery__exit-btn`);
    exitButton.addEventListener(`click`, () => {
      this.isDisplayed = false;
    });
  }

  _addPreviousPhotoButtonFunctionality(rootElement) {
    const previousPhotoButton = rootElement.querySelector(
      `.img-gallery__previous-photo-btn`
    );
    previousPhotoButton.addEventListener(`click`, () => {
      if (this.currentDisplayedPhotoIndex > 0) {
        this.currentDisplayedPhotoIndex--;
      }
    });
  }

  _addNextPhotoButtonFunctionality(rootElement) {
    const nextPhotoButton = rootElement.querySelector(
      `.img-gallery__next-photo-btn`
    );
    nextPhotoButton.addEventListener(`click`, () => {
      const maxIndex = this._itsMiniaturesArray.length - 1;
      if (this.currentDisplayedPhotoIndex < maxIndex) {
        this.currentDisplayedPhotoIndex++;
      }
    });
  }

  _addMiniaturePhotoButtonFunctionality(miniaturePhotoButtonElement, itsIndex) {
    miniaturePhotoButtonElement.addEventListener(`click`, () => {
      this.currentDisplayedPhotoIndex = itsIndex;
    });
  }

  _getFullSizePhotoElement(fullsizePhotoURL, alt = `Gallery photo`) {
    const fullSizePhotoElement = document.createElement(`img`);
    fullSizePhotoElement.classList.add(`img-gallery__fullsize-photo`);
    fullSizePhotoElement.src = fullsizePhotoURL;
    fullSizePhotoElement.alt = alt;

    return fullSizePhotoElement;
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

  _changeItsElementDisplay(isDisplayed) {
    if (isDisplayed === true) {
      this._itsElement.classList.remove("img-gallery__overlay_displayed_none");
    } else {
      this._itsElement.classList.add("img-gallery__overlay_displayed_none");
    }
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

  _getFullsizePhotoUriFromMiniatureElement(miniatureButtonElement) {
    const miniaturePhotoElement = miniatureButtonElement.querySelector(
      `.miniature-photo-btn__photo`
    );
    const miniaturePhotoUri = miniaturePhotoElement.src;
    return this._itsMiniaturesToFullsizeMatcher.getFullsizeImgUri(
      miniaturePhotoUri
    );
  }

  _showFullSizePhotoFrom(
    fullSizePhotoSrc,
    fullSizePhotoAlt = `Gallery fullsize photo.`
  ) {
    const fullSizePhotoElement = this._itsElement.querySelector(
      `.img-gallery__fullsize-photo`
    );
    fullSizePhotoElement.src = fullSizePhotoSrc;
    fullSizePhotoElement.alt = fullSizePhotoAlt;
  }
}
