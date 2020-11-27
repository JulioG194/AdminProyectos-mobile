import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { User } from '../../models/user.interface';
import { Task } from 'src/app/models/task.interface';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.page.html',
  styleUrls: ['./modal-task.page.scss'],
})
export class ModalTaskPage implements OnInit {

  @Input() members;
  @Input() activity;
  @Input() task;

  delegateAux1: User = {
    uid: '',
    displayName: '',
    email: ''
  };

  taskActivity: Task = {
    name: '',
    status: 'Por Realizar',
    delegate: null,
    progress: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
};

startDate: string;
endDate: string;
minD: Date;
maxD: Date;

constructor(  private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              public loadingController: LoadingController) { }

  ngOnInit() {
    if (this.task) {
      this.taskActivity = this.task;
      console.log(this.taskActivity);
      // this.startDate = this.activityProject.startDate.toISOString().slice(0, 10);
      // this.endDate = this.activityProject.endDate.toISOString().slice(0, 10);
      this.startDate = new Date(this.taskActivity.startDate.getTime() - (this.taskActivity.startDate.getTimezoneOffset() * 60000 ))
                  .toISOString()
                  .split('T')[0];
      this.endDate = new Date(this.taskActivity.endDate.getTime() - (this.taskActivity.endDate.getTimezoneOffset() * 60000 ))
                  .toISOString()
                  .split('T')[0];
      this.minD = this.activity.startDate.toISOString().slice(0, 10);
      this.maxD = this.activity.endDate.toISOString().slice(0, 10);
      this.delegateAux1 = this.taskActivity.delegate;
  } else {
     this.minD = this.activity.startDate.toISOString().slice(0, 10);
     this.maxD = this.activity.endDate.toISOString().slice(0, 10);
  }
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  /* onSave() {
    console.log(this.delegateAux1);
  } */

  async onSaveTask( form: NgForm ) {

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

    this.taskActivity.startDate = new Date(this.startDate);
    this.taskActivity.endDate = new Date(this.endDate);
    this.taskActivity.delegate = this.delegateAux1;
    // this.projectService.addNewProject( this.projectApp );
    await this.modalCtrl.dismiss({
      task: this.taskActivity,
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
