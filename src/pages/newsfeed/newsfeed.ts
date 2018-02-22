import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';        //Import AngularFireAuth Modular for authentication.

/**
 * Generated class for the NewsfeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsfeed',
  templateUrl: 'newsfeed.html',
})
export class NewsfeedPage {
  newsSubscription;
  news=[];
  News=[];
  showButtons = false;                              //Boolean indicating whether certain buttons should be shown based on user type.
  userSub;
  typeSub;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public db: AngularFireDatabase,
              public auth: AngularFireAuth        //Various constructor declarations
            ) {
  }

  ionViewDidLoad() {
    this.userSub = this.auth.authState.subscribe(data=>{
      if(data){
        this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
          if(d2=='Admin'){
            this.showButtons = true;              //Get the user type and set the showButtons variable according to the type of user. Admin users are allowed to add courses.
          }
        });
      }
    });
    this.newsSubscription = this.db.object('/News').valueChanges().subscribe(data=>{      //Subscribe to the Courses object
    this.news = [];
    this.News = [];
    if(data){                       //If there is data in the news object then store it in the global news list.
      for(let key in data){
        let d = data[key];
        // d['newsID'] = key+" ";    //Insert newsID in the object stored for ease of use.
        this.news.push(d);
        
      }
      this.News = this.news; //
      this.News.sort();
    }
  });
  }

  addNews(){
    // let modal = this.modalCtrl.create('AddCourseModalPage');      //Create a modal to allow admin to enter new course details
    // modal.present();
    // modal.onDidDismiss(data=>{                                    //On dismissal of that modal page get the data and if it exists add the course to the firebase.
    //   if(data){
    //     let obj = {
    //       Available: data.Available,
    //       Name: data.Name,                                        //Create an object with the data returned.
    //       Credits: data.Credits,
    //       Outline: data.Outline,
    //     }

    //     this.db.database.ref('/Courses/').child(data.courseID).set(obj);      //Add the new course to the database.

    //     let newCourses = this.courses;
    //     data.courseID = data.courseID+" ";                                    //Add space for GUI functioning.
    //     newCourses.push(data);
        
    //     this.courses = [];
    //     setTimeout(()=>{
    //       this.courses = newCourses;                                        //Timeout set so that all course list is update in the interface.
    //     });
    //   }
    // });
  }
}
