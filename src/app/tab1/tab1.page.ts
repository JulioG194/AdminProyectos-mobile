import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  post = true;
  show = false;
  userGugo: User = {
    name: '',
    email: '',
    password: '',
    id: '',
    birthdate: new Date(),
    description: '',
    gender: '',
    photo: '',
    manager: false,
    google: false,
    phone_number: ''
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
public tareas: Task[] = [];

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

  constructor(private authService: AuthService,
              private projectService: ProjectService,
              private teamService: TeamService) {}

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    }
  };
  public pieChartLabels: Label[] = ['Proyectos sin realizar', 'Proyectos completados', 'Proyectos en proceso'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'horizontalBar';
  public barChartLegend = false;

  public barChartData: ChartDataSets[] = [
    { data: this.barData },
  ];

  public barChartColors: Color[] = [
    { backgroundColor: ['blue', 'green', 'red', 'yellow', 'purple', 'grey', 'black', 'magenta'] }
  ];

  ngOnInit() {

    this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userGugo = user);
                                                                           if ( this.userGugo.manager === true ) {
        this.teamService.getTeamByUser(this.userGugo).subscribe(team => {
            this.teamAux1 = team;
            this.teamAux1.forEach(team => {
            this.teamAux = team;
        });
        });
        // this.results = [];
        this.projectService.getProjectByOwner(this.userGugo)
        .subscribe(projects => {
          this.projectsApp = projects;
          this.results = [];
          this.barData1 = [];
          //this.labelBar1 = [];
          this.barChartLabels = [];
          this.barChartData[0].data = [];
          this.projectsApp.forEach(proj => {
            const gp: any = {
              name: '',
              value: 0
            };
          //  const gp: any = {
            gp.name = proj.name;
            gp.value = proj.progress;
          //  };
            this.results.push(gp);
            // this.barData1.push(gp.value);
            // this.labelBar1.push(gp.name);
            this.barChartData[0].data.push(gp.value);
            this.barChartLabels.push(gp.name);
           /*  this.barData.forEach(g => {
              if (!this.barData.some(obj => obj === g)) {
                 this.barData.push(g);
              }
            });
            this.labelBar.forEach(g => {
              if (!this.labelBar.some(obj => obj === g)) {
                 this.labelBar.push(g);
              }
            }); */
            /* this.barData = this.barData.filter((elem, i, arr) => {
              if (this.barData.indexOf(elem) === i) {
                return elem;
              }
            });
            this.labelBar = this.labelBar.filter((elem, i, arr) => {
              if (this.labelBar.indexOf(elem) === i) {
                return elem;
              }
            }); */
          });
          console.log(this.barData);
          this.dataProjects = [];
          let projectsInprogress = 0;
          let projectsOut = 0;
          let projectsCompleted = 0;
          let id: string;
          let aux9: number;
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < this.projectsApp.length; index++) {
            // tslint:disable-next-line:no-unused-expression
            this.projectsApp[index].progress;
            this.activitiesProjectsApp = [];
            let numeroActs: number;
            let aux6: number;
            let aux7: number;
            let porcentajeActividad: number;
            let numeroTasks: number;
            let porcentajeTask: number;
            let aux3: number;
            let aux4: number;
            let aux5: number;
            let aux1: number;
            this.projectService.getActivities(this.projectsApp[index]).subscribe(acts => {
                let aux8 = 0;
                this.activitiesProjectsApp = acts;
                numeroActs = this.activitiesProjectsApp.length;
                porcentajeActividad = 100 / numeroActs;
                aux6 = 100 / numeroActs;
                // tslint:disable-next-line:prefer-for-of
                for (let j = 0; j < this.activitiesProjectsApp.length; j++) {
                  aux7 = this.activitiesProjectsApp[j].percentaje * aux6;
                  aux8 += aux7;
                  this.projectService.getTasks(this.activitiesProjectsApp[j].idProject, this.activitiesProjectsApp[j].id).subscribe(tasks => {
                       let aux2 = 0;
                       this.tasksActivitiesApp = tasks;
                       if ( this.tasksActivitiesApp.length === 0 ) {
                        try {
                          this.projectService.setActivityProgress(this.projectsApp[index].id, this.activitiesProjectsApp[j].id, 0 );
                         } catch {}
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
                          this.projectService.setActivityProgress(this.projectsApp[index].id, id, aux4 );
                         } catch {}
                       }
                   });
                }
                aux9 = +((aux8 / 100).toFixed(2));
                try {
                  this.projectService.setProjectProgress( this.projectsApp[index].id , aux9 );
                 } catch {}
            });
            if ( this.projectsApp[index].progress === 100 ) {
              projectsCompleted++;

            } else if ( (this.projectsApp[index].progress > 0) && (this.projectsApp[index].progress < 100) ) {
              projectsInprogress++;
              // this.dataProjects.push(projectsInprogress);

            } else if (this.projectsApp[index].progress === 0) {
              projectsOut++;
             // this.dataProjects.push(projectsOut);

            }
         }
          this.dataProjects.push(projectsOut);
          this.dataProjects.push(projectsCompleted);
          this.dataProjects.push(projectsInprogress);

          this.pieChartData = this.dataProjects;
        });
    }} );
   }
   public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  onSelect(event) {
    console.log(event);
  }
  shower() {
    this.show = true;
    this.barData = this.barData1;
    this.labelBar = this.labelBar1;
    console.log(this.barData);
  }

}
