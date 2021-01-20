import { IImgMiniaturesLinksProvider } from "./interfaces/IImgMiniaturesLinksProvider.js";

export class DefaultMiniaturesLinksProvider extends IImgMiniaturesLinksProvider {
  constructor(...miniaturesLinks) {
    super();
    this._miniaturesLinks = miniaturesLinks || [];
  }

  getImgMiniaturesLinks() {
    return this._miniaturesLinks;
  }
}
