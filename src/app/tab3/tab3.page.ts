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

export interface DialogData {
  projectAppId: string;
  minDate: Date;
  maxDate: Date;
  userApp: User;
}

export interface EvidenceData {
  tid: string;
  user: User;
}

export interface PAT {
  project: Project;
  activity: Activity;
  task: Task;
  start_date: Date;
  end_date: Date;
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

  constructor(public authService: AuthService,
              public projectService: ProjectService,
              public teamService: TeamService,
              private router1: Router,
              private router: Router,
              private alertCtrl: AlertController,
              private navCtrl: NavController,
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
                start_date: new Date(),
                end_date: new Date(),
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
                start_date: null,
                end_date: null,
                photo: ''
              };
              value = '';

              ngOnInit() {
                // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
                this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userApp = user, this.idUser = user.uid);
                                                                                       if ( this.userApp.manager === true ) {
                                                                                            this.teamService.getTeamByUser(this.userApp).subscribe(team => {
                                                                                                this.teamAux1 = team;
                                                                                              //  console.log(this.teamAux1);
                                                                                                this.teamAux1.forEach(team => {
                                                                                                this.teamAux = team;
                                                                                              //  console.log(this.teamAux);
                                                                                            });
                                                                                            });
                                                                                            /* if ( this.teamAux.manager !== null ) {
                                                                                            console.log('hola');
                                                                                            } */
                                                                                            this.projectService.getProjectByOwner(this.userApp)
                                                                                            .subscribe(projects => {
                                                                                              this.projectsApp = projects;
                                                                                              // console.log(this.projectsApp);
                                                                                              this.allstartdates = [];
                                                                                              this.allenddates = [];
                                                                                              this.projectsApp.forEach(project => {
                                                                                                this.allstartdates.push(new Date(project.start_date['seconds'] * 1000));
                                                                                                this.allenddates.push(new Date(project.end_date['seconds']* 1000));
                                                                                                // console.log(this.allstartdates);
                                                                                                // console.log(this.allenddates);
                                                                                                this.activitiesProjectsApp = [];
                                                                                                this.projectService.getActivities(project).subscribe(activities => {
                                                                                                  this.activitiesProjectsApp = activities;
                                                                                                  this.activitiesProjectsApp.forEach(activity => {
                                                                                                    this.tasksActivitiesApp = [];
                                                                                                    this.projectService.getTasks(project.id, activity.id).subscribe( tasks => {
                                                                                                      this.tasksActivitiesApp = tasks;
                                                                                                    //  console.log(this.tasksActivitiesApp);
                                                                                                    });
                                                                                                  });
                                                                                                //  console.log(this.activitiesProjectsApp);
                                                                                                });
                                                                                              });
                                                                                            //  console.log(this.projectsApp);
                                                                                            });
                                                                                        } else {
                                                                                          console.log('ud es delegado');
                                                                                          this.teamGugo.delegates = [];
                                                                                          this.teamService.getTeams().subscribe(teams => {
                                                                                              this.teamsAux = teams;
                                                                                              this.teamsAux.forEach(team => {
                                                                                                  this.teamService.getDelegates(team).subscribe(delegates => {
                                                                                                         // tslint:disable-next-line:prefer-for-of
                                                                                                         team.delegates = delegates;
                                                                                                         team.delegates.forEach(delegate => {
                                                                                                             if ( delegate.email === this.userApp.email ) {
                                                                                                                 this.teamGugoAux = team;
                                                                                                                 console.log(this.teamGugoAux);
                                                                                                                 this.projectService.getProjectByTeam(this.teamGugoAux)
                                                                                                                 .subscribe(projects => {
                                                                                                                   this.projectsApp = projects;
                                                                                                                   console.log(this.projectsApp);
                                                                                                                   this.allstartdates = [];
                                                                                                                   this.allenddates = [];
                                                                                                                   this.projectsApp.forEach(project => {
                                                                                                                     this.allstartdates.push(new Date(project.start_date['seconds'] * 1000));
                                                                                                                     this.allenddates.push(new Date(project.end_date['seconds'] * 1000));
                                                                                                                     let userAux: User = {
                                                                                                                      uid: '',
                                                                                                                      displayName: '',
                                                                                                                      email: '',
                                                                                                                      photoURL: ''
                                                                                                                  };
                                                                                                                     this.authService.getUserById(project.ownerId).subscribe( user => {
                                                                                                                        userAux = user;
                                                                                                                     // console.log(this.allstartdates);
                                                                                                                     // console.log(this.allenddates);

                                                                                                                    // this.activitiesProjectsApp = [];
                                                                                                                        this.projectService.getActivities(project).subscribe(activities => {
                                                                                                                       this.activitiesProjectsApp = activities;
                                                                                                                       console.log(this.activitiesProjectsApp);
                                                                                                                       this.activitiesProjectsApp.forEach(activity => {
                                                                                                                        // this.tasksActivitiesApp = [];
                                                                                                                       //  this.activitiesDelegate = [];
                                                                                                                      //   this.projectsOfDelegate = [];
                                                                                                                         this.projectService.getTasks(project.id, activity.id).subscribe( tasks => {
                                                                                                                           console.log(tasks);
                                                                                                                           tasks.forEach(task => {

                                                                                                                             if ( task.delegate.email === this.userApp.email ) {
                                                                                                                              if ( task.idActivity === activity.id) {
                                                                                                                                if ( activity.idProject === project.id ) {

                                                                                                                                  // tslint:disable-next-line:no-shadowed-variable

                                                                                                                                       this.pat = {
                                                                                                                                        project,
                                                                                                                                        activity,
                                                                                                                                        task,
                                                                                                                                        start_date: new Date(task.start_date['seconds'] * 1000),
                                                                                                                                        end_date: new Date(task.end_date['seconds'] * 1000),
                                                                                                                                        photo : userAux.photoURL,
                                                                                                                                        manager_name: userAux.displayName
                                                                                                                                      };
                                                                                                                                       this.pats.push(this.pat);

                                                                                                                                       console.log(this.pat);

                                                                                                                              }
                                                                                                                            }
                                                                                                                         }
                                                                                                                           });
                                                                                                                           this.tasksActivitiesApp1 = [];
                                                                                                                           this.activitiesDelegate1 = [];
                                                                                                                           this.projectsOfDelegate1 = [];
                                                                                                                           this.pats1 = [];
                                                                                                                           this.removeDuplicates();

                                                                                                                           console.log(this.pats1);
                                                                                                                           /* console.log(this.tasksActivitiesApp1);
                                                                                                                           console.log(this.activitiesDelegate1);
                                                                                                                           console.log(this.projectsOfDelegate1); */
                                                                                                                         });
                                                                                                                       });
                                                                                                                     //  console.log(this.activitiesProjectsApp);
                                                                                                                     });
                                                                                                                   });
                                                                                                                 //  console.log(this.projectsApp);
                                                                                                                });
                                                                                                                 });
                                                                                                             }
                                                                                                         });
                                                                                              });
                                                                                          });
                                                                                          });
                                                                                        }

                });

               // this.projectService.setActivitiestoProject(this.projectAux, this.activityAux);
              }

              removeDuplicates() {
                const uniqueObject = {};
                // tslint:disable-next-line:forin
                for (const i in this.pats) {
                    const objId = this.pats[i].task.id;
                    uniqueObject[objId] = this.pats[i];
                }

                // tslint:disable-next-line:forin
                for (const i in uniqueObject) {
                    this.pats1.push(uniqueObject[i]);
                }
                try {
                  this.pats1.sort((a, b) => a.task.createdAt.seconds - b.task.createdAt.seconds);
                  this.pats1.forEach(chat => {
                  });
                } catch {}
              }

              onEnter(idP: string, idA: string, idT: string, value: string) {
                this.value = value;
                if ( +this.value > 0 && +this.value <= 100) {
                  this.projectService.setTaskProgress(idP, idA, idT, +(this.value));
                } else {
                  console.log('numero ingresado incorrecto');
                }
              }

              async press() {
                let alert = await this.alertCtrl.create({
                  header: 'Error',
                  subHeader: 'No has seleccionado ningun delegado',
                  buttons: ['Aceptar']
                });
                await alert.present();
              }

              projectRoute( idProject: string) {
                  // this.navCtrl.navigateRoot( 'tabs/tabs/tab3/project', { animated: true } );
                    this.navCtrl.navigateForward(`tabs/tabs/tab3/project/${idProject}`, { animated: true });
              }

}
