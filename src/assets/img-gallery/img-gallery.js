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
    this._itsMiniaturesContainer.currentDisplayedPhotoIndex = 0;
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
    class="img-gallery flex flex_items_aligned_center flex_content_justified_center flex_column_md"
    >
    <button class="btn navigation-btn img-gallery__previous-photo-btn img-gallery__navigation-btn_hide_md">
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
    <div class="img-gallery__fullsize-photo-container flex flex-column flex-items_aligned_center">
    </div>
    <div
    class="img-gallery__miniatures-photos-container flex flex_wrap flex_content_justified_center"
    >
    </div>
    </div>
    <div class="img-gallery__md-navigation-btns flex flex_content_justified_center flex_items_aligned_center">
    <button class="btn navigation-btn img-gallery__previous-photo-btn img-gallery__navigation-btn_display_md">
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
    </div>
    `;

    this._appendFullsizePhotoToRootElement(rootElement);
    this._addRootElementInteractions(rootElement);

    return rootElement;
  }

  _addRootElementInteractions(rootElement) {
    this._addExitButtonFunctionality(rootElement);
    this._addNextPhotoButtonFunctionality(rootElement);
    this._addPreviousPhotoButtonsFunctionality(rootElement);
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

  _addPreviousPhotoButtonsFunctionality(rootElement) {
    const previousPhotoButtons = rootElement.querySelectorAll(
      `.img-gallery__previous-photo-btn`
    );
    previousPhotoButtons.forEach((button) => {
      button.addEventListener(`click`, () => {
        if (this._itsMiniaturesContainer.currentDisplayedPhotoIndex > 0) {
          this._itsMiniaturesContainer.currentDisplayedPhotoIndex--;
        }
      });
    });
  }

  _addNextPhotoButtonFunctionality(rootElement) {
    const nextPhotoButton = rootElement.querySelector(
      `.img-gallery__next-photo-btn`
    );
    nextPhotoButton.addEventListener(`click`, () => {
      const maxIndex = this._itsMiniaturesContainer.miniaturesArray.length - 1;
      if (this._itsMiniaturesContainer.currentDisplayedPhotoIndex < maxIndex) {
        this._itsMiniaturesContainer.currentDisplayedPhotoIndex++;
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
      document.body.classList.add("body_hide_overflow");
    } else {
      this._itsElement.classList.add("img-gallery__overlay_displayed_none");
      document.body.classList.remove("body_hide_overflow");
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
