import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { EvidenceService } from '../../services/evidence.service';
import { Evidence } from 'src/app/models/evidence.interface';

@Component({
  selector: 'app-modal-evidencegestor',
  templateUrl: './modal-evidencegestor.page.html',
  styleUrls: ['./modal-evidencegestor.page.scss'],
})
export class ModalEvidencegestorPage implements OnInit {

  evidences: Evidence[] = [];
  @Input() task;

  constructor(private modalCtrl: ModalController,
              private evidenceService: EvidenceService) { }

  ngOnInit() {
    this.evidenceService.getEvidences(this.task.id).subscribe( evids => {
      this.evidences = evids;
      console.log(this.evidences);
      this.evidences.forEach(evid => {
        evid.createdAt = new Date(evid.createdAt['seconds'] * 1000);
      });
    });

  }

  onClose() {
    this.modalCtrl.dismiss();
  }

  downloadFile(url: string) {
    window.open(url, '_blank');
}

}