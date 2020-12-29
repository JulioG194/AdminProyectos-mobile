import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorService } from 'src/app/services/validators.service';

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
photoProfile: string;
editForm: FormGroup;
submitted = false;

  constructor(private modalCtrl: ModalController,
              public authService: AuthService,
              private fb: FormBuilder,
              private validators: ValidatorService) { }

  ngOnInit() {
    this.userApp = this.authService.userAuth;
    this.photoProfile = this.userApp.photoURL;
    this.birth = new Date(this.userApp.birthdate['seconds'] * 1000);
    this.bDate = this.birth.toString();
    this.editForm = this.fb.group({
      fullName: ['', Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.validators.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', Validators.compose([ Validators.required,
        this.validators.patternPhoneValidator(),
        Validators.minLength(10), Validators.maxLength(10)])],
      role: ['', Validators.required],
      birthdate: ['', Validators.required]
    },
     {
        validator: this.validators.MatchPassword('password', 'confirmPassword'),
      }
    );
  }

  get editFormControl() {
    return this.editForm.controls;
  }

  async onEdit() {
     try {
       this.submitted = true;
       if (!this.editForm.valid) {
        return;
      }
       console.log(this.editForm.value);
    }  catch (error) {
      console.log(error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al editar',
        text: 'Ha ocurrido un error',
        confirmButtonText: 'Listo!'
      });
    }
  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  enableEdit() {
    this.isDisabled = !this.isDisabled;
  }

  logout() {
    this.authService.logout(this.userApp.uid);
    window.location.reload();
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
      const file = fileList[0];
      this.authService.setPhotoProfile(this.userApp.uid, this.userApp.manager, file);
      this.firstFileToBase64(fileList[0]).then((result: string) => {
      this.imgURI = result;
      this.photoProfile = this.imgURI;
      this.userApp = this.authService.userAuth;
      }, (err: any) => {
        this.imgURI = null;
      });
    }
  }

  private firstFileToBase64(fileImage: File): Promise<{}> {
    return new Promise((resolve, reject) => {
      const fileReader: FileReader = new FileReader();
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
