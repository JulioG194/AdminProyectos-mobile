import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import { Project } from 'src/app/models/project.interface';
import { Activity } from 'src/app/models/activity.interface';
import { Task } from 'src/app/models/task.interface';
import { Team } from 'src/app/models/team.interface';
import { User } from 'src/app/models/user.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalActivityPage } from '../modal-activity/modal-activity.page';
import { ModalActivityPageModule } from '../modal-activity/modal-activity.module';
import { ModalTaskPage } from '../modal-task/modal-task.page';
import { ModalTaskPageModule } from '../modal-task/modal-task.module';
import { ModalEvidencegestorPage } from '../modal-evidencegestor/modal-evidencegestor.page';
import { ModalEvidencegestorPageModule } from "../modal-evidencegestor/modal-evidencegestor.module";

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  post = true;
  post1 = true;
  post2 = true;
  post3 = true;
  post4 = true;
  post5 = true;
  edit = true;

  open = true;
  open1 = true;
  open2 = true;
  open3 = true;

  validate = true;

  panelOpenState = false;

  name: string;


 // delegates: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa'];

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
startD = new Date();
endD = new Date();
id: string;
idActivity: string;
minDate = new Date();
maxDate = new Date();

activityProject: Activity = {
    name: '',
    status: '',
    activity_time: 0
};

taskActivity: Task = {
    name: '',
    status: '',
    delegate: null
};

team: Team;
delegates: User[] = [];
tasksActivity: Task[][];
activitiesProject: Activity[] = [];
differenceTime: number;
differenceDays: number;

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
allstartdates: Date[] = [];
allenddates: Date[] = [];
allstartdatesT: Date[] = [];
allenddatesT: Date[] = [];
activityAux: Activity = {
  name: '',
  status: '',
  startDate: null,
  endDate: null,
  activity_time: 0
};

aux7: number;
information: any[];

