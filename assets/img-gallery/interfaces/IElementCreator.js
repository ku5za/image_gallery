export class IElementCreator {
  constructor() {
    if (this.constructor == IElementCreator) {
      throw new Error(`Interfaces can't be instantiated.`);
    }
  }

  getElement() {
    throw new Error(`Method "getElement()" not implemented.`);
  }
}
