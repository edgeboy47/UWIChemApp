import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';
import {DatabaseProvider} from '../../providers/database/database';

/**
 * Generated class for the CourseDetailsPage page.
 * This class displays all the details for a user chosen course, as well as allows the user to add the course
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-details',
  templateUrl: 'course-details.html',
})
export class CourseDetailsPage  implements OnDestroy{
  course={courseID:"",available:false, name:"",outline:"",credits:""}; //Course object
  showButton=true;
  user; 
  userSub; 
  userCourseSub; 
  typeSub;
  courseSub; //Variable to hold the course chosen
  alldegrees = [];
  degrees = [];
  showDegrees = false;

  constructor(private fbAuth: AngularFireAuth, 
              public navCtrl: NavController, 
              public navParams: NavParams , 
              public db: AngularFireDatabase,
              public toasty: ToastController,
              public dbProv: DatabaseProvider,
            ){
    
  }

  //Unsubscribing all created objects
  ngOnDestroy(){
    if(this.courseSub)
      this.courseSub.unsubscribe();
    if(this.userCourseSub)
      this.userCourseSub.unsubscribe();
    if(this.userSub)
      this.userSub.unsubscribe();
  }

  ionViewDidLoad() {
    this.course.courseID = this.navParams.get('courseID');
   
    this.userSub = this.fbAuth.authState.subscribe(data=>{
      if(data){
        this.user = data;
        this.userCourseSub = this.db.object('/UserCourses/'+data.uid+'/'+this.course.courseID).valueChanges().subscribe(data=>{
          if(data!=null)this.showButton = false;
        })

        this.typeSub = this.dbProv.getUserType().subscribe(d2=>{
          if(d2=='Admin'){
            this.showDegrees = true;              //Get the user type and set the showButtons variable according to the type of user. Admin users are allowed to add courses.
          }else{
            this.showDegrees = false;
          }
        });
      }      
    });
   

    //Storing chosen course object by retrieving from firebase
    this.courseSub = this.db.object('/Courses/'+this.course.courseID).valueChanges().subscribe(data=>{
      this.course.name = data['Name'];
      this.course.outline = data['Outline'];
      this.course.available = data['Available'];
      this.course.credits = data['Credits'];
      this.degrees = data['Degrees'];

      this.db.object('/Degrees/').valueChanges().subscribe(data2=>{
        this.alldegrees = [];
        
        if(data2){
          for(let key in data2){
            let d = data2[key];
            d['Name'] = key;
            if(this.degrees)
              d['Chosen'] = this.degrees[key];
            this.alldegrees.push(d);
          }
        }
      });
    });
  }
  
  //Adding the chosen course to the user's courses by adding it to Firebase
  addCourse(){
    let id = this.course.courseID;
    let name = this.course.name;
    
    if(this.user){
      this.db.database.ref('/UserCourses/').child(this.user.uid).child(id).set(name);
      this.showButton = false;
      
      //Creating and displaying notification of course being added
      let toast = this.toasty.create({
        message: 'You added '+this.course.courseID+' to your courses!',
        duration: 1000,
        showCloseButton: true,
        position: 'bottom'
      });
    
      toast.present();
    }
  }

  save(){
    let c = {};
    for(let degree of this.alldegrees){
      if(degree['Chosen']){
        c[degree['Name']] = true;
        this.db.database.ref('/Degrees/'+degree['Name']+'/Courses').child(this.course.courseID).set(true);        
      }else{
        this.db.database.ref('/Degrees/'+degree['Name']+'/Courses').child(this.course.courseID).remove();                
      }
    }
    this.db.database.ref('/Courses/'+this.course.courseID+'/Degrees/').set(c);
    
    let toast = this.toasty.create({
      message: "Course Saved",
      duration: 1000,
      showCloseButton: true,
      position: 'bottom'
    });

    toast.present();
  }
}
