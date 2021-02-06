import { IImgMiniaturesUriProvider } from "./interfaces/IImgMiniaturesUriProvider.js";

export class DefaultMiniaturesUriProvider extends IImgMiniaturesUriProvider {
  constructor(...miniaturesLinks) {
    super();
    this._miniaturesLinks = miniaturesLinks || [];
  }

  getImgMiniaturesUri() {
    return this._miniaturesLinks;
  }
}
