class IImgMiniaturesLinksProvider {
  constructor() {
    if (this.constructor === IImgMiniaturesLinksProvider) {
      throw new Error(`Interfaces can't be instantiated.`);
    }
  }

  getImgMiniaturesLinks() {
    throw new Error(`getImgMiniaturesLinks() method is not implemented.`);
  }
}
