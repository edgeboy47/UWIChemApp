//Various imports
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import {AngularFireDatabase} from 'angularfire2/database';  //Import AngularFire database to utilize firebase
import { AngularFireAuth } from 'angularfire2/auth';        //Import AngularFireAuth Modular for authentication.


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
export class CalendarPage implements OnDestroy{

  courseID;                     //Stores the retreived courseID from the navParams
  showButtons = false;          //Stores whether or not certain buttons should be shown based on user types.

  //Variables to store values needed by the calendar html element.
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  viewTitle: string;
  eventSource = [];
  departmentNoticeSource = [];
  selectedDay = new Date();

  //Variables to store user subscriptions
  userSub;
  typeSub;
  eventSub;
  departmentNoticeSub;

  constructor(private fbAuth: AngularFireAuth, 
              public navCtrl: NavController,            //Various Constructor declarations.
              private modalCtrl:ModalController, 
              private alertCtrl: AlertController, 
              public navParams: NavParams, 
              public db: AngularFireDatabase) {

  }


  /*
    This function unsubscribes from all subscriptions to avoid
    the error of failed permission being shown to the user when 
    loggin out.
  */
  ngOnDestroy(){
    if(this.eventSub)
      this.eventSub.unsubscribe();
    if(this.typeSub)
      this.typeSub.unsubscribe();
    if(this.userSub)
      this.userSub.unsubscribe();
    if(this.departmentNoticeSub)
      this.departmentNoticeSub.unsubscribe();
  }

  ionViewDidLoad() {
    this.courseID = this.navParams.get('courseID');       //Get selected courseID from the navParams
    console.log(this.courseID);
    this.eventSub = this.db.object('/Events/'+this.courseID).valueChanges().subscribe(data=>{           //Get all the events of the current course.
      if(data){                                 //If the course has events then continue.
        let events= this.eventSource;
        for(let key in data){                   //For each event retrieved, create an object to store the relevant info and add it to the global events list.
          let d = data[key];
          let ev = {startTime: new Date(), endTime: new Date(), title: "", type: "", resource: "", id:""};
          
          ev.endTime = new Date(d['date']);
          ev.startTime = ev.endTime;
          ev.title = d['Notes'];              //Set the corresponding fields of the newly created object
          ev.type = d['Type'];
          ev.resource = d['resource'];
          
          ev.id = key;

          events.push(ev);                    //Add object to the temp events list.
        }

        this.eventSource = [];
        setTimeout(()=>{                      //Set Timeout that will allow interface to be update
          this.eventSource = events;          //Update global eventSource list for calendar element.
        });
      }
    });

    this.userSub = this.fbAuth.authState.subscribe(data=>{                                      
      this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
        if(d2=='Teacher' || d2=='Admin'){                     //Determine whether the user should be able to add or remove events.
          this.showButtons = true;                            //Set the showButtons to true if user is a teacher or admin.                      
        }
      });
    });

    this.departmentNoticeSub = this.db.object('/DepartmentEvents/'+this.courseID).valueChanges().subscribe(data=>{           //Get all the events of the current course.
      if(data){                                 //If the course has events then continue.
        let departmentNotices= this.departmentNoticeSource;
        for(let key in data){                   //For each event retrieved, create an object to store the relevant info and add it to the global events list.
          let d = data[key];
          let ev = {startTime: new Date(), endTime: new Date(), title: "",type: "", id:""};
          
          ev.endTime = new Date(d['date']);
          ev.startTime = ev.endTime;
          ev.title = d['Notes'];              //Set the corresponding fields of the newly created object
          ev.type = d['Type'];
          
          ev.id = key;

          departmentNotices.push(ev);                    //Add object to the temp events list.
        }

        this.departmentNoticeSource = [];
        setTimeout(()=>{                      //Set Timeout that will allow interface to be update
          this.departmentNoticeSource = departmentNotices;          //Update global eventSource list for calendar element.
        });
      }
    });



  }

  /*
    This function allows users to add events.
  */
  addEvent(){
    let modal = this.modalCtrl.create('EventModalPage',{selectedDay:this.selectedDay});     //Create modal for user to enter relevant info
    modal.present();                                                                        //Present that modal
    modal.onDidDismiss(data=>{
      if(data){                             //If data was retrieved from the modal then continue to add the event to the firebase
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);           //Convert dates strings to actual dates

        this.db.list('/Events/'+this.courseID).push({         //Push retrieved event to the database.
          date: eventData.endTime.toISOString(),
          Notes: eventData.title,                 
          Type: eventData.type,
          resource: eventData.resource,
        });

        let events = this.eventSource;
        events.push(eventData);
        
        this.eventSource = [];
        setTimeout(()=>{                            //Set timeout to update user interface.
          this.eventSource = events;                //Set global eventsSource list for the calendar element.
        });
      }
    })
  }

  addDepartmentEvent(){
    let modal = this.modalCtrl.create('DepartmentEventModalPage',{selectedDay:this.selectedDay});     //Create modal for user to enter relevant info
    modal.present();                                                                        //Present that modal
    modal.onDidDismiss(data=>{
      if(data){                             //If data was retrieved from the modal then continue to add the event to the firebase
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);           //Convert dates strings to actual dates

        this.db.list('/DepartmentEvents/'+this.courseID).push({         //Push retrieved event to the database.
          date: eventData.endTime.toISOString(),
          Notes: eventData.title, 
          Type: eventData.type,
        });

        let departmentNotices = this.departmentNoticeSource;
        departmentNotices.push(eventData);
        
        this.departmentNoticeSource = [];
        setTimeout(()=>{                            //Set timeout to update user interface.
          this.departmentNoticeSource = departmentNotices;                //Set global eventsSource list for the calendar element.
        });
      }
    })
  }



  /*
    Funcition that the calendar uses to set the title.
  */
  onViewTitleChanged(title){
    this.viewTitle = title;       //The title is the current course
  }


  /*
    When a day is selected on the calendar update the
    local selectedDay variable to it.
  */
  onTimeSelected(ev){
    this.selectedDay = ev.selectedTime;
  }


  /*
    Function allows the removal of events.
  */
  removeEvent(event){
    let events = this.eventSource;
    events.splice(events.indexOf(event),1);   //get event that is selected.
    
    this.db.object('/Events/'+this.courseID+'/'+event.id+'/').remove();   //Remove it from firebase.

    this.eventSource = [];
    setTimeout(()=>{
      this.eventSource = events;                //Set timeout and update user interface by setting the global eventSource used by the calendar element
    });
    
  }

  removeDepartmentEvent(event){
    let departmentNotices = this.departmentNoticeSource;
    departmentNotices.splice(departmentNotices.indexOf(event),1);   //get event that is selected.
    
    this.db.object('/DepartmentEvents/'+this.courseID+'/'+event.id+'/').remove();   //Remove it from firebase.

    this.eventSource = [];
    setTimeout(()=>{
      this.departmentNoticeSource = departmentNotices;                //Set timeout and update user interface by setting the global eventSource used by the calendar element
    });
    
  }


  /*
    This function shows an alert with more information about an event when it is selected
    from the list of events in the calendar.
  */
  onEventSelected(event){
    console.log(event.endTime);
    let end = moment(event.endTime).format('LLLL');
    console.log(end);

    if(this.showButtons){                               //If the user is a teacher or admin then allow them to remove courses.
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
              this.removeEvent(event);          //Call the removeEvent function with the event selected passed as an argument if the remove button is pressed.
            }
          }
        ]
      });
      alert.present();                          //Present alert
    }else{                                      //Otherwise, only allow them to view event details.
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
      alert.present();                        //Present alert
    }
  }
}
