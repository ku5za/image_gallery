# [PL] Galeria

## Info

Prosta galeria wyświetlająca duże zdjęcia na podstawie ich miniatur.

## Instalacja

Znawiguj do wybranego folderu i skopiuj do niego repozytorium przez wpisanie

```
git clone https://github.com/ku5za/image_gallery
```

lub skopiuj repozytorium do nowego folderu wpisując jego nazwę w miejsce `[nazwa_folderu]`

```
git clone https://github.com/ku5za/image_gallery [nazwa_folderu]
```

W celu zainstalowania używanych w tym projekcie pakietów wpisz

```
npm install
```

W celu wygenerowania zasobów z kodu źródłowego do folderu `dist` wpisz

```
npm run build
```

`npm run build` to komenda którą należy wpisać po każdej zmianie w plikach w folderze `src` w celu wygenerowania aktualnych zasobów.

## Użytkowanie

Inicjując galerię w jej konstruktorze przekazujemy 2 obiekty, będące pochodnymi interfejsów `IMiniaturesUriProvider` oraz `IMiniaturesToFullsizeMatcher`, które stanowią podstawę dostarczania galerii URI do miniatur oraz zdjęć o pełnych wymiarach.

### IMiniaturesUriProvider

`IMiniaturesUriProvider` zawiera metodę `getImgMiniaturesUri()`, która zwraca tablice URI do miniatur obrazków w zależności od implementacji metody w klasach pochodnych. Jej prosta implementacja znajduje się w klasie `DefaultMiniaturesUriProvider`, która w konstruktorze przyjmuje URI do miniatur i zwraca je wraz z wywołaniem metody `getImgMiniaturesUri()`.

### IMiniaturesToFullsizeMatcher

`IMiniaturesToFullsizeMatcher` zawiera metode `getFullsizeImgUri(miniaturePhotoUri)`, która przyjmuje jako argument adres do miniatury i za jego pomocą zwraca adres do zdjęcia w pełnych wymiarach. Jej przykładowa implementacja znajduje się w klasie `DefaultMiniaturesToFullsizeMatcher`, która w adresie przekazywanym do metody `getFullsizeImgUri(miniaturePhotoUri)` zamienia występujące w adresie fragmenty "size_s" na "size_l" które w przykładowej implementacji rozróżniają miniatury od zdjęc w pełnych wymiarach.

### Przykładowa konfiguracja

W pliku `./src/app.js` znajduje się przykładowy sposób dodania galerii do strony oraz przykładowy sposób jej wywołania.

## Technologie

Moduł ten korzysta z konfiguracji webpacka do tworzenia statycznych zasobów.

W celu zainstalowania webpacka oraz wykorzystywanych przez niego zależności wymagane jest posiadanie zainstalowanego [node.js](https://nodejs.org) w wersji co namniej 10.13.0

- babel ^7.12.13
- sass ^1.32.6
- webpack ^5.21.2
