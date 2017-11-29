import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

  courseID;
  showButtons = false;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  viewTitle: string;
  eventSource = [];
  selectedDay = new Date();

  constructor(private fbAuth: AngularFireAuth, public navCtrl: NavController,  private modalCtrl:ModalController, private alertCtrl: AlertController, public navParams: NavParams, public db: AngularFireDatabase) {

  }

  ionViewDidLoad() {
    this.courseID = this.navParams.get('courseID');
    console.log(this.courseID);
    this.db.object('/Events/'+this.courseID).valueChanges().subscribe(data=>{
      let events= this.eventSource;
      for(let key in data){
        let d = data[key];
        let ev = {startTime: new Date(), endTime: new Date(), title: "", type: "", id:""};
        
        ev.endTime = new Date(d['date']);
        ev.startTime = ev.endTime;
        ev.title = d['Notes'];
        ev.type = d['Type'];
        
        ev.id = key;

        events.push(ev);
      }

      this.eventSource = [];
      setTimeout(()=>{
        this.eventSource = events;
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

  addEvent(){
    let modal = this.modalCtrl.create('EventModalPage',{selectedDay:this.selectedDay});
    modal.present();
    modal.onDidDismiss(data=>{
      if(data){
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        this.db.list('/Events/'+this.courseID).push({
          date: eventData.endTime.toISOString(),
          Notes: eventData.title,
          Type: eventData.type,
        });

        let events = this.eventSource;
        events.push(eventData);

        this.eventSource = [];
        setTimeout(()=>{
          this.eventSource = events;
        });
      }
    })
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }

  onTimeSelected(ev){
    this.selectedDay = ev.selectedTime;
  }

  removeEvent(event){
    let events = this.eventSource;
    events.splice(events.indexOf(event),1);
    
    this.db.object('/Events/'+this.courseID+'/'+event.id+'/').remove();

    this.eventSource = [];
    setTimeout(()=>{
      this.eventSource = events;
    });
    
  }

  onEventSelected(event){
    console.log(event.endTime);
    let end = moment(event.endTime).format('LLLL');
    console.log(end);

    if(this.showButtons){
      let alert = this.alertCtrl.create({
        title: ''+event.title,
        subTitle: 'Due Date: '+end,
        message: 'Type: '+event.type,
        buttons: [
          {
            text: 'OK',
          },
          {
            text: 'Remove',
            handler: ()=>{
              this.removeEvent(event);
            }
          }
        ]
      });
      alert.present();
    }else{
      let alert = this.alertCtrl.create({
        title: ''+event.title,
        subTitle: 'Due Date: '+end,
        message: 'Type: '+event.type,
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
