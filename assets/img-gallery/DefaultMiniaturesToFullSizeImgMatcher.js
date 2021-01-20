import { IImgMiniaturesToFullsizeImgMatcher } from "./interfaces/IImgMiniaturesToFullsizeImgMatcher.js";

export class DefaultMiniaturesToFullSizeImgMatcher extends IImgMiniaturesToFullsizeImgMatcher {
  constructor() {
    super();
  }

  /**
   * @param {string} miniaturePhotoLink
   */
  getFullsizeImgLink(miniaturePhotoLink) {
    return miniaturePhotoLink.replaceAll(/size_s/gi, `size_l`);
  }
}
