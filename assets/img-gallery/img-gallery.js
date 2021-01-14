import { IElementCreator } from "./interfaces/IElementCreator.js";

export class ImgGallery extends IElementCreator {
  constructor(IImgMiniaturesLinksProvider, IImgMiniaturesToFullsizeImgMatcher) {
    super();
    this._ImgMiniaturesLinksProvider = IImgMiniaturesLinksProvider;
    this._ImgMiniaturesToFullsizeImgMatcher = IImgMiniaturesToFullsizeImgMatcher;
    this._itsFullSizesArray = [];
    this._itsMiniaturesArray = [];
    this._itsElement = this.getElement();
    this.isDisplayed = false;
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
        `Value passed to "isDisplayed" property must be of tyle "boolean".`
      );
    }
    if (isDisplayed === true) {
      this._itsElement.classList.remove("img-gallery__overlay_displayed_none");
    } else {
      this._itsElement.classList.add("img-gallery__overlay_displayed_none");
    }

    this._isDisplayed = isDisplayed;
  }

  getElement() {
    const imgGalleryWrapper = document.createElement(`div`);
    imgGalleryWrapper.classList.add(
      `img-gallery__overlay`,
      `flex`,
      `flex_column`
    );

    imgGalleryWrapper.innerHTML = `
    <button class="img-gallery__exit-btn exit-btn btn">
      <div class="exit-btn__stripe exit-btn__stripe_first"></div>
      <div class="exit-btn__stripe exit-btn__stripe_second"></div>
    </button>
    <div
      class="img-gallery flex flex_items_aligned_center flex_content_justified_center"
    >
      <button class="btn navigation-btn">
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
    <button class="btn navigation-btn">
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

    const exitButton = imgGalleryWrapper.querySelector(
      `.img-gallery__exit-btn`
    );
    const fullSizePhotoContainer = imgGalleryWrapper.querySelector(
      `.img-gallery__fullsize-photo-container`
    );
    const fullSizePhotoElement = this._getFullSizePhotoElement(
      `assets/images_db/size_l/size_l_photo2.jpg`,
      `First loaded photo.`
    );
    const miniaturesPhotosContainer = imgGalleryWrapper.querySelector(
      `.img-gallery__miniatures-photos-container`
    );
    const miniaturePhotoElement = this._getMiniaturePhotoElement(
      `assets/images_db/size_s/size_s_photo2.jpg`
    );

    this._addExitButtonFunctionality(exitButton);
    fullSizePhotoContainer.appendChild(fullSizePhotoElement);
    miniaturesPhotosContainer.appendChild(miniaturePhotoElement);

    return imgGalleryWrapper;
  }

  _addExitButtonFunctionality(exitButtonElement) {
    exitButtonElement.addEventListener(`click`, () => {
      this.isDisplayed = false;
    });
  }

  _getFullSizePhotoElement(fullsizePhotoURL, alt = `Gallery photo`) {
    const fullSizePhotoElement = document.createElement(`img`);
    fullSizePhotoElement.classList.add(`img-gallery__fullsize-photo`);
    fullSizePhotoElement.src = fullsizePhotoURL;
    fullSizePhotoElement.alt = alt;

    return fullSizePhotoElement;
  }

  _getMiniaturePhotoElement(
    miniaturePhotoURL,
    alt = `Miniature of gallery photo`
  ) {
    const miniaturePhotoElement = document.createElement(`button`);
    miniaturePhotoElement.classList.add(`img-gallery__miniature-photo-btn`);

    miniaturePhotoElement.innerHTML = `
    <img
      class="img-gallery__miniature-photo"
    />
    <span class="img-gallery__miniature-photo-name">
      size_s_photo1.jpg
    </span>
    `;

    const imageElement = miniaturePhotoElement.querySelector(
      `.img-gallery__miniature-photo`
    );
    imageElement.src = miniaturePhotoURL;
    imageElement.alt = alt;

    return miniaturePhotoElement;
  }
}
