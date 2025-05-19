import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'planulka',
        appId: '1:379244954827:web:bec4590f553de31802874e',
        storageBucket: 'planulka.firebasestorage.app',
        apiKey: 'AIzaSyD6wJhAQUR_lXeDdkfFRL6MlY8uVYXywpI',
        authDomain: 'planulka.firebaseapp.com',
        messagingSenderId: '379244954827',
        measurementId: 'G-4K337J40WQ',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
