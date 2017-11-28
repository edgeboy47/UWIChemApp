import { Component } from '@angular/core';
import { IonicPage, ModalController ,NavController, NavParams, AlertController } from 'ionic-angular';
//import {AngularFireAuth} from 'angularfire2/auth';
//import {AngularFireDatabase } from 'angularfire2/database';

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
  temp:any;
  constructor(public modal:ModalController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
  }
  //private fbAuth: AngularFireAuth,public db: AngularFireDatabase
  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticesPage');
     
  }

  addNotice(){
    let notice = this.modal.create('NoticesModalPage');
    notice.present();
  }
}

/*this.fbAuth.authState.subscribe(data=>{
      this.db.object('/Notices/'+data.uid).valueChanges().subscribe(data=>{
        this.notices= [];
        for(let key in data){
          let notice = {noticeID:key,Message:data[key]};// figure out your own way to store from the database.
          this.notices.push(notice);
        }
      });
    });*/
/*  navigateToCalendar(noticeID:string){
    this.navCtrl.push('CalendarPage',{noticeID});
  }

  removeNotice(noticeID:string){
    this.fbAuth.authState.subscribe(data=>{
      this.db.object('/UserNotices/'+data.uid+'/'+noticeID+'/').remove()
    });
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
            console.log(data.To+" "+ data.Date+ " "+ data.Message)
            this.temp = data.To+" "+ data.Date+ " "+ data.Message
            this.notices.push(this.temp)
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
  } */