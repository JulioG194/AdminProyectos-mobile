import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line:import-spacing
import  Swal  from 'sweetalert2';
import * as firebase from 'firebase/app';
import { User } from 'src/app/models/user.interface';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  userRegister: User = {
    uid: '',
    displayName: '',
    email: '',
    password: '',
    employment: '',
    description: '',
    gender: '',
    photoURL: 'https://bauerglobalbrigades.files.wordpress.com/2018/10/no-photo7.png',
    birthdate: new Date(),
    phoneNumber: '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
password = '';

  constructor(private authService: AuthService,
              private router: Router,
              private navCtrl: NavController ) { }

  ngOnInit() {
  }

   // Metodo par registrar nuevos usuarios
   onRegister( form: NgForm ) {

    if ( form.invalid ) { return; }

    if ( this.userRegister.password !== this.password) {
      Swal.fire('Error registro', 'Las contraseñas no coinciden' , 'error'  );

      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    if ( form.value.manager === 'true' ) {
       this.userRegister.manager = true;
       this.userRegister.employment = 'Gestor de proyectos';
    } else {
      this.userRegister.manager = false;
      this.userRegister.employment = 'Tecnico asistente';
    }

    this.authService.register( this.userRegister )
    .subscribe( resp => {

      Swal.close();

      this.authService.addNewUser(this.userRegister, resp.localId);
      // this.router.navigateByUrl('/dashboard');

      Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: 'Registrado con exito',
      text: 'Ahora puedes acceder a la aplicacion',
      position: 'center',
      showConfirmButton: false,
      timer: 1500
    });

      form.reset();
      // this.post1 = true;
      // this.router.navigateByUrl('/login');
      this.navCtrl.navigateRoot( 'tabs/tabs/tab1', { animated: true } );
    }, (err) => {
      Swal.fire('Error al registrar', this.respError(err.error.error.message), 'error'  );

    });
  }

  // Metodo complementario cuando existe un problema en el registro
  respError( respuesta: string ) {

    if ( respuesta === 'EMAIL_EXISTS' ) {
        respuesta = 'Correo electrónico existente';
    }
    return respuesta;
  }


}
