import { DefaultMiniaturesUriProvider } from "./img-gallery/DefaultMiniaturesUriProvider.js";
import { DefaultMiniaturesToFullsizeMatcher } from "./img-gallery/DefaultMiniaturesToFullsizeMatcher.js";
import { ImgGallery } from "./img-gallery/img-gallery.js";
(() => {
  let imgGallery;

  const openGalleryButton = document.querySelector(`.btn__open-gallery`);
  openGalleryButton.addEventListener(`click`, () => {
    if (isImgGalleryAddedToDom() == false) {
      const miniaturesLinks = [
        "../images_db/size_s/size_s_photo1.jpg",
        "../images_db/size_s/size_s_photo2.jpg",
        "../images_db/size_s/size_s_photo3.jpg",
        "../images_db/size_s/size_s_photo4.jpg",
        "../images_db/size_s/size_s_photo1.jpg",
        "../images_db/size_s/size_s_photo2.jpg",
        "../images_db/size_s/size_s_photo3.jpg",
        "../images_db/size_s/size_s_photo4.jpg",
        "../images_db/size_s/size_s_photo1.jpg",
        "../images_db/size_s/size_s_photo2.jpg",
        "../images_db/size_s/size_s_photo3.jpg",
        "../images_db/size_s/size_s_photo4.jpg",
      ];
      const miniaturesLinksProvider = new DefaultMiniaturesUriProvider(
        ...miniaturesLinks
      );
      const miniaturesToFullsizeImgMatcher = new DefaultMiniaturesToFullsizeMatcher();
      imgGallery = new ImgGallery(
        miniaturesLinksProvider,
        miniaturesToFullsizeImgMatcher
      );
      document.body.appendChild(imgGallery.element);
    }
    imgGallery.isDisplayed = true;
  });

  function isImgGalleryAddedToDom() {
    return !!document.querySelector(`.img-gallery`);
  }
})();
