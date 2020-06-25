import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.interface';
import { Team } from '../models/team.interface';
import { TeamService } from '../services/team.service';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { NavController, ModalController } from '@ionic/angular';
import { ModalTeamPageModule } from '../pages/modal-team/modal-team.module';
import { ModalTeamPage } from '../pages/modal-team/modal-team.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  usersApp: User[] ;
  usersAppFilter: User[] = [];
  usersGugo: User[] = [];
  selectedUsers: User[] = [];
  selectedUsersPlus: User[] = [];
  teams: Team[] = [];
  delegates: User[] = [];

  userGugo: User = {
    displayName: '',
    email: '',
    password: '',
    uid: '',
    birthdate: new Date(),
    description: '',
    gender: '',
    photoURL: '',
    manager: false,
    phoneNumber: ''
  };

  teamsObservable: any;
  teamGugo: Team = {
    manager: ''
  };
  teamUserGugo: Team = {
    delegates: this.delegates
  };

  post = true;
  visability = false;

  // Variables Auxiliares
  teamsAux: Team[] = [];
  teamsAux1: Team[] = [];
  delegatesAux: User[] = [];
  delegatesAux1: User[] = [];
  managers: string[] = [];
  managerAux: User = {
      uid: '',
      displayName: '',
      email: ''
  };
  delegateAux: User = {
    uid: '',
    displayName: '',
    email: ''
};
delegateAux1: User = {
  uid: '',
  displayName: '',
  email: ''
};

  constructor(private teamService: TeamService,
              private authService: AuthService,
              private projectService: ProjectService,
              private navCtrl: NavController,
              private modalCtrl: ModalController ) {}

  ngOnInit() {

    this.getTeam();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.usersGugo.length; i++) {
      this.usersGugo[i].check = false;
    }

  }

  getUniqueDelegates() {
    this.delegatesAux1.filter((elem, pos) => this.delegatesAux1.indexOf(elem) === pos);
    let element = 0;
    let decrement = this.delegatesAux1.length - 1;
    while (element < this.delegatesAux1.length) {
                  while (element < decrement) {
                    if (this.delegatesAux1[element].email === this.delegatesAux1[decrement].email) {
                        this.delegatesAux1.splice(decrement, 1);
                        decrement--;
                    } else {
                        decrement--;
                    }
                  }
                  decrement = this.delegatesAux1.length - 1;
                  element++;
                                                            }
   
  }
  
  removeDelegate(delegate) {
    this.delegatesAux1.forEach( (item, index) => {
      if ( item.email === delegate.email ) { this.delegatesAux1.splice(index, 1); }
    });
  }
  getTeam() {
    this.authService.getUser(this.authService.userAuth)
    .subscribe(user => {(this.userGugo = user);
                        // Obtener todos los usuarios de la App
                        this.authService.getUsers()
                        .subscribe(users => {
                                    this.usersApp = users;        // Lista de todos los usuarios
                                    this.usersGugo = [];          // Lista de los usuarios excepto el usuario autenticado
                                    // Obtener lista de usuarios excepto el usuario autenticado
                                    this.usersApp.map( item => {
                                    if ( item.uid !== this.userGugo.uid && item.manager === false ) {
                                    this.usersGugo.push(item);
                                    }
                                    });
                                    // Obtener el equipo segun el usuario autenticado
                                    this.teamService.getTeamByUser(this.userGugo)
                        .subscribe(team => {
                                 this.teamsObservable = team;
                                 this.teamsObservable.map(a =>
                                 this.teamGugo = a);
                                   // Obtener los delegados del equipo
                                 if ( this.teamGugo.manager ) {
                                   this.teamGugo.delegates = [];
                                   this.teamService.getDelegates(this.teamGugo).subscribe(delegates => {
                                   this.teamGugo.delegates = delegates;

                                   // Obtener los correos de los usuarios para poder ampliar los miembros de un equipo
                                   let emails;
                                   emails = new Set(this.teamGugo.delegates.map(({ email }) => email));

                                   // Establecer los usuarios que no pertencen al equipo
                                   this.usersAppFilter = [];
                                   this.usersAppFilter = this.usersGugo.filter(({ email }) => !emails.has(email));
                                   });
                                } else {
                                    this.teamGugo.delegates = [];
                                    this.teamService.getTeams().subscribe(teams => {
                                        this.teamsAux = teams;
                                        this.teamsAux.forEach(team => {
                                            this.teamService.getDelegates(team).subscribe(delegates => {
                                                   // tslint:disable-next-line:prefer-for-of
                                                   team.delegates = delegates;
                                                   team.delegates.forEach(delegate => {
                                                       if ( delegate.email === this.userGugo.email ) {
                                                           this.teamsAux1.push(team);
                                                           this.teamsAux1.forEach(teamA => {
                                                            this.authService.getUserById(teamA.manager).subscribe(manager => {
                                                              if (manager != null) {
                                                                if (!this.delegatesAux1.some(obj => obj.email === manager.email && obj.uid === manager.uid)) {
                                                                  this.delegatesAux1.push(manager);
                                                                }
                                                              }
                                                           });
                                                });
                                                           team.delegates.forEach(delegate => {
                                                            if (delegate != null) {
                                                            if (!this.delegatesAux1.some(obj => obj.email === delegate.email && obj.uid === delegate.uid)) {
                                                              this.delegatesAux1.push(delegate);
                                                            }
                                                            }
                                                           });
                                                       }
                                                       this.removeDelegate(this.userGugo);
                                                       this.delegatesAux1 = this.delegatesAux1.sort();
                                                       this.getUniqueDelegates();
                                                   });
                                        });
                                    });
                                    });
                            }
                        });
                      });
                    });
  }

  onChange( users: User[]){
    console.log('onChange', users);
    let isChecked = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < users.length; i++) {
      if (users[i].check === true) {
        isChecked = true;
        this.visability = true;
      }
    }
    if (isChecked === false){
      this.visability = false;
    }
  }

  // profile() {
     // this.navCtrl.navigateRoot( 'tabs/tabs/tab2/profile', { animated: true } );

  // }

  async addTeam() {

    const modal = await this.modalCtrl.create({
      component: ModalTeamPage,
      componentProps: {
        members: this.usersAppFilter,
        newMembers: null
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log(data);
    if ( data != null) {
      let users: User [] = [];
      users = data['newMembers'] ;
      console.log(users) ;
      this.teamService.addDelegates(this.teamGugo, users);
    }
  }

  team() {
    this.usersGugo.map(usr => {
      if ( usr.check === true) {
          console.log(usr);
      }
    });
    console.log(this.usersAppFilter);
    console.log(this.teamGugo.delegates);
  }

}
