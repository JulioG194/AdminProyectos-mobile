import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Activity } from '../models/activity.interface';
import { Task } from '../models/task.interface';
import { Team } from '../models/team.interface';
import { User } from '../models/user.interface';
import { Project } from '../models/project.interface';
import { ProjectService } from '../services/project.service';
import { TeamService } from '../services/team.service';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {

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
difDyas: number[] = [];
post = false;
allstartdates: Date[] = [];
allenddates: Date[] = [];
allstartdatesT: Date[] = [];
allenddatesT: Date[] = [];
    projects: Project[] = [];
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
projectApp: Project = {
      name: '',
      client: '',
      description: '',
      start_date: new Date(),
      end_date: new Date(),
      type: '',
      teamId: '',
      ownerId: '',
      status: 'To Do'
};
projects1: any[] = [{ 
  name:'Proyecto1',
  fecha:'10/02/2020',
  dias:'2',
  porcentaje:'80'
},
{
  name:'Proyecto2',
  fecha:'11/02/2020',
  dias:'4',
  porcentaje:'50'
},
{
  name:'Proyecto3',
  fecha:'15/02/2020',
  dias:'5',
  porcentaje:'75'
},
{
  name:'Proyecto3',
  fecha:'15/02/2020',
  dias:'15',
  porcentaje:'100'
}
];
// idUser: String;
teamsObservable: any;
projectsAux: Project[];
teamAux: Team = {
      manager: ''
};
idUser: string;
startD: Date;
endD: Date;
minDate = new Date();

automaticClose = false;
  constructor(private screenOrientation: ScreenOrientation,
              private _projectService: ProjectService,
              private _teamService: TeamService,
              private _authService: AuthService,
              private navCtrl: NavController) {
    // get current
  // console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

    }

  data: any[] = [];
  dataT: any[] = [];
  data2 = [ 'Tarea numero uno y dos',  new Date(2020, 2, 4),  new Date(2020, 8, 4) ];
  data3 = [ 'la ultima tarea de ka actividad',  new Date(2020, 1, 1),  new Date(2020, 2, 12) ];
  data4 = [ 'la ultimisima tarea de ka actividad',  new Date(2020, 8, 4),  new Date(2020, 10, 12) ];
  public timelineChartData: any =  {
    chartType: 'Timeline',
    dataTable: '',
    options: {
              'title': 'Tasks',
              width: 700,
              height: 500,
              orientation: 'vertical',
              chartArea: {width: '100%'},
              explorer: {axis: 'horizontal', keepInBounds: true},
              yAxis : {
                textStyle : {
                    fontSize: 7 // or the number you want
                }
            }
          }
     };

 ngOnInit() {
  this._authService.getUser(this._authService.userAuth)
  .subscribe(user => {(this.userApp = user, this.idUser = user.uid);
                      this._teamService.getTeamByUser(this.userApp)
                      .subscribe(team => {
                                          this.teamsObservable = team;
                                          this.teamsObservable.map((a: Team) =>
                                          this.teamAux = a);
                                          this.teamAux.delegates = [];
                                          this._teamService.getDelegates(this.teamAux)
                                          .subscribe(delegates => {
                                                                  this.teamAux.delegates = delegates;
                                                                              });
                                          this.projectApp.teamId = this.teamAux.id;
                                          this._projectService.getProjectByOwner(this.userApp)
                                          .subscribe(projects => {
                                                                this.projectsAux = projects;
                                                                this.difDyas = [];
                                                                this.allenddates = [];
                                                                this.allstartdates = [];
                                                                this.projectsAux.forEach(project => {
                                                                  this.startD = new Date();
                                                                  this.endD = new Date(project.end_date['seconds'] * 1000);
                                                                  this.allenddates.push(this.endD);
                                                                  this.differenceTime = Math.abs(this.endD.getTime() - this.startD.getTime());
                                                                  this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                  // console.log(this.differenceDays);
                                                                  this.difDyas.push(this.differenceDays);
                                                                });
                                                                // console.log(this.projectsAux);
                                                                /* this.refresh.next(); */
                                          });
  });
  });
  // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
 /*  this.data.push(this.data3);
  this.data.push(this.data2);
  this.data.push(this.data4); */
}
setLandscape() {
  // set to landscape
  this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
}
setPortrait() {
  // set to portrait
  this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
}
projectRoute( idProject: string) {
  // this.navCtrl.navigateRoot( 'tabs/tabs/tab3/project', { animated: true } );
     this.navCtrl.navigateForward(`tabs/tabs/tab4/schedule/${idProject}`, { animated: true });
    // this.post = true;
}

toggleSection(index, idProject: string) {
  this.projectsAux[index].active = !this.projectsAux[index].active;
  if (this.automaticClose && this.projectsAux[index].active) {
    this.activitiesProject
    .filter((item, itemIndex) => itemIndex !== index)
    .map(item => item.active = false);
  }

  if ( this.projectsAux[index].active ) {
    this.dataT = [];
    this._authService.getUser(this._authService.userAuth).subscribe(user => {(this.userApp = user); });
    this._projectService.getProject(idProject).subscribe(project => {
                                                                                                          this.projectApp = project;
                                                                                                          this.projectApp.start_date = new Date(this.projectApp.start_date['seconds'] * 1000);
                                                                                                          this.projectApp.end_date = new Date(this.projectApp.end_date['seconds'] * 1000);
                                                                                                         /*  this.differenceTime = Math.abs(this.projectApp.end_date.getTime() - this.projectApp.start_date.getTime());
                                                                                                          this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                                                          console.log(this.differenceDays); */
                                                                                                          this._teamService.getTeam(this.projectApp.teamId).subscribe(team => {
                                                                                                          this.team = team;
                                                                                                          this._teamService.getDelegates(this.team).subscribe(delegates => {
                                                                                                            this.delegates = delegates;
                                                                                                                      });
                });
                                                                                                          this._projectService.getActivities(this.projectApp).subscribe( activities => {
                                                                                                                this.activitiesProject = activities;
                                                                                                                this.data = [];
                                                                                                                /* this.allstartdates = [];
                                                                                                                this.allenddates = []; */
                                                                                                                /* this.activitiesProject.forEach(activity => {
                                                                                                                  this.allstartdates.push(new Date(activity.start_date['seconds'] * 1000));
                                                                                                                  this.allenddates.push(new Date(activity.end_date['seconds'] * 1000));
                                                                                                                }); */
                                                                                                                // this.data = [];
                                                                                                                // tslint:disable-next-line:prefer-for-of
                                                                                                                for (let i = 0; i < this.activitiesProject.length; i++) {
                                                                                                                        this._projectService.getTasks(this.projectApp.id, this.activitiesProject[i].id).subscribe(tasks => {
                                                                                                                           this.activitiesProject[i].tasks = tasks;
                                                                                                                           // console.log(this.activitiesProject[i]);
                                                                                                                           // tslint:disable-next-line:prefer-for-of
                                                                                                                           for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                                                                                                                               this.activitiesProject[i].tasks[j].start_date = new Date(this.activitiesProject[i].tasks[j].start_date['seconds'] * 1000);
                                                                                                                               this.activitiesProject[i].tasks[j].end_date = new Date(this.activitiesProject[i].tasks[j].end_date['seconds'] * 1000);
                                                                                                                               let data: any[] = [];
                                                                                                                               data = [ this.activitiesProject[i].name, this.activitiesProject[i].tasks[j].name,  this.activitiesProject[i].tasks[j].start_date, this.activitiesProject[i].tasks[j].end_date ];
                                                                                                                               this.data.push(data);
                                                                                                                              }
                                                                                                                           let dataTe: any[] = [];
                                                                                                                           // tslint:disable-next-line:no-shadowed-variable
                                                                                                                           for (let index = 0; index <= this.data.length; index++) {
                                                                                                                                
                                                                                                                                if (index === 0) {
                                                                                                                                  dataTe[index] = ['Role', 'Name', 'From', 'To'];
                                                                                                                                } else {
                                                                                                                                  dataTe[index] = this.data[index - 1];
                                                                                                                                }
                                                                                                                                if ( index === this.data.length ) {
                                                                                                                                  this.timelineChartData =  {
                                                                                                                                    chartType: 'Timeline',
                                                                                                                                    dataTable: dataTe,
                                                                                                                                    options: {
                                                                                                                                              'title': 'Tasks',
                                                                                                                                              width: 700,
                                                                                                                                              height: 500,
                                                                                                                                              orientation: 'vertical',
                                                                                                                                              chartArea: {width: '100%'},
                                                                                                                                              explorer: {axis: 'horizontal', keepInBounds: true},
                                                                                                                                              yAxis : {
                                                                                                                                                textStyle : {
                                                                                                                                                    fontSize: 7 // or the number you want
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                          }
                                                                                                                                     };
                                                                                                                               }

                                                                                                                              }

                                                                                                                           // console.log(dataTe);
                                                                                                                          
                                                                                                                  });

                                                                                                                  }
                });
              });
  }
  this.dataT = [];
  {
    setTimeout(() => { this.post = true; }, 1000);
  }
  this.post = false;
}

}
