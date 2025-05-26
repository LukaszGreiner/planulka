# Planulka – Aplikacja do Zarządzania Zadaniami

## Aplikacja dostępna lokalnie lub online pod adresem:
![icon-128](https://github.com/user-attachments/assets/dee25feb-cb52-47d0-b644-05f7db84a7f0)

[planulka.vercel.app/](https://planulka.vercel.app/)

## Instrukcja Instalacji

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Pomiń konfigurację Firebase
3. Zbuduj aplikację:
   ```bash
   ng build
   ```
4. Uruchom serwer developerski:
   ```bash
   ng serve
   ```
5. Otwórz w przeglądarce:
   ```
   http://localhost:4200/
   ```
6. Zaloguj się na konto testowe (patrz niżej) lub zarejestruj nowe.

## Opis Projektu

Planulka to PWA do zarządzania zadaniami z autoryzacją opartą na Firebase.  
Umożliwia:

- tworzenie, edycję i usuwanie zadań,
- zarządzanie priorytetami, statusami, terminami, tagami i załącznikami,
- panel administratora do zarządzania użytkownikami i zadaniami.

Styl: słodki, przyjazny, responsywny (Mobile First).

## Technologie

- Angular 19 & TypeScript
- Angular Material & Tailwind CSS 4.0
- Firebase (Auth, Firestore)
- Angular Router & Guards
- PWA

## Funkcjonalności

- Rejestracja i logowanie (email + hasło)
- Role: **admin** i **user**
- Panel użytkownika i administratora
- Zarządzanie zadaniami (CRUD)
- Walidacja formularzy (Reactive Forms)
- Obsługa błędów i toasty/alerty
- Autoryzacja JWT via Firebase
- Przechowywanie załączników w Firebase Storage

## Role użytkowników

- **Administrator** – pełny dostęp do wszystkich użytkowników i zadań
- **Użytkownik** – zarządza własnymi zadaniami

## Konta testowe

- **Admin**: `admin@admin.pl` / `admin@admin.pl`
- **User**: `user@user.pl` / `user@user.pl`

Możesz też utworzyć nowe konto przez formularz rejestracji.

## Opis Działania

1. Użytkownik rejestruje się lub loguje.
2. Po zalogowaniu widzi panel z listą zadań, może je filtrować, tworzyć, edytować i usuwać.
3. Administrator dodatkowo zarządza wszystkimi użytkownikami i zadaniami.
