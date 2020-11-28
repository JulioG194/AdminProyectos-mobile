import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { MessagingService } from './services/messaging.service';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  post = 'false';
  items = 0;
  intro: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController,
    private msgService: MessagingService,
    private afMessaging: AngularFireMessaging
  ) {
    this.initializeApp();

    this.items = localStorage.length;
    console.log(this.items);
    const usuario = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    this.intro = localStorage.getItem('intro');
    console.log(this.intro)

    if (usuario) {
      this.navCtrl.navigateRoot('tabs/tabs/tab1', { animated: true });
      this.afMessaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      const { notification } = payload;
      const { body, title } = notification;
      // this.snackBar.open(body, 'OK', { duration: 2000 });
      // this.msgService.success(body);
    });
    } else {
      if (this.intro) {
        this.router.navigate(['login']);
      } else {
        this.post = 'false';
      }
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.msgService.requestPermission();
    });
  }

  changeIntro() {
    localStorage.setItem('intro', 'true');
    this.post = 'true';
    this.intro = localStorage.getItem('intro');
    this.items = localStorage.length;
    this.router.navigate(['login']);
  }
}
