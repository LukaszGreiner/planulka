import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private usersCollection = collection(this.firestore, 'users');

  getUserById(userId: string): Observable<User> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDoc)).pipe(
      map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as User))
    );
  }

  updateUserRole(userId: string, role: 'admin' | 'user'): Observable<void> {
    const userDoc = doc(this.firestore, `users/${userId}`);
    return from(
      setDoc(userDoc, { role, updatedAt: new Date() }, { merge: true })
    );
  }
}
