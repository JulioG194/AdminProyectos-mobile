import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";
import { User } from "src/app/models/user.interface";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService
  ) {}

  userLogin: User = {
    uid: "",
    displayName: "",
    email: "julio.gonzalez@gugo.com",
    password: "123456789",
  };
  ngOnInit() {}

  register() {
    this.router.navigateByUrl("/register");
  }

  tab() {
    this.navCtrl.navigateRoot("tabs/tabs/tab1", { animated: true });
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

  async onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      text: "Espere por favor...",
    });
    Swal.showLoading();

    try {
      const user = await this.authService.login(this.userLogin);
      const { emailVerified } = user;
      if (emailVerified) {
        this.authService.getUser(user).subscribe((userObs) => {
          const loginUser = userObs;
          this.authService.saveUserOnStorage(loginUser);
          const token = localStorage.getItem("fcm");
          this.authService.setTokenUser(loginUser, token);
        });
        Swal.close();
        // this.router.navigateByUrl("/dashboard");
        this.navCtrl.navigateRoot("tabs/tabs/tab1", { animated: true });
      } else {
        Swal.fire({
          icon: "info",
          title: "Verifique su cuenta",
          text: "Para iniciar sesion verifique su cuenta",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error al autenticar",
        text: this.modalError(error),
      });
    }
  }

  // Metodo complementario cuando existe un problema en el ingreso a la aplicacion
  respError2(respuesta: string) {
    if (respuesta === "EMAIL_NOT_FOUND") {
      respuesta = "Correo electrónico no encontrado";
    } else {
      respuesta = "Contraseña incorrecta";
    }
    return respuesta;
  }

  modalError(error: any) {
    const { code } = error;
    switch (code) {
      case "auth/wrong-password":
        return "Ha ingresado mal su contraseña";
      case "auth/user-not-found":
        return "Usuario no encontrado";
      case "auth/invalid-email":
        return "Correo electrónico no válido";
      case "auth/email-already-in-use":
        return "Usuario ya existente";
      case "auth/weak-password":
        return "Contraseña muy debil intente ingresando otra";
      case "auth/user-not-found":
        return "Usuario no encontrado";
      default:
        break;
    }
  }
}
