import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../models/team.interface';
import { AuthService } from './auth.service';
import { User } from '../models/user.interface';
// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  // Variables de usuarios para colecciones y documentos en Firestore
  teamCollection: AngularFirestoreCollection<Team>;
  teamDoc: AngularFirestoreDocument<Team>;
  teamsObs: Observable<Team[]>;
  teamObs: Observable<Team>;
  teamsObservable: Observable<any>;

  delegates: Observable<User[]>;
  delegatesUser: Observable<User[]>;
  delegate: Observable<any>;
  manager: User;
  teamId: string;
  // Variables auxiliares
  teams: Team [];
  team: Team;
  idTeam: string;
  teamAux: Team;
  teamsAux: Team[] = [];

  usersToChoose: User[];
  usersToChooseS: string[];

  constructor( private http: HttpClient,
               private afs: AngularFirestore,
               private authService: AuthService ) {

      this.loadTeams(afs);
      this.teamsObs.subscribe(teams => {
        this.teams = teams;
      });
      this.authService.users.subscribe(users => {
        this.usersToChoose = users;
      });
   }

  loadTeams(afs: AngularFirestore ) {
        this.teamCollection = afs.collection<Team>('teams');
        this.teamsObs = this.teamCollection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(a => {
            const data = a.payload.doc.data() as Team;
            data.id = a.payload.doc.id;
            return data;
            });
  }));
  }


  getTeams(): Observable<Team[]> {
    this.teamsObs = this.teamCollection.snapshotChanges().pipe(
      map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as Team;
          data.id = action.payload.doc.id;
          return data;
        });
      }));
    return this.teamsObs;

  }

  getTeamByUser( user: User) {
     this.teamsObservable = this.afs.collection('teams', ref => ref.where('manager', '==', user.uid)).snapshotChanges().pipe(
       map( changes => {
         return changes.map(action => {
           const data = action.payload.doc.data() as Team;
           data.id = action.payload.doc.id;
           return data;
         });
       })
     );
     return this.teamsObservable;
  }

  getDelegates( team: Team ) {
   this.delegates = this.afs.collection('teams').doc(team.id).collection('delegates', ref => ref.orderBy('createdAt')).snapshotChanges().pipe(
        map(changes => {
          return changes.map(action => {
            const data = action.payload.doc.data() as User;
            data.uid = action.payload.doc.id;
            return data;
          });
        }));
   return this.delegates;
  }


   getDelegatesUser( team: Team, user: User ) {
    this.delegatesUser = this.afs.collection('teams').doc(team.id).collection('delegates', ref => {let query = ref;
                                                                                                   query.where('id', '==', user.uid);
                                                                                                   // this.teamsAux = [];
                                                                                                   this.teamId = query.parent.id;
                                                                                                  // console.log(this.teamId);
                                                                                                   this.getTeam(this.teamId).subscribe( team => {
                                                                                                        this.teamAux = team;
                                                                                                        this.teamsAux.push(this.teamAux);
                                                                                                   });
                                                                                                   console.log(this.teamsAux);
                                                                                                   return query;  }).snapshotChanges().pipe(
         map(changes => {
           return changes.map(action => {
             const data = action.payload.doc.data() as User;
             data.uid = action.payload.doc.id;
             return data;
           });
         }));
    return this.delegatesUser;
   }


  addDelegates( team: Team, users: User[] ) {
    let userAux: User = {
      displayName: '',
      uid: '',
      email: '',
      photoURL: '',
      employment: '',
      createdAt: null,
      phoneNumber:  ''
    };
    users.forEach(user => {
      /* userAux = {
          name: user.name,
          id: user.id,
          email: user.email,
          photo: user.photo,
          employment: user.employment,
          createdAt: user.createdAt,
          phone_number: user.phone_number
      }; */
      this.afs.collection('teams').doc(team.id).collection('delegates').doc(user.uid).set({
        displayName: user.displayName,
        uid: userAux.uid,
        email: userAux.email,
        photo: userAux.photoURL,
        employment: userAux.employment,
        createdAt: userAux.createdAt,
        phone_number: userAux.phoneNumber
      });
    });
   }

   getTeam( id: string ) {
    this.teamDoc = this.afs.doc(`teams/${id}`);
    this.teamObs = this.teamDoc.snapshotChanges().pipe(
      map(actions => {
        if (actions.payload.exists === false) {
          return null;
        } else {
          const data = actions.payload.data() as Team;
          data.id = actions.payload.id;
          return data;
        }
        }));
    return this.teamObs;

  }


  setTeamtoUser( user: User, users: User[] ) {

    this.afs.collection('teams').add({
      manager: user.uid,
    }).then(doc => {
      let delegatesCollection = doc.collection('delegates');

      let batch = this.afs.firestore.batch();

      users.forEach( d => {
        let ref = delegatesCollection.doc(d.uid);
        batch.set(ref, {
          displayName: d.displayName,
          email: d.email,
          uid: d.uid,
          photoURL: d.photoURL,
          employment: d.employment,
          phoneNumber: d.phoneNumber,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });

      return batch.commit();
    }).then(result => {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        title: 'Guardado con exito'
      });
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: err
      });
    });
  }
}