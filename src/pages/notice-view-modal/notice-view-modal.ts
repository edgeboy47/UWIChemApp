import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NoticeViewModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notice-view-modal',
  templateUrl: 'notice-view-modal.html',
})
export class NoticeViewModalPage {
  notice = {date:"", Notes:"",title: "",Type: "", resource:""};
 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let noticeGiven = this.navParams.get('noticeG'); 
    this.notice.date = noticeGiven['date'];
    this.notice.Type = noticeGiven['Type'];
    this.notice.title = noticeGiven['title'];
    this.notice.Notes = noticeGiven['Notes'];
    this.notice.resource = noticeGiven['resource'];
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeViewModalPage');
  }
  goBack(){
    this.navCtrl.pop();               //Allows user to go back to previous page.
  }
}
