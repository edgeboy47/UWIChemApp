import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

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
  
    calendar = {
      mode: 'month',
      currentDate: new Date()
    };
  
    viewTitle: string;
    eventSource = [];
    selectedDay = new Date();
  
    constructor(public navCtrl: NavController,  private modalCtrl:ModalController, private alertCtrl: AlertController, public navParams: NavParams) {
  
    }
  
    ionViewDidLoad() {
      this.courseID = this.navParams.get('courseID');
      console.log(this.courseID);
    }
  
    addEvent(){
      let modal = this.modalCtrl.create('EventModalPage',{selectedDay:this.selectedDay});
      modal.present();
      modal.onDidDismiss(data=>{
        if(data){
          let eventData = data;
  
          eventData.startTime = new Date(data.startTime);
          eventData.endTime = new Date(data.endTime);
  
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
      
      this.eventSource = [];
      setTimeout(()=>{
        this.eventSource = events;
      });
      
    }

    onEventSelected(event){
      let end = moment(event.endTime).format('LLLL');
  
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
    }

}
