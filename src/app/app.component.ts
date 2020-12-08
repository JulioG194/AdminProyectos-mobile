import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { MessagingService } from './services/messaging.service';
// import { AngularFireMessaging } from '@angular/fire/messaging';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  post = 'false';
  items = 0;
  intro: any;
  deferredPrompt: Event;
  onlineOffline: boolean = navigator.onLine;
  usuario: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController,
    private msgService: MessagingService,
    private storage: Storage
  ) {
    this.initializeApp();
    this.items = localStorage.length;
    console.log(this.items);
    console.log(this.onlineOffline);

    this.usuario = localStorage.getItem('user');
    // const token = localStorage.getItem('token');
    this.intro = localStorage.getItem('intro');

    window.addEventListener('offline', () => {
        console.log('estoy offline');
        this.storage.get('usuario').then((val) => {
        this.usuario = val;
        console.log('usuario online', this.usuario);
      });

        window.addEventListener('online', () => {
          this.usuario = localStorage.getItem('user');
          console.log('estoy online');
          console.log('usuario online', this.usuario);
      });
  });

    if (this.usuario) {
      this.navCtrl.navigateRoot('tabs/tabs/tab1', { animated: true });
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
    this.router.navigateByUrl('login', {skipLocationChange: true}).then(() => {
    this.router.navigate(['login']);
    });
    window.location.reload();
  }
}
