import { IImgMiniaturesToFullsizeMatcher } from "./interfaces/IImgMiniaturesToFullsizeMatcher.js";

export class DefaultMiniaturesToFullsizeMatcher extends IImgMiniaturesToFullsizeMatcher {
  constructor() {
    super();
  }

  /**
   * @param {string} miniaturePhotoUri
   */
  getFullsizeImgUri(miniaturePhotoUri) {
    return miniaturePhotoUri.replaceAll(/size_s/gi, `size_l`);
  }
}
