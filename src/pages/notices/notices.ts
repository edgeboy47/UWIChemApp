import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
//import {AngularFireDatabase} from 'angularfire2/database';
//import { AngularFireAuth } from 'angularfire2/auth';
/**
 * Generated class for the NoticesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notices',
  templateUrl: 'notices.html',
})
export class NoticesPage {
  notices:any = [];
  constructor( public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
  }
//private fbAuth: AngularFireAuth,
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserNoticesPage');
    /*this.fbAuth.authState.subscribe(data=>{
      this.db.object('/UserNotices/'+data.uid).valueChanges().subscribe(data=>{
        this.notices= [];
        for(let key in data){
          let notice = {noticeID:key,Message:data[key]};
          this.notices.push(notice);
        }
      });
    }); */
  }

  navigateToCalendar(noticeID:string){
    //this.navCtrl.push('CalendarPage',{noticeID});
  }

  removeNotice(noticeID:string){
    /*this.fbAuth.authState.subscribe(data=>{
      this.db.object('/UserNotices/'+data.uid+'/'+noticeID+'/').remove()
    });*/
  }


  addNotice(){
     this.alertCtrl.create({
      title:"Add a notice",
      inputs:[
        {
          name:'To',
          placeholder:'Recipient'
        },
        {
          name:'Message',
          placeholder:'Message'
        },
        {
          name:'Date',
          placeholder:'Date'
        }
      ],
      buttons:[
        {
          text:'Submit',
          role:'submit',
          handler:data=>{

          }
        },
        {
          text:'Cancel',
          role:'cancel',
          handler:data=>{
              console.log("Cancel button clicked..")
          }
        }

      ]
     }).present()
  }
}
