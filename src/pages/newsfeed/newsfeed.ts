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
  news=[];
  newsSub;

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
    this.newsSub = this.db.list('/News/').valueChanges().subscribe(data=>{
      if (data){
        this.news=data;
        this.news.sort();
      }
        
    });
  }

  addNews(){
    // let modal = this.modalCtrl.create('AddNewsModalPage');      //Create a modal to allow admin to enter new course details
    // modal.present();
    // modal.onDidDismiss(data=>{                                    //On dismissal of that modal page get the data and if it exists add the news to the firebase.
    //   if(data){
    //     let obj = {
    //       title: data.Title,
    //       story: data.Story,                                        //Create an object with the data returned.
    //     }

    //     this.db.database.ref('/News/').child(data).set(obj);      //Add the new course to the database.

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
