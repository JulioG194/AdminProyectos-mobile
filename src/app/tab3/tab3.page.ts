import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.interface';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { TeamService } from '../services/team.service';
import { Team } from 'src/app/models/team.interface';
import { Activity } from '../models/activity.interface';
import { Task } from '../models/task.interface';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { EvidenceService } from '../services/evidence.service';
import { Evidence } from '../models/evidence.interface';
import { AlertController, NavController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { ModalController } from '@ionic/angular';
import { ModalNewprojectPageModule } from '../pages/modal-newproject/modal-newproject.module';
import { ModalNewprojectPage } from '../pages/modal-newproject/modal-newproject.page';
import { ModalEvidencedelegatePage } from '../pages/modal-evidencedelegate/modal-evidencedelegate.page';
import { ModalEvidencedelegatePageModule } from '../pages/modal-evidencedelegate/modal-evidencedelegate.module';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';

export interface PAT {
  project: Project;
  activity: Activity;
  task: Task;
  startDate: Date;
  endDate: Date;
  photo?: string;
  manager_name?: string;
}

/* export interface DialogDataActivities {
  projectAppId: string;
} */

export interface StringDate {
  name: string;
  delegate: string;
  chores: string; // tareas
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

gestor = true ;
empty = true ;
name1: string;

  constructor(public authService: AuthService,
              public projectService: ProjectService,
              public teamService: TeamService,
              private router1: Router,
              private router: Router,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
              private modalCtrl: ModalController,
              private screenOrientation: ScreenOrientation) {}

              team: string[] = [];

              userApp: User = {
                    displayName: '',
                    email: '',
                    password: '',
                    uid: '',
                    birthdate: new Date(),
                    description: '',
                    gender: '',
                    photoURL: ''
                };


              projectsApp: Project[] = [];
              activitiesProjectsApp: Activity[] = [];
              tasksActivitiesApp: Task[] = [];
              tasksActivitiesApp1: Task[] = [];
              projectsOfDelegate: Project[] = [];
              activitiesDelegate: Activity[] = [];
              projectsOfDelegate1: Project[] = [];
              activitiesDelegate1: Activity[] = [];
              tasksDelegate: Task[] = [];

              idUser: string;
              teamsObservable: any;
              teamAux: Team = {
                    manager: ''
              };
              teamAux1: Team[] = [];
              startD: Date;
              endD: Date;
              minDate = new Date();
              name: string;
              delegate: string;
              chores: string; // tareas
              allstartdates: Date[] = [];
              allenddates: Date[] = [];

              projectApp: Project = {
                name: '',
                client: '',
                description: '',
                startDate: new Date(),
                endDate: new Date(),
                type: '',
                teamId: '',
                ownerId: '',
                status: 'To Do'
              };

              teamsAux: Team[] = [];
              teamsAux1: Team[] = [];
              teamGugoAux: Team = {
                manager: ''
              };
              teamGugo: Team = {
                manager: ''
              };

              pats: PAT[] = [];
              pats1: PAT[] = [];
              pat: PAT = {
                project: null,
                activity: null,
                task: null,
                startDate: null,
                endDate: null,
                photo: ''
              };
              value = '';

  ngOnInit() {
      this.getProjects();
  }
    getProjects() {
    this.userApp = this.authService.userAuth;
    this.projectService.getProjectByOwner(this.userApp)
                        .subscribe(projects => {
                          projects.map(project => {
                            project.startDate = new Date(project.startDate['seconds'] * 1000);
                            project.endDate = new Date(project.endDate['seconds'] * 1000);
                          });
                          this.projectsApp = projects;
                        });
  }


  onEnter(idP: string, idA: string, idT: string, value: string) {
    this.value = value;
    if ( +this.value > 0 && +this.value <= 100) {
    } else {
      console.log('numero ingresado incorrecto');
    }
  }

  async press() {
      const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: 'No has seleccionado ningun delegado',
      buttons: ['Aceptar']
    });
      await alert.present();
  }

  projectRoute( idProject: string) {
    this.navCtrl.navigateForward(`tabs/tabs/tab3/project/${idProject}`, { animated: true });
  }

  async openNewProject() {
          const modal = await this.modalCtrl.create({
          component: ModalNewprojectPage,
          componentProps: {
          user: this.userApp,
          newProject: null
        }
      });
          await modal.present();
          const { data } = await modal.onDidDismiss();
          console.log(data);
          if ( data != null) {
      let project: Project;
      project = data['newProject'] ;
      console.log(project) ;
    }
  }

  async editProject(projectAux: Project) {

          const modal = await this.modalCtrl.create({
          component: ModalNewprojectPage,
          componentProps: {
          project: projectAux,
          editProject: null
        }
      });
          await modal.present();
          const { data } = await modal.onDidDismiss();
          console.log(data);
          if ( data != null) {
      let project: Project;
      project = data['newProject'] ;
      console.log(project) ;
      this.projectService.updateProject(project);
    }
  }

   async openProfile() {
    const modal = await this.modalCtrl.create({
      component: ModalProfilePage,
      componentProps: {
        user: this.userApp,
        newProfile: null
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.userApp = this.authService.userAuth;
  }

  async openEvidence(name: string) {
        const modal = await this.modalCtrl.create({
        component: ModalEvidencedelegatePage,
        componentProps: {
        newMembers: null,
        task: name
      }
    });
        await modal.present();
        const { data } = await modal.onDidDismiss();
        console.log(data);
  }

  deleteProject(projectId: string) {
    this.projectService.deleteProject(projectId);
  }

}
