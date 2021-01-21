import { MiniaturePhotoButton } from "../miniature-photo-btn/MiniaturePhotoBtn.js";
import { IElementCreator } from "./interfaces/IElementCreator.js";
import { IImgMiniaturesUriProvider } from "./interfaces/IImgMiniaturesUriProvider.js";
import { IImgMiniaturesToFullsizeMatcher } from "./interfaces/IImgMiniaturesToFullsizeMatcher.js";
import { MiniaturesPhotosContainer } from "./__miniatures-photos-container/MiniaturesPhotosContainer.js";

export class ImgGallery extends IElementCreator {
  /**
   * @param {IImgMiniaturesUriProvider} IImgMiniaturesUriProvider
   * @param {IImgMiniaturesToFullsizeMatcher} IImgMiniaturesToFullsizeImgMatcher
   */
  constructor(IImgMiniaturesUriProvider, IImgMiniaturesToFullsizeImgMatcher) {
    super();
    this._itsMiniaturesUriProvider = IImgMiniaturesUriProvider;
    this._itsMiniaturesToFullsizeMatcher = IImgMiniaturesToFullsizeImgMatcher;

    this._itsElement = this.getElement();

    const miniaturesContainerElement = this._itsElement.querySelector(
      `.img-gallery__miniatures-photos-container`
    );
    this._itsMiniaturesContainer = new MiniaturesPhotosContainer(
      miniaturesContainerElement,
      IImgMiniaturesUriProvider
    );
    this._itsMiniaturesContainer.addEventListener(
      `markedMiniatureChanged`,
      () => this._updateCurrentDisplayedFullsizePhoto()
    );

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
      throw new TypeError(
        `Value passed to "isDisplayed" property must be of type "boolean".`
      );
    }
    this._changeItsElementDisplay(isDisplayed);

    this._isDisplayed = isDisplayed;
  }

  get currentDisplayedPhotoIndex() {
    return this._itsMiniaturesContainer.currentDisplayedPhotoIndex;
  }

  set currentDisplayedPhotoIndex(index) {
    if (typeof index != `number`) {
      throw new TypeError(
        `Value passed to "currentDisplaying" property must be of type "number"`
      );
    }

    this._itsMiniaturesContainer.currentDisplayedPhotoIndex = 0;
    if (
      index > 0 &&
      index < this._itsMiniaturesContainer.miniaturesArray.length
    ) {
      this._itsMiniaturesContainer.currentDisplayedPhotoIndex = index;
    }
  }

  _updateCurrentDisplayedFullsizePhoto() {
    const currentMarkedMiniature = this._itsMiniaturesContainer.miniaturesArray[
      this._itsMiniaturesContainer.currentDisplayedPhotoIndex
    ];
    const fullSizePhotoUri = this._getFullsizePhotoUriFromMiniatureElement(
      currentMarkedMiniature.element
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

    this._appendFullsizePhotoToRootElement(rootElement);
    this._addRootElementInteractions(rootElement);

    return rootElement;
  }

  _addRootElementInteractions(rootElement) {
    this._addExitButtonFunctionality(rootElement);
    this._addNextPhotoButtonFunctionality(rootElement);
    this._addPreviousPhotoButtonFunctionality(rootElement);
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
      const maxIndex = this._itsMiniaturesContainer.miniaturesArray.length - 1;
      if (this.currentDisplayedPhotoIndex < maxIndex) {
        this.currentDisplayedPhotoIndex++;
      }
    });
  }

  _getFullSizePhotoElement(fullsizePhotoURL, alt = `Gallery photo`) {
    const fullSizePhotoElement = document.createElement(`img`);
    fullSizePhotoElement.classList.add(`img-gallery__fullsize-photo`);
    fullSizePhotoElement.src = fullsizePhotoURL;
    fullSizePhotoElement.alt = alt;

    return fullSizePhotoElement;
  }

  _changeItsElementDisplay(isDisplayed) {
    if (isDisplayed === true) {
      this._itsElement.classList.remove("img-gallery__overlay_displayed_none");
    } else {
      this._itsElement.classList.add("img-gallery__overlay_displayed_none");
    }
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
    fullSizePhotoUri,
    fullSizePhotoAlt = `Gallery fullsize photo.`
  ) {
    const fullSizePhotoElement = this._itsElement.querySelector(
      `.img-gallery__fullsize-photo`
    );
    fullSizePhotoElement.src = fullSizePhotoUri;
    fullSizePhotoElement.alt = fullSizePhotoAlt;
  }
}
