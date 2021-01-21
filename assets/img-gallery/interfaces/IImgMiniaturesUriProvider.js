export class IImgMiniaturesUriProvider {
  constructor() {
    if (this.constructor === IImgMiniaturesUriProvider) {
      throw new Error(`Interfaces can't be instantiated.`);
    }
  }

  getImgMiniaturesUri() {
    throw new Error(`getImgMiniaturesLinks() method is not implemented.`);
  }
}
