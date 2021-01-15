import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { ModalController, AlertController, LoadingController, IonContent } from '@ionic/angular';
import { Activity } from 'src/app/models/activity.interface';
import * as firebase from 'firebase/app';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-modal-resources',
  templateUrl: './modal-resources.page.html',
  styleUrls: ['./modal-resources.page.scss'],
})
export class ModalResourcesPage implements OnInit {

  segmentModel = 'observations';
  @ViewChild('content', { static: false }) content: IonContent;
  comments: any[] = [];
  resources: any [] = [];
  fileUploaded: File;
  fileName: string;

  constructor(private modalCtrl: ModalController,
              private projectService: ProjectService) { }

  @Input() projectId;

  imgURI: string = null;
  @ViewChild('pwaphoto', {static: false}) pwaphoto: ElementRef;

  ngOnInit() {
    console.log(this.projectId);
    this.getComments(this.projectId);
    this.getResources(this.projectId);
  }

  segmentChanged($event) {
    console.log($event);
  }

  scrollToBottom(): void {
    this.content.scrollToBottom(300);
  }
  ionViewWillEnter() {
      setTimeout(() => {
        this.content.scrollToBottom(300);
      }, 100);
  }


  onClose() {
    this.modalCtrl.dismiss();
  }

  getComments(projectId: string) {
        this.projectService.getComments(projectId).subscribe((comms) => {
          comms.map((com: any) => {
                 if (com.createdAt) {
                   com.createdAt = new Date(com.createdAt.seconds * 1000);
                 }
          });
          this.comments = comms;
        });
      }

  getResources(projectId: string) {
        this.projectService.getResources(projectId).subscribe((ress) => {
          ress.map((res: any) => {
                 if (res.createdAt) {
                   res.createdAt = new Date(res.createdAt.seconds * 1000);
                 }
          });
          this.resources = ress;
          console.log(this.resources)
        });
      }

   downloadFile(url: string) {
    window.open(url, '_blank');
  }

   openPWAPhotoPicker() {
    if (this.pwaphoto == null) {
      return;
    }
    this.pwaphoto.nativeElement.click();
  }

  uploadPWA() {

    if (this.pwaphoto == null) {
      return;
    }

    const fileList: FileList = this.pwaphoto.nativeElement.files;

    if (fileList && fileList.length > 0) {
      this.firstFileToBase64(fileList[0]).then((result: string) => {
        this.imgURI = result;
        console.log(this.imgURI);
        this.fileUploaded = fileList[0];
        console.log(this.fileUploaded);
        this.fileName = this.fileUploaded.name;
      }, (err: any) => {
        // Ignore error, do nothing
        this.imgURI = null;
      });
    }
  }

   private firstFileToBase64(fileImage: File): Promise<{}> {
    return new Promise((resolve, reject) => {
      const fileReader: FileReader = new FileReader();
      if (fileReader && fileImage != null) {
        fileReader.readAsDataURL(fileImage);
        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      } else {
        reject(new Error('No file found'));
      }
    });
  }

  cancel() {
    this.imgURI = null;
    this.fileUploaded = null;
  }
}
