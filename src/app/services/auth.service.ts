import { Injectable } from "@angular/core";
import { User } from "../models/user.interface";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as firebase from "firebase/app";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userCollection: AngularFirestoreCollection<User>;
  userDoc: AngularFirestoreDocument<User>;
  users: Observable<User[]>;
  user: Observable<User>;

  usersAuth: User[];
  userAuth: User;
  userGuGo: User;
  userToken: string;
  idUser: string;
  photoURL: string;

  windowRef: any;

  verificationCode: string;

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {
    this.loadUsers(afs);
    this.users.subscribe((users) => {
      this.usersAuth = users;
    });
    this.loadStorage();
  }

  loadUsers(afs: AngularFirestore) {
    this.userCollection = afs.collection<User>("users", (ref) =>
      ref.orderBy("createdAt")
    );
    this.users = this.userCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data() as User;
          data.uid = a.payload.doc.id;
          return data;
        });
      })
    );
  }

  loadStorage() {
    const userLocalStorage = localStorage.getItem("user");
    if (userLocalStorage) {
      this.userAuth = JSON.parse(userLocalStorage);
    } else {
      this.userAuth = null;
    }
  }

  async register(userAuth: User) {
    const { email, password } = userAuth;
    try {
      const result = await this.auth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const { user } = result;
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async login(userAuth: User) {
    const { email, password } = userAuth;
    try {
      const result = await this.auth.auth.signInWithEmailAndPassword(
        email,
        password
      );
      const { user } = result;
      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async resetPassword(emailPasswd: any) {
    const actionCodeSettings = {
      url: `http://localhost:4200/#/?email=${emailPasswd}`,
      handleCodeInApp: true,
    };
    try {
      const result = await this.auth.auth.sendPasswordResetEmail(
        emailPasswd,
        actionCodeSettings
      );
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // changePassword(pass: string, idT: string) {
  //   const authData = {
  //     idToken: idT,
  //     password: pass,
  //     returnSecureToken: true,
  //   };

  //   console.log(authData);

  //   return this.http
  //     .post(`${this.url}/accounts:update?key=${this.apikey}`, authData)
  //     .pipe(
  //       map((resp: any) => {
  //         return resp;
  //       })
  //     );
  // }

  async verifyEmail() {
    await firebase.auth().currentUser.sendEmailVerification();
  }

  async logout() {
    await this.auth.auth.signOut();
    localStorage.clear();
  }

  createUser(user: User, uid: string) {
    this.afs
      .collection("users")
      .doc(uid)
      .set({
        ...user,
      });
  }

  getUser(user: any) {
    const { uid } = user;
    this.userDoc = this.afs.collection("users").doc(uid);
    this.user = this.userDoc.snapshotChanges().pipe(
      map((actions) => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as User;
          data.uid = actions.payload.id;
          return data;
        }
      })
    );
    return this.user;
  }

  getUserById(uid: string) {
    this.userDoc = this.afs.collection("users").doc(uid);
    this.user = this.userDoc.snapshotChanges().pipe(
      map((actions) => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as User;
          data.uid = actions.payload.id;
          return data;
        }
      })
    );
    return this.user;
  }

  updateUser(user: User) {
    const { uid } = user;
    this.afs.collection("users").doc(uid).update({
      displayName: user.displayName,
      birthdate: user.birthdate,
      description: user.description,
      gender: user.gender,
      photoURL: user.photoURL,
    });
  }
  setTokenUser(user: User, token: string) {
    const { uid } = user;
    this.afs.collection("users").doc(uid).update({
      token,
    });
  }

  getUsers() {
    this.users = this.afs
      .collection("users")
      .snapshotChanges()
      .pipe(
        map((changes) => {
          return changes.map((action) => {
            const data = action.payload.doc.data() as User;
            data.uid = action.payload.doc.id;
            return data;
          });
        })
      );
    return this.users;
  }

  saveUserOnStorage(user: User) {
    // localStorage.clear();
    this.userAuth = user;
    localStorage.setItem("user", JSON.stringify(user));
  }
}
