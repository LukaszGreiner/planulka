SPECYFIKACJA TECHNICZNA
🎯 Tytuł projektu: "Planulka" czyli Aplikacja do Zarządzania Zadaniami z Autoryzacją (Angular 19)

🧰 Technologie
Frontend Angular 19, TypeScript
PWA
Stylowanie Angular Material, tailwind 4.0
Backend (BaaS) Firebase (Auth + Firestore + Storage)
Autoryzacja JWT (generowane przez Firebase)
Routing Angular Router

🗃️ Struktura danych (modele)
Task – Model Zadania
Pole Typ Opis
id string Unikalny identyfikator zadania
title string Tytuł zadania
description string Opis zadania
priority `'low' | 'medium' | 'high'` Priorytet zadania
status `'todo' | 'in_progress' | 'done'` Status zadania
dueDate Date Termin wykonania
createdAt Date Data utworzenia
updatedAt Date Data ostatniej modyfikacji
tags string[] Lista tagów
assignedUsers string[] Lista ID przypisanych użytkowników (opcjonalnie)
attachments string[] Lista linków do załączników
completedAt Date | null Data zakończenia

User – Model Użytkownika
Pole Typ Opis
id string Unikalny identyfikator
username string Unikalny login/nazwa użytkownika
email string Unikalny adres email
password string Hasło (hashowane przez Firebase)
role `'admin' | 'user'` Rola użytkownika
createdAt Date Data rejestracji
updatedAt Date Data aktualizacji

🧩 Funkcjonalności
🔐 Rejestracja i logowanie

- Formularz rejestracji (email, hasło, imię, nazwisko)
- Logowanie (email + hasło)
- Obsługa JWT
- Autoryzacja na podstawie roli (admin, user)
- Firebase Auth + Guardy Angulara

✅ Zarządzanie zadaniami
CRUD:

- Tworzenie zadania (form)
- Edycja zadania
- Usuwanie zadania (admin lub właściciel)
- Oznaczanie jako wykonane (update status, completedAt)

Zasady:

- Użytkownik może edytować/usuwać tylko swoje zadania
- Admin może zarządzać wszystkimi zadaniami i użytkownikami
- Zadania mogą mieć wielu przypisanych użytkowników
- Brak powiadomień w MVP

Filtry i sortowanie:

- Filtr: status, przypisany użytkownik
- Sortowanie: priorytet, data utworzenia

🌐 Routing i strony
Ścieżka Opis
/login Formularz logowania
/register Rejestracja nowego użytkownika
/dashboard Główny panel użytkownika
/admin Panel administratora (lista użytkowników, zarządzanie)
/tasks/create Formularz dodawania zadania
/tasks/:id/edit Edycja zadania
/profile Dane użytkownika

- 404 Not Found

🖌️ Interfejs użytkownika

- Angular Material (UI kit)
- Dedykowane widoki dla ról
- Responsive (Mobile First)
- Spójne kolory i siatka layoutu
- Komponenty: przyciski, formularze, modalne okna, tablice, karty
- Styl: bardzo słodki, niewinny, uroczy, przyjazny, z nutą pozytywnej energii i sprytu
- Kolorystyka, fonty, ikony – zgodnie z powyższym stylem

📡 Komunikacja z backendem

- Firebase Authentication – logowanie, rejestracja, rola
- Firestore – przechowywanie danych zadań i użytkowników
- Storage – załączniki
- HTTP Interceptor – dodawanie tokenów JWT do zapytań
- Guardy Angularowe – chronienie tras według roli i zalogowania

⚠️ Walidacja i błędy

- Walidacja formularzy (Reactive Forms)
- Walidacja pól: email, hasło (min. 6 znaków), daty
- Obsługa błędów API (toast/alerty)
- Obsługa błędów Firebase

📄 Dokumentacja (README.md)

- Opis aplikacji
- Instrukcja instalacji i uruchomienia
- Użyte technologie
- Dostępne konta testowe (admin/user)

🎨 Style

/_ CSS HSL _/
--celadon: hsla(137, 38%, 77%, 1);
--peach-yellow: hsla(37, 90%, 84%, 1);
--tangerine: hsla(28, 82%, 54%, 1);
--hunter-green: hsla(133, 28%, 32%, 1);
--fawn: hsla(28, 85%, 71%, 1);

/_ SCSS Gradient _/
$gradient-top: linear-gradient(0deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-right: linear-gradient(90deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-bottom: linear-gradient(180deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-left: linear-gradient(270deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-top-right: linear-gradient(45deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-bottom-right: linear-gradient(135deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-top-left: linear-gradient(225deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-bottom-left: linear-gradient(315deg, #ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);
$gradient-radial: radial-gradient(#ADDABAff, #FBDEAFff, #EA852Aff, #3B6945ff, #F4B278ff);

🌍 Inne

- Aplikacja tylko po polsku (na start)
- Brak testów i CI/CD w MVP
- Możliwość integracji z Google Calendar w przyszłości
