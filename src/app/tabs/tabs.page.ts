import { Component } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private afMessaging: AngularFireMessaging) {

     this.afMessaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      const { notification } = payload;
      const { body, title } = notification;
      // this.snackBar.open(body, 'OK', { duration: 2000 });
      // this.msgService.success(body);
    });
  }

}
