import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ProjectPage } from './project.page';
import { ModalActivityPage } from '../modal-activity/modal-activity.page'
import { ModalActivityPageModule } from '../modal-activity/modal-activity.module'
import { ModalTaskPage } from '../modal-task/modal-task.page';
import { ModalTaskPageModule } from '../modal-task/modal-task.module';
import { ModalEvidencegestorPage } from '../modal-evidencegestor/modal-evidencegestor.page';
import { ModalEvidencegestorPageModule } from "../modal-evidencegestor/modal-evidencegestor.module";
// const routes: Routes = [
//   {
//     path: '',
//     component: ProfilePage
//   }
// ];

const routes: Routes = [

      {
        path: '',
        children: [
      {
        path: '',
        component: ProjectPage
      },
      {
        path: 'project/:id',
        component: ProjectPage
      }
    ]
    }

];

@NgModule({
  entryComponents: [
    ModalActivityPage,
    ModalTaskPage, 
    ModalEvidencegestorPage
],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModalActivityPageModule,
    ModalTaskPageModule,
    ModalEvidencegestorPageModule
  ],
  declarations: [ProjectPage]
})
export class ProjectPageModule { }
