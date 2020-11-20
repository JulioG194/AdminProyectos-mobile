import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { Activity } from 'src/app/models/activity.interface';
import * as firebase from 'firebase/app';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-modal-activity',
  templateUrl: './modal-activity.page.html',
  styleUrls: ['./modal-activity.page.scss'],
})
export class ModalActivityPage implements OnInit {

  activityProject: Activity = {
    name: '',
    status: 'Por Realizar',
    percentaje: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  constructor(private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              public loadingController: LoadingController) { }

  @Input() project;
  @Input() activity;
  @Input() result;

  startDate: string;
  endDate: string;
  minD: string;
  maxD: string;

  ngOnInit() {
    // console.log(this.project);
    // console.log(this.minD);
   // console.log(this.maxD);

    if (this.activity) {
        this.activityProject = this.activity;
        console.log(this.activityProject);
        // this.startDate = this.activityProject.start_date.toISOString().slice(0, 10);
        // this.endDate = this.activityProject.end_date.toISOString().slice(0, 10);
        this.startDate = new Date(this.activityProject.start_date.getTime() - (this.activityProject.start_date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split('T')[0];
        this.endDate = new Date(this.activityProject.end_date.getTime() - (this.activityProject.end_date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split('T')[0];
        this.minD = this.project.start_date.toISOString().slice(0, 10);
        this.maxD = this.project.end_date.toISOString().slice(0, 10);
    } else {
       this.minD = this.project.start_date.toISOString().slice(0, 10);
       this.maxD = this.project.end_date.toISOString().slice(0, 10);
    }
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  async onSaveActivity( form: NgForm ) {

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
      duration: 500
    });

    await loading.present();

    // this.activityProject.start_date = new Date(this.startDate);
    // this.activityProject.end_date = new Date(this.endDate);

    const endDateString = this.endDate.split('T')[0];
    const partsEndDate: any = endDateString.split('-');
    const endDate = new Date( partsEndDate[0], partsEndDate[1] - 1, partsEndDate[2]);
    this.activityProject.end_date = endDate;

    const startDateString = this.startDate.split('T')[0];
    const partsStartDate: any = startDateString.split('-');
    const startDate = new Date( partsStartDate[0], partsStartDate[1] - 1, partsStartDate[2]);
    this.activityProject.start_date = startDate;
    // this.projectService.addNewProject( this.projectApp );
    await this.modalCtrl.dismiss({
      activity: this.activityProject,
      result: true
  });

    /* Swal.close();
    Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        title: 'Proyecto creado con exito'
      }); */
    /* const alert = await this.alertCtrl.create({
        header: 'Exito',
        subHeader: 'Proyecto agregado con exito',
        buttons: ['Aceptar']
      });
    await alert.present(); */


    }

}
