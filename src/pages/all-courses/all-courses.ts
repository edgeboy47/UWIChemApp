//Various Imports
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, ModalController,  NavParams, AlertController } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';        //Import AngularFireAuth Modular for authentication.


@IonicPage()
@Component({
  selector: 'page-all-courses',
  templateUrl: 'all-courses.html',
})
export class AllCoursesPage implements OnDestroy{
  coursesSubscription;                              //Variable used to store a subscription to the course object in the database.
  userSub;                                          //Variable used to store a subscription to the User object in the firebase.
  typeSub;                                          //Variable used to store a subscription to the User/Type field in the databse.
  courses:any = [];                                 //Stores all the courses from the firebase.
  dCourses=[];                                      //Stores courses to be displayed to user. (Facilitates search function)
  showButtons = false;                              //Boolean indicating whether certain buttons should be shown based on user type.
  degree;
  degreeSub;
  degrees = [];
  showdegrees = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public db: AngularFireDatabase,
              public auth: AngularFireAuth,          //Various constructor declarations
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
    
  }

  /*
    This function unsubscribes from all subscriptions to avoid
    the error of failed permission being shown to the user when 
    loggin out.
  */
  ngOnDestroy(){
    if(this.coursesSubscription)
      this.coursesSubscription.unsubscribe();
    if(this.typeSub)                              
      this.typeSub.unsubscribe();
    if(this.userSub)
      this.userSub.unsubscribe();
    if(this.degreeSub){
      this.degreeSub.unsubscribe();
    }
  }

  ionViewDidLoad() {

    this.degreeSub = this.db.object('/Degrees').valueChanges().subscribe(data=>{
      this.degrees = [];
      this.showdegrees = [];
      if(data){
        for(let key in data){
          let d = data[key];
          d['Name'] = key;
          this.degrees.push(d);
        }
        this.showdegrees = this.degrees;
      }
    });

    this.coursesSubscription = this.db.object('/Courses').valueChanges().subscribe(data=>{      //Subscribe to the Courses object
      this.courses = [];                                                                        //Reset courses
      this.dCourses = [];
      if(data){                       //If there is data in the courses object then store it in the global courses list.
        for(let key in data){
          let d = data[key];
          d['courseID'] = key+" ";    //Insert courseID in the object stored for ease of use.
          this.courses.push(d);
        }
        this.dCourses = this.courses; //Update the courses to the read courses to be displayed to the user.
      }
    });


    this.userSub = this.auth.authState.subscribe(data=>{
      if(data){
        this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
          if(d2=='Admin'){
            this.showButtons = true;              //Get the user type and set the showButtons variable according to the type of user. Admin users are allowed to add courses.
          }
        });
      }
    });
  }

  onChange(){
    if(this.degree!=""){
      this.dCourses = [];
      for(let key in this.degree['Courses']){
        for(let course of this.courses){
          if(course['courseID']==key+" "){
            this.dCourses.push(course);
          }
        }
      }
    }else this.dCourses = this.courses;
  }

  navigateToDetails(courseID:string){                 //Simply navigate to CourseDetails page with the course id passed as an argument
    courseID = courseID.replace(/^\s+|\s+$/g, "");    //Strip the courseID of added spaces
    this.navCtrl.push('CourseDetailsPage',{courseID});
  }

  getItems(ev: any) {                                 //Function simply gets courses based on what user searches
    this.dCourses = this.courses;
    let val = ev.target.value;

    if (val && val.trim() != '') {                          //If Entered the value is not empty then filter the dCourses list to display only courses that match the user's search
      this.dCourses = this.courses.filter((item) => {
        return ((item['Name'].toLowerCase().indexOf(val.toLowerCase()) > -1)||
                (item['courseID'].toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  }

  /*
    This function allows the admin to add a course
  */ 
  addCourse(){
    let modal = this.modalCtrl.create('AddCourseModalPage');      //Create a modal to allow admin to enter new course details
    modal.present();
    modal.onDidDismiss(data=>{                                    //On dismissal of that modal page get the data and if it exists add the course to the firebase.
      if(data){
        let obj = {
          Available: data.Available,
          Name: data.Name,                                        //Create an object with the data returned.
          Credits: data.Credits,
          Outline: data.Outline,
        }

        this.db.database.ref('/Courses/').child(data.courseID).set(obj);      //Add the new course to the database.

        let newCourses = this.courses;
        data.courseID = data.courseID+" ";                                    //Add space for GUI functioning.
        newCourses.push(data);
        
        this.courses = [];
        setTimeout(()=>{
          this.courses = newCourses;                                        //Timeout set so that all course list is update in the interface.
        });
      }
    });
  }


  /*
    Facilitates admin functionality of removing courses.
  */
  removeCourse(courseID:string){
    courseID = courseID.replace(/^\s+|\s+$/g, "");          //Remove added spaces from courseID.

    let alert = this.alertCtrl.create({                     //Create an alert that the action cannot be undone.
      title: 'Are You Sure?',
      message: 'This cannot be undone',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          handler: ()=>{
            this.db.object('/Courses/'+courseID).remove();    //Remove the Course and the Events related to that course from the database.
            this.db.object('/Events/'+courseID).remove();
                                                              //A particular user's courses list will be updated once they log in so that the remove function is not processing power intensive.
          }
        }
      ]
    });
    alert.present();        //Present the alert.
  }
}
