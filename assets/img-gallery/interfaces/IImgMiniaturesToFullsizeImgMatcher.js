export class IImgMiniaturesToFullsizeImgMatcher {
  constructor() {
    if (this.constructor === IImgMiniaturesToFullsizeImgMatcher) {
      throw new Error(`Interfaces can't be instantaited.`);
    }
  }

  getFullsizeImgLink(miniaturePhotoLink) {
    throw new Error(`Mehtod "getFullsizeImgLink" not implemented.`);
  }
}
