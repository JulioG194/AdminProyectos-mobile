import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatPage } from './chat.page';

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
    component: ChatPage
  },
  {
    path: 'chat/:id',
    component: ChatPage
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
  declarations: [ChatPage]
})
export class ChatPageModule { }
