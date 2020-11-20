import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.page.html',
  styleUrls: ['./modal-profile.page.scss'],
})
export class ModalProfilePage implements OnInit {

  mainObservable: Subscription;
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
bDate: string;
birth: Date = new Date();
isDisabled = true;

  constructor(private modalCtrl: ModalController,
              public authService: AuthService) { }

  ngOnInit() {

    this.authService.getUser(this.authService.userAuth).subscribe(user => {(this.userApp = user); (this.birth = new Date(this.userApp.birthdate['seconds'] * 1000)); (this.bDate = this.birth.toString()) ; });

  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  enableEdit() {
    this.isDisabled = !this.isDisabled;
  }

}
