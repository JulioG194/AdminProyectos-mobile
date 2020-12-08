import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2/src/sweetalert2.js';
import * as firebase from 'firebase/app';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ValidatorService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private fb: FormBuilder,
    private validators: ValidatorService
  ) {}
   storagePhoto =
    'https://firebasestorage.googleapis.com/v0/b/epn-gugo.appspot.com/o/iconfinder-3-avatar-2754579_120516.png?alt=media&token=ca4223d0-47c4-44c9-a84d-3486af99ae74';
  serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp();
  userRegister: User = {
    uid: '',
    displayName: '',
    email: '',
    employment: '',
    description: '',
    gender: '',
    photoURL: this.storagePhoto,
    birthdate: new Date(),
    phoneNumber: '',
    createdAt: this.serverTimeStamp,
  };

  userLogin: User = {
    uid: '',
    displayName: '',
    email: '',
    password: '',
  };

  password = '';
  hide = true;
  hidePasswd = true;

  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  selected = '';
  registered: any;
  passwordType = 'password';
  passwordIcon = 'eye-off';


  showBtn = false;
  deferredPrompt;

  ngOnInit() {
    // this.navCtrl.setDirection(this.navCtrl.get)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.validators.patternValidator()])]
    });
  }

  ionViewWillEnter() {
     console.log('holi');
     window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showBtn = true;
    });
     window.addEventListener('appinstalled', (event) => {
     window.location.reload();
     this.showBtn = false;
    });
  }

  add_to_home(e) {
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          alert('Gugo Mobile se va a instalar');
        } else {
          alert('Recuerda volver para instalar Gugo Mobile');
        }
        this.deferredPrompt = null;
      });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  hideShowPassword() {
     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
 }

  register() {
    this.router.navigateByUrl('/register');
  }

  contact() {
    this.router.navigateByUrl('/contact');
  }

  tab() {
    this.navCtrl.navigateRoot('tabs/tabs/tab1', { animated: true });
  }

  async openResetPassword() {
    const { value: email } = await Swal.fire({
      title: 'Recuperar mi contraseña',
      input: 'email',
      inputPlaceholder: 'Ingrese el correo electrónico',
      showCloseButton: true,
      validationMessage: 'Correo electrónico inválido',
      confirmButtonText: 'Listo'
    });

    if (email) {
      Swal.fire(`Hemos enviado un correo a: ${email}`);
      return email;
    }
  }

  loadingLoginRegister() {
      Swal.fire({
        allowOutsideClick: false,
        text: 'Espere por favor...',
        timer: 4000
      });
      Swal.showLoading();
  }

  async onLogin() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return;
    }

    this.loadingLoginRegister();

    try {
      const user = await this.authService.login(this.userLogin);
      this.authService.getUser(user).subscribe((userObs) => {
          const loginUser = userObs;
          this.authService.saveUserOnStorage(loginUser);
          const token = localStorage.getItem('fcm');
          console.log(token);
          if (token) {
            this.authService.setTokensUser(loginUser, token);
          }
        });
      Swal.close();
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        });
      setTimeout(() => {
        this.navCtrl.navigateRoot('tabs/tabs/tab1', { animated: true });
       }, 1200);
      Toast.fire({
        icon: 'success',
        title: 'Ingreso Exitoso'
        });
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: this.modalError(error),
        showCloseButton: true,
        confirmButtonText: 'Listo!'
      });
    }
  }

  modalError(error: any) {
    const { code } = error;
    switch (code) {
      case 'auth/wrong-password':
        return 'Ha ingresado mal su contraseña';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/invalid-email':
        return 'Correo electrónico no válido';
      case 'auth/email-already-in-use':
        return 'Usuario ya existente';
      case 'auth/weak-password':
        return 'Contraseña muy debil intente ingresando otra';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      default:
        break;
    }
  }
}
