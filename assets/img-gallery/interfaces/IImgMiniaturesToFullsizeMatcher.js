export class IImgMiniaturesToFullsizeMatcher {
  constructor() {
    if (this.constructor === IImgMiniaturesToFullsizeMatcher) {
      throw new Error(`Interfaces can't be instantaited.`);
    }
  }

  getFullsizeImgUri(miniaturePhotoUri) {
    throw new Error(`Mehtod "getFullsizeImgLink" not implemented.`);
  }
}
