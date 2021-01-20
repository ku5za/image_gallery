import { MiniaturePhotoButton } from "../miniature-photo-btn/MiniaturePhotoBtn.js";
import { IElementCreator } from "./interfaces/IElementCreator.js";
import { IImgMiniaturesLinksProvider } from "./interfaces/IImgMiniaturesLinksProvider.js";
import { IImgMiniaturesToFullsizeImgMatcher } from "./interfaces/IImgMiniaturesToFullsizeImgMatcher.js";

export class ImgGallery extends IElementCreator {
  /**
   * @param {IImgMiniaturesLinksProvider} IImgMiniaturesLinksProvider
   * @param {IImgMiniaturesToFullsizeImgMatcher} IImgMiniaturesToFullsizeImgMatcher
   */
  constructor(IImgMiniaturesLinksProvider, IImgMiniaturesToFullsizeImgMatcher) {
    super();
    this._itsMiniaturesLinksProvider = IImgMiniaturesLinksProvider;
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
    if (isDisplayed === true) {
      this._itsElement.classList.remove("img-gallery__overlay_displayed_none");
    } else {
      this._itsElement.classList.add("img-gallery__overlay_displayed_none");
    }

    this._isDisplayed = isDisplayed;
  }

  get currentDisplayedPhotoIndex() {
    return this._currentDisplayedPhotoIndex;
  }

  set currentDisplayedPhotoIndex(index) {
    if (typeof index != `number`) {
      throw new Error(`Value passed to "currentDisplaying"`);
    }
    let currentDisplayedPhotoIndex = 0;
    if (index > 0 && index < this._itsMiniaturesArray.length) {
      currentDisplayedPhotoIndex = index;
    }

    const currentMarkedMiniature = this._itsElement.querySelector(
      `.miniature-photo-btn_mark_current`
    );
    if (currentMarkedMiniature) {
      this._removeMiniatureElementCurrentDisplayingMark(currentMarkedMiniature);
    }

    const miniatureToMark = this._itsMiniaturesArray[
      currentDisplayedPhotoIndex
    ];
    this._markMiniatureElementAsCurrentDisplaying(miniatureToMark.element);
    const fullSizePhotoLink = this._getFullsizePhotoSrcFromMiniatureElement(
      miniatureToMark.element
    );
    this._showFullSizePhotoFrom(fullSizePhotoLink);

    this._currentDisplayedPhotoIndex = currentDisplayedPhotoIndex;
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

    const exitButton = rootElement.querySelector(`.img-gallery__exit-btn`);
    const fullSizePhotoContainer = rootElement.querySelector(
      `.img-gallery__fullsize-photo-container`
    );
    const fullSizePhotoElement = this._getFullSizePhotoElement();
    const miniaturesPhotosContainer = rootElement.querySelector(
      `.img-gallery__miniatures-photos-container`
    );
    const previousPhotoButton = rootElement.querySelector(
      `.img-gallery__previous-photo-btn`
    );
    const nextPhotoButton = rootElement.querySelector(
      `.img-gallery__next-photo-btn`
    );

    this._addNextPhotoButtonFunctionality(nextPhotoButton);
    this._addPreviousPhotoButtonFunctionality(previousPhotoButton);

    this._itsMiniaturesArray.forEach((miniaturePhoto, itsIndex) => {
      this._addMiniaturePhotoButtonFunctionality(
        miniaturePhoto.element,
        itsIndex
      );
      miniaturesPhotosContainer.appendChild(miniaturePhoto.element);
    });

    this._addExitButtonFunctionality(exitButton);
    fullSizePhotoContainer.appendChild(fullSizePhotoElement);

    return rootElement;
  }

  _addExitButtonFunctionality(exitButtonElement) {
    exitButtonElement.addEventListener(`click`, () => {
      this.isDisplayed = false;
    });
  }

  _addPreviousPhotoButtonFunctionality(previousButton) {
    previousButton.addEventListener(`click`, () => {
      if (this.currentDisplayedPhotoIndex > 0) {
        this.currentDisplayedPhotoIndex--;
      }
    });
  }
  _addNextPhotoButtonFunctionality(nextButton) {
    nextButton.addEventListener(`click`, () => {
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
    const miniaturesLinks = this._itsMiniaturesLinksProvider.getImgMiniaturesLinks();
    for (const miniatureLink of miniaturesLinks) {
      const miniatureFileName = this._getMiniatureFileName(miniatureLink);
      miniaturesElements.push(
        new MiniaturePhotoButton(miniatureLink, miniatureFileName)
      );
    }
    return miniaturesElements;
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
   * @param {string} miniatureLink
   */
  _getMiniatureFileName(miniatureLink) {
    const nameSubstringStartIndex = miniatureLink.lastIndexOf("/") + 1;
    return miniatureLink.substring(nameSubstringStartIndex);
  }

  _getFullsizePhotoSrcFromMiniatureElement(miniatureButtonElement) {
    const miniaturePhotoElement = miniatureButtonElement.querySelector(
      `.miniature-photo-btn__photo`
    );
    const miniaturePhotoSrc = miniaturePhotoElement.src;
    return this._itsMiniaturesToFullsizeMatcher.getFullsizeImgLink(
      miniaturePhotoSrc
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
