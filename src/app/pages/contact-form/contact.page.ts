import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:import-spacing
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { User } from 'src/app/models/user.interface';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  userRegister: User = {
    uid: '',
    displayName: '',
    email: '',
    password: '',
    employment: '',
    description: '',
    gender: '',
    photoURL:
      'https://bauerglobalbrigades.files.wordpress.com/2018/10/no-photo7.png',
    birthdate: new Date(),
    phoneNumber: '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  password = '';

  section = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  // Metodo par registrar nuevos usuarios
  //  onRegister( form: NgForm ) {

  //   if ( form.invalid ) { return; }

  //   if ( this.userRegister.password !== this.password) {
  //     Swal.fire('Error registro', 'Las contraseñas no coinciden' , 'error'  );

  //     return;
  //   }

  //   Swal.fire({
  //     allowOutsideClick: false,
  //     text: 'Espere por favor...'
  //   });
  //   Swal.showLoading();

  //   if ( form.value.manager === 'true' ) {
  //      this.userRegister.manager = true;
  //      this.userRegister.employment = 'Gestor de proyectos';
  //   } else {
  //     this.userRegister.manager = false;
  //     this.userRegister.employment = 'Tecnico asistente';
  //   }

  //   this.authService.register( this.userRegister )
  //   .subscribe( resp => {

  //     Swal.close();

  //     this.authService.addNewUser(this.userRegister, resp.localId);
  //     // this.router.navigateByUrl('/dashboard');

  //     Swal.fire({
  //     allowOutsideClick: false,
  //     icon: 'success',
  //     title: 'Registrado con exito',
  //     text: 'Ahora puedes acceder a la aplicacion',
  //     position: 'center',
  //     showConfirmButton: false,
  //     timer: 1500
  //   });

  //     form.reset();
  //     // this.post1 = true;
  //     // this.router.navigateByUrl('/login');
  //     this.navCtrl.navigateRoot( 'tabs/tabs/tab1', { animated: true } );
  //   }, (err) => {
  //     Swal.fire('Error al registrar', this.respError(err.error.error.message), 'error'  );

  //   });
  // }
  async onRegister(form: NgForm) {
    try {
      if (form.invalid) {
        return;
      }

      if (this.userRegister.password !== this.password) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'error',
          text: 'Las contraseñas no coinciden',
        });
        return;
      }
      Swal.fire({
        allowOutsideClick: false,
        text: 'Espere por favor...',
      });
      Swal.showLoading();

      this.setEmployment(form);
      const userReg = await this.authService.register(this.userRegister);
      const { uid } = userReg;
      delete this.userRegister.password;
      this.userRegister.uid = uid;
      this.authService.createUser(this.userRegister, uid);

      await this.authService.verifyEmail();

      Swal.fire({
        icon: 'success',
        title: 'Registrado con exito',
        text: 'Por favor verifica tu cuenta para poder iniciar',
        position: 'center',
      });

      form.reset();
      this.router.navigate(['login']);
      this.section = true;
    } catch (error) {
      console.log(error);
      this.userRegister.manager = null;
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: this.modalError(error),
      });
    }
  }

  setEmployment(form: NgForm) {
    if (form.value.manager === 'true') {
      this.userRegister.manager = true;
      this.userRegister.employment = 'Gestor de proyectos';
    } else {
      this.userRegister.manager = false;
      this.userRegister.employment = 'Tecnico asistente';
    }
  }

  // Metodo complementario cuando existe un problema en el registro
  respError(respuesta: string) {
    if (respuesta === 'EMAIL_EXISTS') {
      respuesta = 'Correo electrónico existente';
    }
    return respuesta;
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
