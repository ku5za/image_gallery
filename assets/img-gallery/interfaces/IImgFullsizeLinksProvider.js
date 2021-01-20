export class IImgFullsizeLinksProvider {
  constructor() {
    if (this.prototype === IImgFullsizeLinksProvider) {
      throw new Error(`Interfaces can't be instantiated.`);
    }
  }

  getImgFullsizeLinks() {
    throw new Error(`getImgFullsizeLinks() method is not implemented.`);
  }
}
