//Darrion, Gideon, Nathan, Krystel

/*The notices page loads all the events (Which can be an assignment, test or general notice per course)
to every course the user(student, teacher or admin) has subscribed. If the user is an admin or teacher, 
then the option to remove an event is given. A student can only view notices. 

Therefore, below, the courses, user courses, user and notices are read from the firebase database. 
The courses are read first, the notices, the users and then the user courses in a nested function.
If the course for a notice stored in the notice section of the database corresponds to a course found in
the user courses section of the database for the current user then that notice is saved into an array called notices[]. 
After all relevent noticeshave been stored, the notices array is copied into another array called noticeSource.

The removeNotice function takes a notice as a parameter and removes it from the array of notices as well as 
the database. 

The onNoticeSelected funtion takes in a notice and uses alertController to display the details of the event in a 
more readable manner to the user with details, such as. the date of the event and any message attached to the event.*/


import { Component, OnDestroy } from '@angular/core';
import { IonicPage, ModalController ,NavController, NavParams, AlertController } from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-notices',
  templateUrl: 'notices.html',
})


export class NoticesPage implements OnDestroy{
  noticeSource= [];// An array that will contain all notices read from the firebase
  courses:any = [];// An array that will contain all courses read from the firebase
  departmentNoticeSource = [];
  notices:any=[];// An array that will contain notices read from the firebase.

  showButtons = false; // A variable used as a flag and is set depending on the type of user.
  user;//A variable that will contain the user.
  
  noticeSub;//A varibale used to subscribe to the notices section in the firebase database.
  typeSub;// A variable used to subscribe to the users type section in the firebase.
  userCoursesSubscription; // A variable used to subscribe to the user courses section in the firebase.
  userSubscription;// A variable used to subscribe to the user section in the firebase.
  courseSubscription;// A variable used to subscribe to the courses section in the firebase.
  departmentNoticeSub;
  constructor(private fbAuth: AngularFireAuth, 
              public db: AngularFireDatabase, 
              public modalCtrl:ModalController, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public alertCtrl:AlertController) {
  }


  ngOnDestroy(){
    if(this.noticeSub)
      this.noticeSub.unsubscribe();
    if(this.typeSub)
      this.typeSub.unsubscribe();
    if(this.userCoursesSubscription)
      this.userCoursesSubscription.unsubscribe();
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
    if(this.courseSubscription)
      this.courseSubscription.unsubscribe();
    if(this.departmentNoticeSub)
      this.departmentNoticeSub.unsubscribe();
  }
  // NgOnDestroy is a function used to execute instructions when the user leaved the page. In this case, it is used to unsubcribe from
  //all subscription made in the ionViewDidLoad function.


  ionViewDidLoad() {
    this.courseSubscription = this.db.list('/Courses/').valueChanges().subscribe(()=>{
      this.noticeSub= this.db.object('/Events/').valueChanges().subscribe(events=>{
        this.userSubscription = this.fbAuth.authState.subscribe(user=>{
          if(user){
            this.typeSub = this.db.object('/Users/'+user.uid+'/type/').valueChanges().subscribe(d2=>{
              if(d2=='Teacher' || d2=='Admin'){
                this.showButtons = true;
              }
            });
            this.user = user;
            this.userCoursesSubscription = this.db.object('/UserCourses/'+user.uid).valueChanges().subscribe(usercourses=>{
              this.courses = [];
              this.noticeSource = [];
              this.notices = [];
              for(let key in usercourses){
                this.db.database.ref('/Courses/'+key+'/').once('value',(existance)=>{
                  if(existance.exists()){
                    let course = {courseID:key,Name:usercourses[key]};
                    this.courses.push(course);
                      
                    let courseNotices = events[key];
                    for(let notice in courseNotices){
                      let d = courseNotices[notice];
                      let note = { Type: "", date:"",title:"", Notes:"", CourseID:"",id:"",resource:""};
                      note.Type=d['Type'];
                      note.date=moment(new Date(d['date'])).format('LLLL');
                      note.resource=d['resource'];
                      note.title=d['title'];
                      note.Notes=d['Notes'];  
                      note.CourseID=key; 
                      note.id=notice;
                      this.notices.push(note);
                    }
                  }else
                    this.db.object('/UserCourses/'+user.uid+'/'+key).remove();
                });         
              }
              this.noticeSource = this.notices;
            });
          }
        });
      });
    });
    this.departmentNoticeSub = this.db.object('/DepartmentEvents/').valueChanges().subscribe(data=>{     //took our +this.courseID from the path      //Get all the events of the current course.
      if(data){                                 //If the course has events then continue.
        let departmentNotices= this.departmentNoticeSource;
        for(let key in data){                   //For each event retrieved, create an object to store the relevant info and add it to the global events list.
          let d = data[key];
          let ev = {resource:"",date:"", Notes:"",title: "",Type: "", id:""};
          
          ev.date=moment(new Date(d['date'])).format('LLLL');
          ev.title = d['title'];              //Set the corresponding fields of the newly created object
          ev.Type = d['Type'];
          ev.Notes=d['Notes']; 
          ev.resource= d['resource'];
          ev.id = key;

          departmentNotices.push(ev);                    //Add object to the temp events list.
        }

        this.departmentNoticeSource = [];
        setTimeout(()=>{                      //Set Timeout that will allow interface to be update
          this.departmentNoticeSource = departmentNotices;          //Update global eventSource list for calendar element.
        });
      }
    });
  }// end ionViewDidLoad()
/*
IonViewDidLoad() contains the instructions used to read data from the database using subsciptions and stores that data in arrays.
*/
  

