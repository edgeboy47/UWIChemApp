import { Component } from '@angular/core';
import { IonicPage, ModalController ,NavController, NavParams, AlertController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase } from 'angularfire2/database';

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
  noticeSource= [];
  noticeID;
  showButtons = false;
  constructor(private fbAuth: AngularFireAuth, public db: AngularFireDatabase, public modalCtrl:ModalController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
  }
  
  ionViewDidLoad() {
    this.noticeID = this.navParams.get('noticeID');
    console.log(this.noticeID);
    this.db.object('/Notices/'+this.noticeID).valueChanges().subscribe(data=>{
      let notices= this.noticeSource;
      for(let key in data){
        let d = data[key];
        let note = {title: "", Message: "", Recipient:"", Date:"", id:""};
        
        note.title = d['title'];
        note.Message = d['Message'];
        note.Recipient = d['Recipient'];
        note.Date = d['Date'];
        note.id = key;

        notices.push(note);
      }

      this.noticeSource = [];
      setTimeout(()=>{
        this.noticeSource = notices;
      });
    });

    this.fbAuth.authState.subscribe(data=>{
      this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
        if(d2=='Teacher' || d2=='Admin'){
          this.showButtons = true;
        }
      });
    });
  }





  addNotice(){
    let modal = this.modalCtrl.create('NoticesModalPage');
    modal.present();
    modal.onDidDismiss(data=>{
      if(data){
        let noticeData = data;

        

        this.db.list('/Notices/'+this.noticeID).push({
          Recipient: noticeData.Recipient,
          title: noticeData.title,
          Message: noticeData.Message,
        });

        let notices = this.noticeSource;
        notices.push(noticeData);

        this.noticeSource = [];
        setTimeout(()=>{
          this.noticeSource = notices;
        });
      }
    })
  }

 /* onViewTitleChanged(title){
    this.viewTitle = title;
  }

  onTimeSelected(note){
    this.selectedDay = note.selectedTime;
  }*/

  removeNotice(notice){
    let notices = this.noticeSource;
    notices.splice(notices.indexOf(notice),1);
    
    this.db.object('/Notices/'+this.noticeID+'/'+notice.id+'/').remove();

    this.noticeSource = [];
    setTimeout(()=>{
      this.noticeSource = notices;
    });
    
  }

  onNoticeSelected(notice){
    

    if(this.showButtons){
      let alert = this.alertCtrl.create({
        title: ''+notice.title,
        subTitle: 'Due Date: '+notice.Date,
        message: 'Message: '+notice.Message,
        buttons: [
          {
            text: 'OK',
          },
          {
            text: 'Remove',
            handler: ()=>{
              this.removeNotice(notice);
            }
          }
        ]
      });
      alert.present();
    }else{
      let alert = this.alertCtrl.create({
        title: ''+notice.title,
        subTitle: 'Due Date: '+notice.Date,
        message: 'Message: '+notice.Message,
        buttons: [
          {
            text: 'OK',
          },
        ]
      });
      alert.present();
    }
  

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