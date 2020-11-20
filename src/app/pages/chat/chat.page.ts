import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AuthService } from 'src/app/services/auth.service';
import { TeamService } from 'src/app/services/team.service';
import { Project } from 'src/app/models/project.interface';
import { Activity } from 'src/app/models/activity.interface';
import { Task } from 'src/app/models/task.interface';
import { Team } from 'src/app/models/team.interface';
import { User } from 'src/app/models/user.interface';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChatService } from 'src/app/services/chat.service';
import { Chat } from 'src/app/models/chat.interface';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase/app';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  post = true;
  post1 = true;
  post2 = true;
  post3 = true;
  post4 = true;
  post5 = true;
  edit = true;

  open = true;
  open1 = true;
  open2 = true;
  open3 = true;

  validate = true;

  panelOpenState = false;


 // delegates: string[]=['Boots', 'Yeye','Pedro', 'Juli','Alexa'];

  projectApp: Project = {
    name: '',
    client: '',
    description: '',
    start_date: new Date(),
    end_date: new Date(),
    type: '',
    teamId: '',
    ownerId: '',
    status: 'To Do'
};
startD = new Date();
endD = new Date();
id: string;
idActivity: string;
minDate = new Date();
maxDate = new Date();

activityProject: Activity = {
    name: '',
    status: '',
    activity_time: 0
};

taskActivity: Task = {
    name: '',
    status: '',
    delegate: null
};

team: Team;
delegates: User[] = [];
tasksActivity: Task[][];
activitiesProject: Activity[] = [];
differenceTime: number;
differenceDays: number;

userApp: User = {
  displayName: '',
  email: '',
  password: '',
  uid: '',
  birthdate: new Date(),
  description: '',
  gender: '',
  photoURL: ''
};

coworker: User = {
  displayName: '',
  email: '',
  password: '',
  uid: '',
  birthdate: new Date(),
  description: '',
  gender: '',
  photoURL: ''
};

allstartdates: Date[] = [];
allenddates: Date[] = [];
allstartdatesT: Date[] = [];
allenddatesT: Date[] = [];
activityAux: Activity = {
  name: '',
  status: '',
  start_date: null,
  end_date: null,
  activity_time: 0
};

aux7: number;
information: any[];

cow: any;
automaticClose = false;
allChats: Chat[] = [];

chatUser: Chat = {
  senderEmail: '',
  coworkerName: '',
  coworkerEmail: '',
  senderName: '',
  coworkerId: '',
  message: '',
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
};
elemento: any;

@ViewChild('content', { static: false }) content: IonContent;
  constructor( private route: ActivatedRoute,
               private _projectService: ProjectService,
               private authService: AuthService,
               private router: Router,
               private router1: Router,
               public _teamService: TeamService,
               private chatService: ChatService ) {

              //  this.information = this.activitiesProject;
                 }

   ngOnInit() {
    // this.scrollToBottom();
    this.authService.getUser(this.authService.userAuth)
               .subscribe(user => {
                 (this.userApp = user); });
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.queryParams.subscribe(params => {
      this.coworker = JSON.parse(params["coworker"]);
  });

    this.chatService.getChats(this.id).subscribe(chats => {
      this.allChats = chats;
      try {
        this.allChats.sort((a, b) => a.createdAt['seconds'] - b.createdAt['seconds']);
        this.allChats.forEach(chat => {
          // console.log(chat.createdAt);
        });
      } catch {}
      setTimeout(() => {
        this.content.scrollToBottom(300);
      }, 20);
  });

  }
  scrollToBottom(): void {
    this.content.scrollToBottom(300);
  }

  onSendMessage( form: NgForm ) {
    if ( form.invalid ) { return; }

    this.chatUser.coworkerEmail = this.coworker.email;
    this.chatUser.coworkerName = this.coworker.displayName;
    this.chatUser.senderEmail = this.userApp.email;
    this.chatUser.senderName = this.userApp.displayName;
    this.chatUser.coworkerPhoto = this.coworker.photoURL;
    this.chatUser.userId = this.userApp.uid;
    this.chatUser.coworkerId = this.coworker.uid;

    // console.log(this.chatUser);

    if ( this.chatUser.message !== null ) {
      this.chatService.addNewChat(this.chatUser);
    }


    // console.log(this.chatUser.createdAt);

    this.chatUser.message = '';


  }


}
