import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:import-spacing
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { User } from 'src/app/models/user.interface';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ValidatorService } from 'src/app/services/validators.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private validators: ValidatorService
  ) {}

   storagePhoto =
    'https://firebasestorage.googleapis.com/v0/b/epn-gugo.appspot.com/o/uni-avtar.jpg?alt=media&token=04e188b6-35cb-4bc0-bd5e-9f100307878f';
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
  password = '';

  section = true;

  registerForm: FormGroup;
  submitted = false;
  selected = '';
  registered: any;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  passwordTypeConfirm = 'password';
  passwordIconConfirm = 'eye-off';

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.compose([Validators.required, this.validators.noWhitespaceValidator()])],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.required, this.validators.patternValidator()])],
      confirmPassword: ['', [Validators.required]],
      phoneNumber: ['', Validators.compose([ Validators.required,
        this.validators.patternPhoneValidator(),
        Validators.minLength(10), Validators.maxLength(10)])],
      role: ['', Validators.required],
      app: ['', Validators.required]
    },
     {
        validator: this.validators.MatchPassword('password', 'confirmPassword'),
      }
    );
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  hideShowPassword() {
     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
 }

 hideShowPasswordConfirm() {
     this.passwordTypeConfirm = this.passwordTypeConfirm === 'text' ? 'password' : 'text';
     this.passwordIconConfirm = this.passwordIconConfirm === 'eye-off' ? 'eye' : 'eye-off';
 }

  async onRegister() {
     try {
       this.submitted = true;
       if (!this.registerForm.valid) {
        return;
      }
       const role = this.registerForm.value.role;
       const company = this.selected;
       const email = this.registerForm.value.email;

       this.loadingLoginRegister();

       this.setEmployment(role);

       if (company === 'Empresa' && role === 'true') {
        this.authService.getCompanyManager(email).subscribe(async (data) => {
            const snap = _.head(data);
            if (snap) {
              this.userRegister.company = {
              id: snap.cid,
              name: snap.name,
              address: snap.address,
              ref: snap.ref
            };
              await this.sucessRegister(role);
            } else {
              this.failedRegister();
            }
          });
      }

       if ( company === 'Empresa' && role === 'false' ) {
        this.authService.getCompanyDelegate(email).subscribe(async (data) => {
            const snap = _.head(data);
            if (snap) {
            this.userRegister.company = {
              id: snap.cid,
              name: snap.name,
              address: snap.address,
              ref: snap.ref
            };
            await this.sucessRegister(role);
            } else {
              this.failedRegister();
            }
          });
       }
       if ( company === 'Personal' ) {
           await this.sucessRegister(role);
       }
    }  catch (error) {
      this.userRegister.manager = null;
      console.log(error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: this.modalError(error),
        confirmButtonText: 'Listo!'
      });
    }
  }

  async sucessRegister(role: any) {
    try {
      const userReg = await this.authService.register(this.userRegister);
      const { uid } = userReg;
      delete this.userRegister.password;
      this.userRegister.uid = uid;
      this.userRegister.tokens = [];
      if (role === 'false') {
        this.userRegister.assignedTasks = 0;
      }
      this.authService.createUser(this.userRegister, uid);
      Swal.fire({
        icon: 'success',
        title: 'Registrado con exito, ahora puede iniciar sesion',
        position: 'center',
        showCloseButton: true,
        confirmButtonText: 'Listo'
      });
      this.registerForm.reset();
      this.router.navigateByUrl('/login');
    } catch (error) {
      console.log(error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: this.modalError(error),
        confirmButtonText: 'Listo'
      });
    }
  }

  failedRegister() {
      Swal.fire({
              icon: 'error',
              title: 'Usuario no encontrado',
              text: 'Por favor verifique su correo, rol o comuniquese con la empresa a la que pertenece',
              position: 'center',
              showCloseButton: true,
              confirmButtonText: 'Listo!'
              });
      this.userRegister.manager = null;
  }

 setEmployment(value: string) {
    if (value === 'true') {
      this.userRegister.manager = true;
      this.userRegister.employment = 'Gestor de proyectos';
    } else {
      this.userRegister.manager = false;
      this.userRegister.employment = 'Delegado en poyectos';
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
