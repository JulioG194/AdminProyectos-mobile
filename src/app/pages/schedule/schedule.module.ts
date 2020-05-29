import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule.page';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

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
        component: SchedulePage
      },
      {
        path: 'schedule/:id',
        component: SchedulePage
      }
    ]
    }

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2GoogleChartsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SchedulePage]
})
export class SchedulePageModule { }
