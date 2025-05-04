# [DEMO] Aplikacja do rezerwacja leżaków

Aplikacja frontendowa zbudowana w oparciu o Angular 19.

## 🔧 Wymagania

- Node.js >= 18 (zalecane LTS)
- NPM >= 9
- Angular CLI (`npm install -g @angular/cli`)
- (Opcjonalnie) Docker i Docker Compose

## 🚀 Uruchomienie lokalne

1. Zainstaluj zależności:

   ```bash
   npm install
   ```

2. Uruchom aplikację (środowisko developerskie):

   ```bash
   npm run start:local-dev
   ```

3. (Opcjonalnie) Uruchom mockowy serwer JSON:

   ```bash
   npm run start:json-server
   ```

## 🔧 Lokalny build aplikacji i serwowanie statyczne

Ten rozdział opisuje, jak lokalnie zbudować aplikację Angular i uruchomić ją jako statyczny serwis — np. do testów z zewnętrznym config.json, bez konieczności ponownego budowania po każdej zmianie.

### 1 Budowanie aplikacji

   ```bash
   npm run build:static
   ```

   > Komenda ta wykonuje build z konfiguracją local-dev, tworząc statyczne pliki w katalogu dist/frontend.

### 2. Serwowanie aplikacji

Aby uruchomić lokalny serwer HTTP na porcie 4200 (lub innym), użyj:

```bash
npm run serve:static
```

To uruchamia prosty serwer statyczny (http-server) z katalogu dist/frontend/browser.

### 3. Restart po zmianie config.json

Jeśli zmienisz plik config.json ładowany przez aplikację (np. assets/config/config.json), wystarczy:

- ponownie uruchomić serwer (Ctrl+C, potem npm run serve:static),
- nie trzeba wykonywać ng build, o ile sam build nie zależy od tego pliku.

## ✅ Testowanie

- jednostkowe:

```bash
npm run test:unit
```

- integracyjne:

```bash
npm run test:integration
```

- E2E (Cypress) z mock backend:

```bash
npm run test:e2e
```

## 📦 Skrypty NPM

| Skrypt              | Opis                                   |
| ------------------- | -------------------------------------- |
| `start`             | Domyślne uruchomienie Angulara         |
| `start:local-dev`   | Uruchomienie z konfiguracją `localdev` |
| `start:json-server` | Mockowy backend (JSON Server)          |
| `build`             | Budowanie aplikacji                    |
| `test`              | Uruchomienie testów przez `jest`       |
| `lint`              | Sprawdzenie lintingu                   |


## 📁 Struktura projektu

    Pełna dokumentacja folderów i architektury pojawi się w kolejnych commitach.

## TODO
opis docker-compose