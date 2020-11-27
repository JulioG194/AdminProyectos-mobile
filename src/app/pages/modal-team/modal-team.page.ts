import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { User } from 'src/app/models/user.interface';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modal-team',
  templateUrl: './modal-team.page.html',
  styleUrls: ['./modal-team.page.scss'],
})
export class ModalTeamPage implements OnInit {

  constructor( private modalCtrl: ModalController,
               private alertCtrl: AlertController) {}

  @Input() members;
  @Input() newMembers;

  visability: boolean;
  newMemb: User[] = [];

  ngOnInit() {
    console.log(this.members);
  }

  onChange( users: User[]) {
    this.newMemb = [];
    console.log('onChange', users);
    let isChecked = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < users.length; i++) {
      if (users[i].check === true) {
        isChecked = true;
        this.visability = true;
        this.newMemb.push(users[i]);
      } 
    }
    if (isChecked === false) {
      this.visability = false;
    }
  }

  async onSave() {
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
 }

  onClose() {
    this.modalCtrl.dismiss();
  }

}
