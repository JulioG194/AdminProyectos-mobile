import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user.interface';
import { Team } from '../models/team.interface';
import { TeamService } from '../services/team.service';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Project } from '../models/project.interface';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalResourcesPage } from '../pages/modal-resources/modal-resources.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  usersApp: User[] ;
  usersAppFilter: User[] = [];
  usersGugo: User[] = [];
  selectedUsers: User[] = [];
  selectedUsersPlus: User[] = [];
  teams: Team[] = [];
  delegates: User[] = [];
  isLoading: boolean;
  managers: User[] = [];
  partners: User[] = [];
  partnersAll: User[] = [];
  projectsTeam: Project[] = [];
  numbersTasks = 0;
  visability: boolean;
  newMemb: User[] = [];

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

  teamUsersDelegate: User[] = [];
  teamsAux: Team[] = [];
  teamsAux1: Team[] = [];
  delegatesAux: User[] = [];
  delegatesAux1: User[] = [];
  // managers: string[] = [];
  managerAux: User = {
      displayName: '',
      email: '',
      uid: ''
  };
  delegateAux: User = {
    displayName: '',
    email: '',
    uid: ''
};
delegateAux1: User = {
  displayName: '',
  email: '',
  uid: ''
};
subscrp: Subscription;

teamId: string;
getDelTsk: Subscription;
numberT: number;
segmentModel = 'select';

  constructor(private teamService: TeamService,
              private authService: AuthService,
              private projectService: ProjectService,
              private modalCtrl: ModalController,
              public loadingController: LoadingController ) {}

  ngOnInit() {
      this.initData();
  }

  ionViewWillEnter() {
      this.initData();
  }

  initData() {
    // this.isLoading = true;
    this.segmentModel = 'view';
    this.userGugo = this.authService.userAuth;
    if (this.userGugo.manager) {
        if (this.userGugo.company) {
            this.getLocalCompany();
            this.getProjectsTeam();
        } else {
            this.getDelegatesUncompany();
        }
    } else {
      if (this.userGugo.company) {
          this.getTeamDelegate();
      } else {
        this.getTeamDelegate();
      }
    }
  }

  ngOnDestroy() { }

  getLocalCompany() {
    // this.userGugo = this.authService.userAuth;
    this.teamService.getUsersCompany(this.userGugo.company.id)
                    .subscribe(users => {
     const usersGugoArray = _.reject(users, {uid: this.userGugo.uid});
     this.teamService.getTeamByUser(this.userGugo).subscribe(teams => {
       if (teams.length > 0) {
         const {id} = _.head(teams);
         this.teamId = id;
         this.teamService.getDelegatesId(this.teamId).subscribe(delegates => {
         this.usersGugo = _.xorBy(usersGugoArray, delegates, 'uid');
         this.usersGugo = _.reject(this.usersGugo, {manager: true});
         this.teamGugo.delegates = delegates;
         this.isLoading = false;
        });
       } else {
         this.usersGugo = usersGugoArray;
         this.usersGugo = _.reject(this.usersGugo, {manager: true});
         this.isLoading = false;
       }
    });
    });
  }

  getProjectsTeam() {
    // this.userGugo = this.authService.userAuth;
    this.projectService.getProjectByOwner(this.userGugo)
                       .subscribe(projs => {
      this.projectsTeam = projs;
      this.projectsTeam.map(proj => {
        // proj.delegates = _.uniqBy(proj.delegates, 'uid');
        proj.delegates = [];
        this.projectService.getActivities(proj.id).subscribe(acts => {
          acts.map(act => {
            this.projectService.getTasks(proj.id, act.id).subscribe(tsks => {
              tsks.map(tsk => {
                proj.delegates.push(tsk.delegate);
                proj.delegates = _.uniqBy(proj.delegates, 'uid');
              });
            });
          });
        });
        // proj.delegates = _.uniqBy(proj.delegates, 'uid');
      });
    });
  }

  async getTeamDelegate() {
    const loading = await this.loadingController.create({
      message: 'Por favor, espere...',
      translucent: true,
    });
    await loading.present();
    // this.authService.getUser(this.authService.userAuth).subscribe(usr => {
       // this.userGugo = usr;
       // console.log(this.userGugo);
    if (this.userGugo.teams) {
        this.userGugo.teams.map(team => {
      this.managers = [];
      this.partners = [];
      this.teamService.getTeam(team).subscribe(tm => {
        const user: User = {
          uid: tm.manager,
          email: tm.email,
          displayName: tm.displayName,
          employment: tm.employment,
          phoneNumber: tm.phoneNumber,
          photoURL: tm.photoURL
        };
        this.managers.push(user);
        this.managers = _.uniqBy(this.managers, 'uid');
        this.teamService.getDelegatesId(team).subscribe(del => {
          del.map(d => {
            this.partners.push(d);
          });
          const uniq = _.uniqBy(this.partners, 'uid');
          const withoutHost = _.reject(uniq, {uid: this.userGugo.uid});
          this.partnersAll = withoutHost;
          loading.dismiss();
        });
      });
    });
  } else {
      loading.dismiss();
  }
   // });
  }

  getDelegatesUncompany() {
      // this.userGugo = this.authService.userAuth;
      this.teamService.getDelegatesUncompany()
                      .subscribe(usrs => {
              const arrayUsers = usrs.filter(usr => usr !== undefined);
              console.log(arrayUsers);
              this.teamService.getTeamByUser(this.userGugo)
                                .subscribe(teams => {
                                      console.log(teams);
                                      if (teams.length > 0) {
                                       const {id} = _.head(teams);
                                       this.teamId = id;
                                       this.teamService.getDelegatesId(this.teamId)
                                                           .subscribe(delegates => {
                                                             this.usersGugo = _.xorBy(arrayUsers, delegates, 'uid');
                                                             this.teamGugo.delegates = delegates;
                                                             this.isLoading = false;
                                      });
                                      } else {
                                        this.usersGugo = arrayUsers;
                                        this.isLoading = false;
                                      }
              });
      });
  }

  removeDelegates(delegateId: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, remover delegado!',
      showCloseButton: true,
    }).then((result) => {
      if (result.value) {
       this.authService.getUserOnce(delegateId).pipe(take(1)).
        subscribe(user => {
          if (user.assignedTasks > 0) {
            Swal.fire({
            allowOutsideClick: false,
            icon: 'warning',
            text: 'No se puede borrar al delegado, tiene tareas en proceso asignadas'
            });
          } else {
            this.teamService.deleteDelegate(this.teamId, delegateId);
            Swal.fire('Listo!', 'Delegado removido de tu equipo.', 'success');
          }
        });
      }
    });
  }

  onChange( users: User[]) {
    this.selectedUsers = [];
    let isChecked = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].check === true) {
        isChecked = true;
        this.visability = true;
        this.selectedUsers.push(users[i]);
      }
    }
    if (isChecked === false) {
      this.visability = false;
    }
  }

  // profile() {
  //    this.navCtrl.navigateRoot( 'tabs/tabs/tab2/profile', { animated: true } );
  // }

  segmentChanged($event) {
    console.log($event);
  }

  async openProfile() {
    const modal = await this.modalCtrl.create({
      component: ModalProfilePage,
      componentProps: {
        user: this.userGugo,
        newProfile: null
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.userGugo = this.authService.userAuth;
  }

  async addNewTeam() {
  if ( this.selectedUsers.length > 0) {
    try {
      // await this.teamService.setTeamtoUser(this.userGugo, this.selectedUsers);
      console.log(this.userGugo);
      console.log(this.selectedUsers);
      Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          title: 'Guardado con exito',
        });
    } catch (error) {
      Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: error,
        });
    }
  } else {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'warning',
      text: 'No se han seleccionado personas para tu equipo'
    });
  }
}

async openResources(project: Project) {
    const modal = await this.modalCtrl.create({
      component: ModalResourcesPage,
      componentProps: {
        projectId: project.id,
        newProfile: null
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    // this.userGugo = this.authService.userAuth;
  }

}
