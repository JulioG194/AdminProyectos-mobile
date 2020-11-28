import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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

  imgURI: string = null;
  @ViewChild('pwaphoto', {static: false}) pwaphoto: ElementRef;
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

  openPWAPhotoPicker() {
    if (this.pwaphoto == null) {
      return;
    }

    this.pwaphoto.nativeElement.click();
  }

  uploadPWA() {

    if (this.pwaphoto == null) {
      return;
    }

    const fileList: FileList = this.pwaphoto.nativeElement.files;

    if (fileList && fileList.length > 0) {
      this.firstFileToBase64(fileList[0]).then((result: string) => {
        this.imgURI = result;
      }, (err: any) => {
        // Ignore error, do nothing
        this.imgURI = null;
      });
    }
  }

  private firstFileToBase64(fileImage: File): Promise<{}> {
    return new Promise((resolve, reject) => {
      let fileReader: FileReader = new FileReader();
      if (fileReader && fileImage != null) {
        fileReader.readAsDataURL(fileImage);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject(new Error('No file found'));
      }
    });
  }

}
