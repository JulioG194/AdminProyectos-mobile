import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import { Project } from 'src/app/models/project.interface';
import { Activity } from 'src/app/models/activity.interface';
import { Task } from 'src/app/models/task.interface';
import { Team } from 'src/app/models/team.interface';
import { User } from 'src/app/models/user.interface';
import { LoadingController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit, OnDestroy {
  post = false;
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


 // delegates: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa'];

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
  start_date: null,
  end_date: null,
  activity_time: 0
};

aux7: number;
information: any[];
data: any[] = [];
dataT: any[] = [];

public timelineChartData: any =  {
  chartType: 'Timeline',
  dataTable: this.dataT,
  options: {
            'title': 'Tasks',
            // width: 700,
            // height: 500,
            orientation: 'vertical',
            // chartArea: {width: '100%'},
            explorer: {axis: 'horizontal', keepInBounds: true},
            yAxis : {
              textStyle : {
                  fontSize: 7 // or the number you want
              }
          }
        }
   };
automaticClose = false;


  constructor( private route: ActivatedRoute,
               private screenOrientation: ScreenOrientation,
               private _projectService: ProjectService,
               private _teamService: TeamService,
               private _authService: AuthService,
               public loadingController: LoadingController ) {

              //  this.information = this.activitiesProject;

                 }


                async presentLoading() {
                  const loading = await this.loadingController.create({
                    message: 'Por favor espere...',
                    duration: 1000
                  });
                  await loading.present();
                  const { role, data } = await loading.onDidDismiss();

                }
  ngOnDestroy() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    // console.log(this.id);
    this.presentLoading();
    this._authService.getUser(this._authService.userAuth).subscribe(user => {(this.userApp = user); });
    this._projectService.getProject(this.id).subscribe(project => {
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
                                                                                                                             for (let index = 0; index <= this.data.length; index++) {
                                                                                                                                  if (index === 0) {
                                                                                                                                    this.dataT[index] = ['Role', 'Name', 'From', 'To'];
                                                                                                                                  } else {
                                                                                                                                    this.dataT[index] = this.data[index - 1];
                                                                                                                                    if ( index === this.data.length ) {
                                                                                                                                       break;
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                             this.timelineChartData =  {
                                                                                                                                  chartType: 'Timeline',
                                                                                                                                  dataTable: this.dataT,
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
                                                                                                                             console.log(this.dataT);
                                                                                                                    });
                                                                                                                    }
                                                                                                                    
                  });
                });
    {
                  setTimeout(() => { if (this.dataT.length > 1) { this.post = true; } }, 1000);
                }
  }

  setLandscape() {
    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  setPortrait() {
    // set to portrait
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }


}
