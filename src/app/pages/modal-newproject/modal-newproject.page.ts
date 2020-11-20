import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Project } from 'src/app/models/project.interface';
import * as firebase from 'firebase/app';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import { Team } from 'src/app/models/team.interface';
import { NgForm } from '@angular/forms';

// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2/src/sweetalert2.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-newproject',
  templateUrl: './modal-newproject.page.html',
  styleUrls: ['./modal-newproject.page.scss'],
})
export class ModalNewprojectPage implements OnInit, OnDestroy {

  mainObservable: Subscription;
  minDate = new Date();
  projectApp: Project = {
    name: '',
    client: '',
    description: '',
    start_date: null,
    end_date: null,
    type: '',
    teamId: '',
    ownerId: '',
    progress: 0,
    status: 'Por Realizar',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
  constructor(private modalCtrl: ModalController,
              public projectService: ProjectService,
              public authService: AuthService,
              public teamService: TeamService,
              private alertCtrl: AlertController,
              public loadingController: LoadingController) { }

  @Input() user;
  @Input() newProject;
  @Input() project;

  minD: string;
  maxD: any;
  isDisabled = false;
  newProj: Project;
  startDate: string;
  endDate: string;
  teamsObservable: any;
              teamAux: Team = {
                    manager: ''
              };

  ngOnInit() {
    this.mainObservable = this.authService.getUser(this.authService.userAuth)
                                          .subscribe(user => {(this.projectApp.ownerId = user.uid);
                                                              this.teamService.getTeamByUser(user)
                                          .subscribe(team => {this.teamsObservable = team;
                                                              this.teamsObservable.map((a: Team) => this.teamAux = a);
                                                              this.projectApp.teamId = this.teamAux.id;
                                           });
                                           });
    if (this.project) {
      this.projectApp = this.project;
      this.startDate = this.projectApp.start_date.toISOString().slice(0, 10);
      this.endDate = new Date(this.projectApp.end_date.getTime() - (this.projectApp.end_date.getTimezoneOffset() * 60000 ))
      .toISOString()
      .split('T')[0];
      this.startDate = new Date(this.projectApp.start_date.getTime() - (this.projectApp.start_date.getTimezoneOffset() * 60000 ))
      .toISOString()
      .split('T')[0];

      this.minD = this.projectApp.start_date.toISOString().slice(0, 10);
      this.maxD = (new Date()).getFullYear() + 3;
      this.isDisabled = true;
    } else {
      // this.minD = new Date().toTimeString().slice(0, 10);
      const date = new Date();
      this.minD = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split('T')[0];
      this.maxD = (new Date()).getFullYear() + 3;
    }
    console.log(this.projectApp);

  }

  ngOnDestroy() {
    // this.mainObservable.unsubscribe();
  }


  onClose() {
    this.modalCtrl.dismiss();
  }

  print() {
    this.modalCtrl.dismiss({
      newProject: this.projectApp
  });
    console.log(this.projectApp);
  }

 /*  async onSave() {
    if (this.newMemb.length > 0) {
      this.modalCtrl.dismiss({
        members: this.members,
        newMembers: this.newMemb
    });
} else {
  let alert = await this.alertCtrl.create({
    header: 'Error',
    subHeader: 'No has seleccionado ningun delegado',
    buttons: ['Aceptar']
  });
  await alert.present();
}
} */

async onSaveProject( form: NgForm ) {

  if ( form.invalid ) { return; }

  if ( this.endDate <= this.startDate ) {

     /*  Swal.fire({
        icon: 'error',
        title: 'Fechas fuera de rango',
      }); */
      // tslint:disable-next-line:no-shadowed-variable
      const alert = await this.alertCtrl.create({
        header: 'Error',
        subHeader: 'Fechas fuera de rango',
        buttons: ['Aceptar']
      });
      await alert.present();
      return;
  }

  /* Swal.fire({
    allowOutsideClick: false,
    icon: 'info',
    text: 'Espere por favor...'
  });
  Swal.showLoading(); */

  const loading = await this.loadingController.create({
    message: 'Espere por favor',
    duration: 1000
  });

  await loading.present();

  // this.projectApp.start_date = new Date(this.startDate);

  const endDateString = this.endDate.split('T')[0];
  const partsEndDate: any = endDateString.split('-');
  const endDate = new Date( partsEndDate[0], partsEndDate[1] - 1, partsEndDate[2]);
  this.projectApp.end_date = endDate;

  const startDateString = this.startDate.split('T')[0];
  const partsStartDate: any = startDateString.split('-');
  const startDate = new Date( partsStartDate[0], partsStartDate[1] - 1, partsStartDate[2]);
  this.projectApp.start_date = startDate;
  // this.projectService.addNewProject( this.projectApp );
  this.modalCtrl.dismiss({
    newProject: this.projectApp
});

  /* Swal.close();
  Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: 'Proyecto creado con exito'
    }); */
  const alert = await this.alertCtrl.create({
      header: 'Exito',
      subHeader: 'Proyecto agregado con exito',
      buttons: ['Aceptar']
    });
  await alert.present();


  }

}
