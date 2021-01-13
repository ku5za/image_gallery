class ImgGallery {
  constructor(IImgMiniaturesLinksProvider, IImgMiniaturesToFullsizeImgMatcher) {
    this._ImgMiniaturesLinksProvider = IImgMiniaturesLinksProvider;
    this._ImgMiniaturesToFullsizeImgMatcher = IImgMiniaturesToFullsizeImgMatcher;
  }

  createImgGalleryElement() {
    const imgGalleryWrapper = document.createElement(`div`);
    imgGalleryWrapper.classList.add(`img-gallery__overlay`);

    imgGalleryWrapper.innerHTML = `
      <div class="img-gallery">
        <button class="btn btn_bold-text img-gallery__btn img-gallery__btn_previous-photo"></button>
        <div class="img-gallery__photos-container">
          <div class="img-gallery__fullsize-photo-container"></div>
          <div class="img-gallery__minatures-photos-container"></div>
        </div>
        <button class="btn btn_bold-text img-gallery__btn img-gallery__btn_next-photo"></button>
      </div>
    `;
  }
}
