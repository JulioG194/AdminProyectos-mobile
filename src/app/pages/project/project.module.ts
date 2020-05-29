import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectPage } from './project.page';

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
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProjectPage]
})
export class ProjectPageModule { }
