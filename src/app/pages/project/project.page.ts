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

automaticClose = false;


  constructor( private route: ActivatedRoute,
               private _projectService: ProjectService,
               private authService: AuthService,
               private router: Router,
               private router1: Router,
               public _teamService: TeamService ) {

              //  this.information = this.activitiesProject;
                 }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userApp = user); });
    this._projectService.getProject(this.id).subscribe(project => {
                                                                                                this.projectApp = project;
                                                                                                this.projectApp.start_date = new Date(this.projectApp.start_date['seconds'] * 1000);
                                                                                                this.projectApp.end_date = new Date(this.projectApp.end_date['seconds'] * 1000);
                                                                                                this.differenceTime = Math.abs(this.projectApp.end_date.getTime() - this.projectApp.start_date.getTime());
                                                                                                this.differenceDays = Math.ceil(this.differenceTime / (1000 * 3600 * 24));
                                                                                                // console.log(this.differenceDays);
                                                                                                this._teamService.getTeam(this.projectApp.teamId).subscribe(team => {
                                                                                                this.team = team;
                                                                                                this._teamService.getDelegates(this.team).subscribe(delegates => {
                                                                                                  this.delegates = delegates;
                                                                                                            });
      });
                                                                                                this._projectService.getActivities(this.projectApp).subscribe( activities => {
                                                                                                      this.activitiesProject = activities;
                                                                                                      this.allstartdates = [];
                                                                                                      this.allenddates = [];
                                                                                                      this.activitiesProject.forEach(activity => {
                                                                                                        this.allstartdates.push(new Date(activity.start_date['seconds'] * 1000));
                                                                                                        this.allenddates.push(new Date(activity.end_date['seconds'] * 1000));
                                                                                                      });
                                                                                                      // tslint:disable-next-line:prefer-for-of
                                                                                                      for (let i = 0; i < this.activitiesProject.length; i++) {
                                                                                                              this._projectService.getTasks(this.projectApp.id, this.activitiesProject[i].id).subscribe(tasks => {
                                                                                                                 this.activitiesProject[i].tasks = tasks;
                                                                                                                 /// console.log(this.activitiesProject[i]);
                                                                                                                 // tslint:disable-next-line:prefer-for-of
                                                                                                                 for (let j = 0; j < this.activitiesProject[i].tasks.length; j++) {
                                                                                                                     this.activitiesProject[i].tasks[j].start_date = new Date(this.activitiesProject[i].tasks[j].start_date['seconds'] * 1000);
                                                                                                                     this.activitiesProject[i].tasks[j].end_date = new Date(this.activitiesProject[i].tasks[j].end_date['seconds'] * 1000);
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


}
