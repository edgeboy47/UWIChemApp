//Darrion, Gideon, Ravish, Nathan, Krystel

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
  showButtons = false; // A variable used as a flag and is set depending on the type of user.
  notices:any=[];// An array that will contain notices read from the firebase.

  noticeSub;//A varibale used to subscribe to the notices section in the firebase database.
  typeSub;// A variable used to subscribe to the users type section in the firebase.
  userCoursesSubscription; // A variable used to subscribe to the user courses section in the firebase.
  userSubscription;// A variable used to subscribe to the user section in the firebase.
  courseSubscription;// A variable used to subscribe to the courses section in the firebase.

  courses:any = [];// An array that will contain all courses read from the firebase


  user;//A variable that will contain the user.

  constructor(private fbAuth: AngularFireAuth, public db: AngularFireDatabase, public modalCtrl:ModalController, public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
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
                      let note = { Type: "", date:"", Notes:"", CourseID:"",id:""};
                      note.Type=d['Type']; 
                      note.date=d['date'];
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
  }
/*
IonViewDidLoad() contains the instructions used to read data from the database using subsciptions and stores that data in arrays.
*/
  
  removeNotice(notice){
    this.notices = this.noticeSource;
    this.notices.splice(this.notices.indexOf(notice),1);
    this.db.object('/Events/'+notice.CourseID+'/'+notice.id).remove(); // This line executes the removal of an event in the firebase
                                                                      // database by specifying its location.

    this.noticeSource = [];
    setTimeout(()=>{
      this.noticeSource = this.notices;
    });
  }

  onNoticeSelected(notice){
    let date = moment(notice.date).format('LLLL');

    if(this.showButtons){ // This alert will contain the option to remove an avent when selection since showButtons is true and that indicates 
                          // that the user is a teacher or an admin.
      let alert = this.alertCtrl.create({
        title: ''+notice.Type,
        subTitle: 'Due Date: '+date,
        message: 'Message: '+notice.Notes,
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
    }
  }
}