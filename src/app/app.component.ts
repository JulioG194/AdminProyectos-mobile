import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { MessagingService } from './services/messaging.service';
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
  usuario: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private msgService: MessagingService,
  ) {
    this.initializeApp();
    this.items = localStorage.length;
    this.intro = localStorage.getItem('intro');

    window.addEventListener('offline', () => {
          this.usuario = localStorage.getItem('user');
          console.log('estoy offline');
          console.log('usuario online', this.usuario);
  });
    window.addEventListener('online', () => {
          this.usuario = localStorage.getItem('user');
          console.log('estoy online');
          console.log('usuario online', this.usuario);
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.msgService.requestPermission();
      this.usuario = localStorage.getItem('user');
      if (this.usuario) {
      console.log('Bienvenido');
    } else {
      if (this.intro) {
        this.router.navigate(['login']);
      } else {
        this.post = 'false';
      }
    }
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
