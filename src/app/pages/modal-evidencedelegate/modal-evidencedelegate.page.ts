import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modal-evidencedelegate',
  templateUrl: './modal-evidencedelegate.page.html',
  styleUrls: ['./modal-evidencedelegate.page.scss'],
})
export class ModalEvidencedelegatePage implements OnInit {

  test=[1,2,3,4,5,6] //variable para diseño
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  onClose() {
    this.modalCtrl.dismiss();
  }
  
}
