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
    'https://firebasestorage.googleapis.com/v0/b/tesis-adminproyectos.appspot.com/o/login.png?alt=media&token=ce8a16cb-009c-4d41-b9c0-c493bd8a355b';
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
    email: 'alexferg631@gmail.com',
    password: '1234Epn!',
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

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.validators.patternValidator()])]
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

  // Metodo para el ingreso de usuarios a la aplicacion
  // onLogin(form: NgForm) {
  //   if (form.invalid) {
  //     return;
  //   }

  //   Swal.fire({
  //     allowOutsideClick: false,
  //     text: "Espere por favor...",
  //   });
  //   Swal.showLoading();

  //   this.authService.login(this.userLogin).subscribe(
  //     (resp) => {
  //       setTimeout(() => {
  //         Swal.close();
  //         this.navCtrl.navigateRoot("tabs/tabs/tab1", { animated: true });
  //       }, 1000);
  //     },
  //     (err) => {
  //       Swal.fire(
  //         "Error al autenticar",
  //         this.respError2(err.error.error.message),
  //         "error"
  //       );
  //     }
  //   );
  // }
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
      const { emailVerified } = user;
      //if (emailVerified) {
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
      // } else {
      //   Swal.fire({
      //     icon: 'info',
      //     title: 'Verifique su cuenta',
      //     text: 'Para iniciar sesion verifique su cuenta',
      //     showCloseButton: true,
      //     confirmButtonText: 'Listo!'
      //   });
      // }
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

  // Metodo complementario cuando existe un problema en el ingreso a la aplicacion
  // respError2(respuesta: string) {
  //   if (respuesta === 'EMAIL_NOT_FOUND') {
  //     respuesta = 'Correo electrónico no encontrado';
  //   } else {
  //     respuesta = 'Contraseña incorrecta';
  //   }
  //   return respuesta;
  // }

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
