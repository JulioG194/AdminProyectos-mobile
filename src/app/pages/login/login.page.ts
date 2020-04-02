import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor( private router: Router,
               private navCtrl: NavController,
               private authService: AuthService ) { }

userLogin: User = {
                name: '',
                email: '',
                password: ''
            };
  ngOnInit() {
  }

  register() {
      this.router.navigateByUrl('/register');
  }

  tab() {
    this.navCtrl.navigateRoot( 'tabs/tabs/tab1', { animated: true } );
  }

    // Metodo para el ingreso de usuarios a la aplicacion
    onLogin( form: NgForm ) {

      if ( form.invalid ) { return; }

      Swal.fire({
        allowOutsideClick: false,
        text: 'Espere por favor...'
      });
      Swal.showLoading();


      this.authService.login( this.userLogin )
      .subscribe( resp => {
        setTimeout(() => {
          Swal.close();
          this.navCtrl.navigateRoot( 'tabs/tabs/tab1', { animated: true } );
        }, 1000);

      }, (err) => {

          Swal.fire('Error al autenticar', this.respError2(err.error.error.message), 'error'  );

      });
      }

    // Metodo complementario cuando existe un problema en el ingreso a la aplicacion
    respError2( respuesta: string ) {

        if ( respuesta === 'EMAIL_NOT_FOUND' ) {
            respuesta = 'Correo electrónico no encontrado';
        } else {
          respuesta = 'Contraseña incorrecta';
        }
        return respuesta;

      }
}
