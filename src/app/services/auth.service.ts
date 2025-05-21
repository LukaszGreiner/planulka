import { Injectable, inject } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
  User,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  DocumentSnapshot,
} from '@angular/fire/firestore';
import { setPersistence } from 'firebase/auth';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Define the UserProfile interface for Firestore documents
interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth = inject(Auth);
  private firestore = inject(Firestore);
  user$: Observable<User | null>;

  constructor() {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  // Register a new user with email and password
  register(email: string, password: string): Observable<void> {
    return from(
      createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          // Create a user profile in Firestore with default role 'user'
          return this.createUserProfile(user.uid, email);
        }
      )
    );
  }

  // Log in with email and password
  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((userCredential) => {
      const user = userCredential.user;
      // Ensure user profile exists in Firestore
      return this.createUserProfile(user.uid, email);
    });
    return from(promise);
  }

  // Log in with Google
  async googleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.firebaseAuth, provider);
      const user = result.user;
      if (!user) {
        throw new Error('Google-Login error');
      }
      // Ensure user profile exists in Firestore
      await this.createUserProfile(user.uid, user.email || '');
    } catch (error) {
      console.error('Google-Login error:', error);
      throw error;
    }
  }

  // Log out
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }

  // Create or update user profile in Firestore
  private async createUserProfile(
    userId: string,
    email: string
  ): Promise<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      // Create a new user profile if it doesn't exist
      await setDoc(userDoc, {
        id: userId,
        email,
        role: 'user', // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // Update the updatedAt timestamp
      await setDoc(userDoc, { updatedAt: new Date() }, { merge: true });
    }
  }

  // Get the current user's role
  getUserRole(): Observable<string | null> {
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) return from([null]); // Emit null if no user is logged in
        const userDoc = doc(this.firestore, `users/${user.uid}`);
        return from(getDoc(userDoc)).pipe(
          map((docSnap: DocumentSnapshot) => {
            const userProfile = docSnap.data() as UserProfile;
            return docSnap.exists() ? userProfile.role : null;
          })
        );
      })
    );
  }
}
