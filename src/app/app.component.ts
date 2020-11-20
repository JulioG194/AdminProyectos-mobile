import { Component } from "@angular/core";

import { Platform, NavController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  post = "false";
  items = 0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController
  ) {
    this.initializeApp();

    this.items = localStorage.length;

    const usuario = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const intro = localStorage.getItem("intro");

    if (usuario) {
      this.navCtrl.navigateRoot("tabs/tabs/tab1", { animated: true });
    } else {
      if (intro) {
        this.router.navigate(["login"]);
      } else {
        this.post = "false";
      }
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  changeIntro() {
    localStorage.setItem("intro", "true");
    this.post = "true";
    this.items = localStorage.length;
    this.router.navigate(["login"]);
  }
}
