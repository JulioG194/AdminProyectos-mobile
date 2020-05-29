import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab2/tab2.module').then(m => m.Tab2PageModule)
          },
          {
            path: 'profile',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../pages/profile/profile.module').then(m => m.ProfilePageModule)
              },
              {
                path: '',
                loadChildren: () =>
                import('../pages/profile-settings/profile-settings.module').then(m => m.ProfileSettingsPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab3/tab3.module').then(m => m.Tab3PageModule)
          },
          {
            path: 'project/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../pages/project/project.module').then(m => m.ProjectPageModule)
              },
              {
                path: 'project/:id',
                loadChildren: () =>
                import('../pages/project/project.module').then(m => m.ProjectPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab4/tab4.module').then(m => m.Tab4PageModule)
          },
          {
            path: 'schedule/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../pages/schedule/schedule.module').then(m => m.SchedulePageModule)
              },
              {
                path: 'schedule/:id',
                loadChildren: () =>
                import('../pages/schedule/schedule.module').then(m => m.SchedulePageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'tab5',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab5/tab5.module').then(m => m.Tab5PageModule)
          },
          {
            path: 'chat/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../pages/chat/chat.module').then(m => m.ChatPageModule)
              },
              {
                path: 'chat/:id',
                loadChildren: () =>
                import('../pages/chat/chat.module').then(m => m.ChatPageModule)
              }
            ]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
