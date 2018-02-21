import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventViewModalPage } from './event-view-modal';
import * as moment from 'moment';       //Moment used for formatting dates.
//import { Component } from '@angular/core';
import {  NavController, NavParams} from 'ionic-angular';
//IonicPage,
@NgModule({
  declarations: [
    EventViewModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EventViewModalPage),
  ],
})
export class EventViewModalPageModule {
  notice = { Type: "", date:"",title:"", Notes:"",resource:""};
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,  
                   //Various constructor declarations.
              ) {
                this.notice.Type =moment(this.navParams.get('Notice')).format();   
             /* this.notice.Type =moment(this.navParams.get('noticeType')).format(); 
              this.notice.date =moment(this.navParams.get('noticeDate')).format(); 
              this.notice.title =moment(this.navParams.get('noticeTitle')).format(); 
              this.notice.Notes =moment(this.navParams.get('noticeNotes')).format(); 
              this.notice.resource =moment(this.navParams.get('noticeResource')).format(); */

  }

  ionViewDidLoad() {
  }

  goBack(){
    this.navCtrl.pop();               //Allows user to go back to previous page.
  }
}
