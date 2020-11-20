import { Component, OnInit, OnDestroy } from '@angular/core';
import { Label, Color } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { AuthService } from '../services/auth.service';
import { ProjectService } from '../services/project.service';
import { TeamService } from '../services/team.service';
import { User } from '../models/user.interface';
import { Team } from '../models/team.interface';
import { Project } from '../models/project.interface';
import { Activity } from '../models/activity.interface';
import { Task } from '../models/task.interface';
import { ModalController } from '@ionic/angular';
import { ModalProfilePage } from '../pages/modal-profile/modal-profile.page';
import { ModalProfilePageModule } from '../pages/modal-profile/modal-profile.module';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  post = true;
  show = false;
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
  projects: any [] = ['asdsd'];
  progressArray: number[] = [];
  teamAux: Team = {
  manager: ''
  };
  teamAux1: Team[] = [];

  projectsApp: Project[] = [];
  activitiesProjectsApp: Activity[] = [];
  tasksActivitiesApp: Task[] = [];
  results: any[] = [];


  dataProjects: number[] = [];
  tareas: Task[] = [];

  view: any[] = [700, 400];
  barData: number[] = [];
  labelBar: string[] = [];
  barData1: number[] = [];
  labelBar1: string[] = [];
// options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Porcentaje %';
  showYAxisLabel = true;
  yAxisLabel = 'Proyectos';

  colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  userObservable: Subscription;
  teamObservable: Subscription;
  projectObservable: Subscription;
  activityObservable: Subscription;
  taskObservable: Subscription;
  private ngUnsubscribe = new Subject();
  constructor(private authService: AuthService,
              private projectService: ProjectService,
              private router: Router,
              private teamService: TeamService,
              private modalCtrl: ModalController) {}


  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
      labels: {
        fontFamily: '\'Roboto\', sans-serif',
        fontSize: 10,
      }
    }
  };

  pieChartLabels: Label[] = ['Proyectos sin realizar', 'Proyectos completados', 'Proyectos en proceso'];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [ pluginDataLabels ];
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
          ticks:
                {
                  fontSize: 8, fontFamily: '\'Roboto\', sans-serif',
                  fontColor: '#ffffff',
                  fontStyle: '500'
                }
          }],
      xAxes: [{
          ticks: {
                  fontSize: 8,
                  fontFamily: '\'Roboto\', sans-serif',
                  fontColor: '#ffffff',
                  fontStyle: '500'}
          }]
    }
  };

  barChartLabels: Label[] = [];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = false;

  barChartData: ChartDataSets[] = [
    {
      data: this.barData
    },
  ];

  barChartColors: Color[] = [
    {
      backgroundColor: [
        'blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black', 'magenta', 'blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black', 'magenta'
      ]
    }
  ];

  ngOnInit() {

      this.home();
   }

  ngOnDestroy(): void {
   this.ngUnsubscribe.next();
   this.ngUnsubscribe.complete();
  }


  home() {
    return this.userObservable =  this.authService
    .getUser(this.authService.userAuth)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(user => {
      (this.userGugo = user);
      if ( this.userGugo.manager === true ) {
        this.teamObservable = this.teamService
                .getTeamByUser(this.userGugo)
                .subscribe(team => {
                    this.teamAux = team[0];
                    });
        this.projectObservable = this.projectService
                .getProjectByOwner(this.userGugo)
                .subscribe(projects => {
                            this.projectsApp = projects;
                            this.results = [];
                            this.barData1 = [];
                            this.barChartLabels = [];
                            this.barChartData[0].data = [];
                            this.projectsApp.forEach(project => {
                                  const gp: any = {
                                                  name: '',
                                                  value: 0
                                                };
                                  gp.name = project.name;
                                  gp.value = project.progress;
                                  this.results.push(gp);
                                  this.barChartData[0].data.push(gp.value);
                                  this.barChartLabels.push(gp.name);
                                  });
                            this.dataProjects = [];
                            let projectsInprogress = 0;
                            let projectsOut = 0;
                            let projectsCompleted = 0;
                            let id: string;
                            let aux9: number;
                            // tslint:disable-next-line: prefer-for-of
                            for (let index = 0; index < this.projectsApp.length; index++) {
                                this.activitiesProjectsApp = [];
                                let numeroActs: number;
                                let aux6: number;
                                let aux7: number;
                                let porcentajeActividad: number;
                                let numeroTasks: number;
                                let porcentajeTask: number;
                                let aux3: number;
                                let aux4: number;
                                let aux1: number;
                                this.activityObservable = this.projectService
                                .getActivities(this.projectsApp[index])
                                .subscribe(acts => {
                                        let aux8 = 0;
                                        this.activitiesProjectsApp = acts;
                                        numeroActs = this.activitiesProjectsApp.length;
                                        porcentajeActividad = 100 / numeroActs;
                                        aux6 = 100 / numeroActs;
                                        // tslint:disable-next-line:prefer-for-of
                                        for (let j = 0; j < this.activitiesProjectsApp.length; j++) {
                                            aux7 = this.activitiesProjectsApp[j].percentaje * aux6;
                                            aux8 += aux7;
                                            this.taskObservable = this.projectService.getTasks(this.activitiesProjectsApp[j].idProject,
                                                                         this.activitiesProjectsApp[j].id)
                                            .subscribe(tasks => {
                                                       let aux2 = 0;
                                                       this.tasksActivitiesApp = tasks;
                                                       if ( this.tasksActivitiesApp.length === 0 ) {
                                                          try {
                                                            this.projectService
                                                            .setActivityProgress(
                                                              this.projectsApp[index].id,
                                                              this.activitiesProjectsApp[j].id,
                                                              0);
                                                               } catch (error) {
                                                                 console.log(error);
                                                               }
                                                      } else {
                                                             numeroTasks = this.tasksActivitiesApp.length;
                                                             porcentajeTask = 100 / numeroTasks;
                                                            // tslint:disable-next-line:prefer-for-of
                                                             for (let k = 0; k < this.tasksActivitiesApp.length; k++) {
                                                                 aux1 = this.tasksActivitiesApp[k].progress * porcentajeTask;
                                                                 aux2 += aux1;
                                                                 aux3 = aux2 / 100;
                                                                 aux4 = +(aux3.toFixed(2));
                                                                 id = this.tasksActivitiesApp[k].idActivity;
                                                              }
                                                             try {
                                                                  this.projectService
                                                                  .setActivityProgress(this.projectsApp[index].id,
                                                                                        id,
                                                                                        aux4 );
                                                               } catch (error) {
                                                                  console.log(error);
                                                               }
                                                        }
                                                       });
                                                      }
                                        aux9 = +((aux8 / 100).toFixed(2));
                                        try {
                                              this.projectService
                                              .setProjectProgress( this.projectsApp[index].id , aux9 );
                                         } catch (error) {
                                           console.log(error);
                                         }
                                });
                                if ( this.projectsApp[index].progress === 100 ) {
                                    projectsCompleted++;
                                } else if ( (this.projectsApp[index].progress > 0) && (this.projectsApp[index].progress < 100) ) {
                                    projectsInprogress++;
                                } else if (this.projectsApp[index].progress === 0) {
                                    projectsOut++;
                                }
                             }
                            this.dataProjects.push(projectsOut);
                            this.dataProjects.push(projectsCompleted);
                            this.dataProjects.push(projectsInprogress);
                            this.pieChartData = this.dataProjects;
});
}});
  }

  doRefresh(event) {
    setTimeout(() => {
         this.home();
         event.target.complete();
          }, 2000);
  }

  async openProfile() {

    const modal = await this.modalCtrl.create({
      component: ModalProfilePage,
      componentProps: {
        /* members: this.usersAppFilter, */
        user: this.userGugo,
        newProfile: null
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

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/register').then(() => {
      location.reload();
    });
  }

}