  addDepartmentEvent(){
    let modal = this.modalCtrl.create('DepartmentEventModalPage',{});     //Create modal for user to enter relevant info
    modal.present();                                                                        //Present that modal
    modal.onDidDismiss(data=>{
      if(data){                             //If data was retrieved from the modal then continue to add the event to the firebase
        let eventData = data;

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);           //Convert dates strings to actual dates

        this.db.list('/DepartmentEvents/').push({    //tooke out  +this.courseID from path     //Push retrieved event to the database.
          date: eventData.endTime.toISOString(),
          Notes: eventData.Notes, 
          Type: eventData.type,
          title: eventData.title,
          resource:"",
        });

        let departmentNotices = this.departmentNoticeSource;
        departmentNotices.push(eventData);
        
        this.departmentNoticeSource = [];
        setTimeout(()=>{                            //Set timeout to update user interface.
          this.departmentNoticeSource = departmentNotices;                //Set global eventsSource list for the calendar element.
        });
      }
    })
  } // end addDepartmentEvent()

  removeDepartmentEvent(D_notice){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'This cannot be undone',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          handler: ()=>{
            alert.present();
            let departmentNotices = this.departmentNoticeSource;
            departmentNotices.splice(departmentNotices.indexOf(D_notice),1);   //get event that is selected.
            
            this.db.object('/DepartmentEvents/'+D_notice.id+'/').remove();  //Removes +this.courseID from path //Remove it from firebase.

            this.departmentNoticeSource  = [];
            setTimeout(()=>{
              this.departmentNoticeSource = departmentNotices;                //Set timeout and update user interface by setting the global eventSource used by the calendar element
            });
          }
        }
      ]
    });
    alert.present();
  }// end removeDepartmentEvent(event)



  removeNotice(notice){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'This cannot be undone',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          handler: ()=>{
            this.notices = this.noticeSource;
            this.notices.splice(this.notices.indexOf(notice),1);
            this.db.object('/Events/'+notice.CourseID+'/'+notice.id).remove(); // This line executes the removal of an event in the firebase
                                                                              // database by specifying its location.

            this.noticeSource = [];
            setTimeout(()=>{
              this.noticeSource = this.notices;
            });
          }
        }
      ]
    });
    alert.present();    
  }// end removeNotice(notice)

  onNoticeSelected(notice){
    //let date = moment(notice.date).format('LLLL');
    let modal = this.modalCtrl.create('NoticeViewModalPage',{noticeG:notice});
    //,{Date:this.notice.date},{Title:this.notice.title},{Notes:this.notice.Notes},{Resource:this.notice.resource});     //Create modal for user to enter relevant info
    modal.present();                                                                        //Present that modal
   /* if(this.showButtons){ // This alert will contain the option to remove an avent when selection since showButtons is true and that indicates 
                          // that the user is a teacher or an admin.
      let alert = this.alertCtrl.create({
        title: ''+notice.Type,
        subTitle: 'Due Date: '+date,
        message: 'Message: '+notice.Notes+ '\n Resource: '+notice.resource,
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
    }else{//If the user is a student then the option to remove the event is not given.
      let alert = this.alertCtrl.create({
        title: ''+notice.Type,
        subTitle: 'Due Date: '+date,
        message: 'Message: '+notice.Notes,
        buttons: [
          {
            text: 'OK',
          },
        ]
      });
      alert.present();
    }*/
  }//end onNoticeSelected(notice)


  onD_NoticeSelected(departmentNotice){
    //let date = moment(departmentNotice.date).format('LLLL');
    let modal = this.modalCtrl.create('NoticeViewModalPage',{noticeG:departmentNotice});
    modal.present();                                                                        
    /*if(this.showButtons){ // This alert will contain the option to remove an avent when selection since showButtons is true and that indicates 
                          // that the user is a teacher or an admin.
      let alert = this.alertCtrl.create({
        title: ''+departmentNotice.type +'|' +departmentNotice.title ,
        subTitle: 'Date: '+date,
        message: 'Message: '+departmentNotice.Notes,
        buttons: [
          {
            text: 'OK',
          },
          {
            text: 'Remove',
            handler: ()=>{
              this.removeDepartmentEvent(departmentNotice);
            }
          }
        ]
      });
      alert.present();
    }else{//If the user is a student then the option to remove the event is not given.
      let alert = this.alertCtrl.create({
        title: ''+departmentNotice.title,
        subTitle: 'Due Date: '+date,
        message: 'Message: '+departmentNotice.Notes,
        buttons: [
          {
            text: 'OK',
          },
        ]
      });
      alert.present();
    }*/
  }// end onD_NoticeSelected(departmentNotices)
}// end export class