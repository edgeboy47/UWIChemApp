//Various Imports
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';  //Import AngularFire database to utilize firebase
import { AngularFireAuth } from 'angularfire2/auth';        //Import AngularFireAuth Modular for authentication.
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the UserCoursesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-courses',
  templateUrl: 'user-courses.html',
})
export class UserCoursesPage implements OnDestroy{
  courses:any = [];                                         //Holds the user's courses
  userCoursesSubscription;                              
  userSubscription;                                         //Variables to hold observable subscriptions
  courseSubscription;
  user;                                                     //Holds the current user auth object.

  constructor(public fbAuth: AngularFireAuth, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public db: AngularFireDatabase,           //Various Constructor Declarations.
              public toasty: ToastController,
              public alerty: AlertController) {
    
  }


  /*
    This function unsubscribes from all subscriptions to avoid
    the error of failed permission being shown to the user when 
    loggin out.
  */
  ngOnDestroy(){
    if(this.userCoursesSubscription)
      this.userCoursesSubscription.unsubscribe();
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
    if(this.courseSubscription)
      this.courseSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCoursesPage');
    this.courseSubscription = this.db.list('/Courses/').valueChanges().subscribe(()=>{      //Get all courses, this subscription is to update the user's courses if the courses in the database change (all courses).
      this.loadUserCourses();
    });
  }

  loadUserCourses(){
    this.userSubscription = this.fbAuth.authState.subscribe(data1=>{                        //Subscribe to the authState
      if(data1){                                                                            //If the user is authenticated then continue.
        this.user = data1;
        this.userCoursesSubscription = this.db.object('/UserCourses/'+data1.uid).valueChanges().subscribe(data=>{   //Subscribe to the UserCourses object to retrieve the courses of a particular user.
          this.courses = [];                                                        //Reset the courses variable
          for(let key in data){                                                     //For each course of the courses retreived, check to see if that course exists.
            this.db.database.ref('/Courses/'+key+'/').once('value',(existance)=>{
              if(existance.exists()){
                let course = {courseID:key,Name:data[key]};                         //If the course exists then add it to the user's local list of courses.
                this.courses.push(course);
              }else
                this.db.object('/UserCourses/'+data1.uid+'/'+key).remove();         //Otherwise, clean up firebase by removing that user's course entry.
            });         
          }
        });
      }
    });
  }

  navigateToCalendar(courseID:string){
    this.navCtrl.push('CalendarPage',{courseID});       //Navigate to the calendar view, passing the id of the current course selected.
  }


  /*
    This function allows a user to simply remove or unsubscribe from a course
    so that it does not show up in their courses list.
  */
  removeCourse(courseID:string){
    let toast;

    if(this.user){
      this.db.object('/UserCourses/'+this.user.uid+'/'+courseID+'/').remove()       //Remove course specified

      toast = this.toasty.create({
        message: "Removed "+courseID,                           //Present confirmation toast.
        duration: 1000,
        position: 'bottom',
        showCloseButton: true
      });

    }else{
      toast = this.toasty.create({
        message: "Remove Failed!"+courseID,
        duration: 1000,                                         //If removal failed, present appropriate toast (never really happens, just incase)
        position: 'bottom',
        showCloseButton: true
      });
    }
  
    toast.present();                                    //Present the toast to the user.
  }

  /*
    Present log out confirmation
  */
  logOut(){                                         
    let alert = this.alerty.create({                      //Create confirmation alert.
      title: 'Log Out',
      message: 'Are You Sure you want to Log Out?',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: ()=>{
            this.realLogOut();                            //Execute real log out if Yes button is pressed.
          }
        }
      ]
    });

    alert.present();                            //Present the alert.
  }

  /*
    This function reall logs the user out.
  */
  realLogOut(){
    return this.fbAuth.auth.signOut().then(()=>{
      console.log("it worked");                     //Upon signOut promise, simply send the user back to the starting page.
      this.navCtrl.setRoot("DepartmentsPage");
    })
  }
}