automaticClose = false;


  constructor( private route: ActivatedRoute,
               private _projectService: ProjectService,
               private authService: AuthService,
               private router: Router,
               private router1: Router,
               private modalCtrl: ModalController,
               public _teamService: TeamService,
               private alertCtrl: AlertController ) {

              //  this.information = this.activitiesProject;
                 }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userApp = user); });
    this._projectService.getProject(this.id).subscribe(project => {
                                                                                                this.projectApp = project;
                                                                                                this.projectApp.startDate = new Date(this.projectApp.startDate['seconds'] * 1000);
                                                                                                this.projectApp.endDate = new Date(this.projectApp.endDate['seconds'] * 1000);
                                                                                                this.differenceTime = Math.abs(this.projectApp.endDate.getTime() - this.projectApp.startDate.getTime());
                                                                                                this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                                                // console.log(this.differenceDays);
                                                                                                this._teamService.getTeam(this.projectApp.teamId).subscribe(team => {
                                                                                                this.team = team;
                                                                                                this._teamService.getDelegates(this.team).subscribe(delegates => {
                                                                                                  this.delegates = delegates;
                                                                                                            });
      });
                                                                                                this._projectService.getActivities(this.projectApp.id).subscribe( activities => {
                                                                                                      this.activitiesProject = activities;
                                                                                                      this.allstartdates = [];
                                                                                                      this.allenddates = [];
                                                                                                      this.activitiesProject.forEach(activity => {
                                                                                                        /* this.allstartdates.push(new Date(activity.startDate['seconds'] * 1000));
                                                                                                        this.allenddates.push(new Date(activity.endDate['seconds'] * 1000)); */
                                                                                                        activity.startDate = new Date(activity.startDate['seconds'] * 1000);
                                                                                                        activity.endDate = new Date(activity.endDate['seconds'] * 1000);
                                                                                                      });
                                                                                                      // tslint:disable-next-line:prefer-for-of
                                                                                                      for (let i = 0; i < this.activitiesProject.length; i++) {
                                                                                                              this._projectService.getTasks(this.projectApp.id, this.activitiesProject[i].id).subscribe(tasks => {
                                                                                                                 this.activitiesProject[i].tasks = tasks;
                                                                                                                 /// console.log(this.activitiesProject[i]);
                                                                                                                 // tslint:disable-next-line:prefer-for-of
                                                                                                                 for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                                                                                                                     this.activitiesProject[i].tasks[j].startDate = new Date(this.activitiesProject[i].tasks[j].startDate['seconds'] * 1000);
                                                                                                                     this.activitiesProject[i].tasks[j].endDate = new Date(this.activitiesProject[i].tasks[j].endDate['seconds'] * 1000);
                                                                                                                    }
                                                                                                        });
                                                                                                        }
      });
    });
    // this.activitiesProject[0].active = false;
  }

  toggleSection(index) {
    this.activitiesProject[index].active = !this.activitiesProject[index].active;

    if (this.automaticClose && this.activitiesProject[index].active) {
      this.activitiesProject
      .filter((item, itemIndex) => itemIndex !== index)
      .map(item => item.active = false);
    }
  }


  toggleItem(index, childIndex) {
    this.activitiesProject[index].tasks[childIndex].active = !this.activitiesProject[index].tasks[childIndex].active;
  }


  async openActivity() {
    try {
      const modal = await this.modalCtrl.create({
        component: ModalActivityPage,
        componentProps: {
          /* members: this.usersAppFilter, */
          project: this.projectApp,
          activity: null,
          result: false
        }
      });

      await modal.present();

      const { data } = await modal.onDidDismiss();
      console.log(data);
      const alert = await this.alertCtrl.create({
        header: 'Exito',
        subHeader: 'Actividad agregada con exito',
        buttons: ['Aceptar']
      });

      if ( data != null) {
        let act: Activity = null;
        act = data['activity'] ;
        this._projectService.setActivitiestoProject(this.projectApp.id, act);
        if (data['result']) { await alert.present(); }
      }

    } catch (error) {
        console.log(error);
    }
  }

  async editActivity(activityAux: Activity) {
    try {
      const modal = await this.modalCtrl.create({
        component: ModalActivityPage,
        componentProps: {
          /* members: this.usersAppFilter, */
          project: this.projectApp,
          activity: activityAux,
          result: false
        }
      });

      await modal.present();

      const { data } = await modal.onDidDismiss();
      console.log(data);
      const alert = await this.alertCtrl.create({
        header: 'Exito',
        subHeader: 'Actividad editada con exito',
        buttons: ['Aceptar']
      });

      if ( data != null) {
        let act: Activity = null;
        act = data['activity'] ;
        console.log(act);
        this._projectService.updateActivity(this.projectApp.id, act.id , act);
        if (data['result']) { await alert.present(); }
      }

    } catch (error) {
        console.log(error);
    }
  }





  async editTask(activityAux: Activity, taskAux: Task) {
    try {
    const modal = await this.modalCtrl.create({
      component: ModalTaskPage,
      componentProps: {
        members: this.delegates,
        activity: activityAux,
        task: taskAux,
        result: false
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log(data);

    const alert = await this.alertCtrl.create({
      header: 'Exito',
      subHeader: 'Tarea editada con exito',
      buttons: ['Aceptar']
    });

    if ( data != null) {
      let tsk: Task = null;
      tsk = data['task'] ;
      this._projectService.updateTask(this.projectApp.id, activityAux.id, tsk.id, tsk);
      console.log(tsk);
      if (data['result']) { await alert.present(); }
    }

  } catch (error) {
    console.log(error);
}


    /* if ( data != null) {
      let users: User [] = [];
      users = data['newMembers'] ;
      console.log(users) ;
      this.teamService.addDelegates(this.teamGugo, users);
    } */
  }

  async openTask(activityAux: Activity) {
    try {
    const modal = await this.modalCtrl.create({
      component: ModalTaskPage,
      componentProps: {
        members: this.delegates,
        activity: activityAux,
        newMembers: null
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log(data);

    const alert = await this.alertCtrl.create({
      header: 'Exito',
      subHeader: 'Tarea agregada con exito',
      buttons: ['Aceptar']
    });

    if ( data != null) {
      let tsk: Task = null;
      tsk = data['task'] ;
      this._projectService.setTaskstoActivity(this.projectApp.id, activityAux.id, tsk);
      console.log(tsk);
      if (data['result']) { await alert.present(); }
    }

  } catch (error) {
    console.log(error);
}
  }

  async openEvidence(taskAux: Task) {

    const modal = await this.modalCtrl.create({
      component: ModalEvidencegestorPage,
      componentProps: {
        /* members: this.usersAppFilter, */
        task: taskAux
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log(data);

    /* if ( data != null) {
      let users: User [] = [];
      users = data['newMembers'] ;
      console.log(users) ;
      this.teamService.addDelegates(this.teamGugo, users);
    } */
  }

}
