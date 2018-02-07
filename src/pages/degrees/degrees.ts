import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-degrees',
  templateUrl: 'degrees.html',
})
export class DegreesPage implements OnDestroy {
  
  degreeSub;
  userSub;
  typeSub;
  degrees:any = [];
  showdegrees = [];
  showButtons = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public db: AngularFireDatabase,
              public auth:AngularFireAuth,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController
              ) {
  }

  ngOnDestroy(){
    if(this.degreeSub)
      this.degreeSub.unsubscribe();
    if(this.typeSub)                              
      this.typeSub.unsubscribe();
    if(this.userSub)
      this.userSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DegreesPage');
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

    this.userSub = this.auth.authState.subscribe(data=>{
      this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
        if(d2=='Admin'){
          this.showButtons = true;              //Get the user type and set the showButtons variable according to the type of user. Admin users are allowed to add courses.
        }
      });
    });
  }

  /*
    This function allows the admin to add a course
  */ 
  addDegree(){
    let modal = this.modalCtrl.create('AddDegreeModalPage');      //Create a modal to allow admin to enter new course details
    modal.present();
    modal.onDidDismiss(data=>{                                    //On dismissal of that modal page get the data and if it exists add the course to the firebase.
      if(data){
        let obj = {
          credits: 0,                                        //Create an object with the data returned.
        }

        this.db.database.ref('/Degrees/').child(data.Name).set(obj);      //Add the new course to the database.

        let newDegrees = this.degrees;                                  //Add space for GUI functioning.
        newDegrees.push(data);
        
        this.degrees = [];
        setTimeout(()=>{
          this.degrees = newDegrees;                                        //Timeout set so that all course list is update in the interface.
        });
      }
    });
  }

  /*
    Facilitates admin functionality of removing degrees.
  */
  removeDegree(degreeName:string){
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
            this.db.object('/Degrees/'+degreeName).remove();    //Remove the Degree
          }
        }
      ]
    });
    alert.present();        //Present the alert.
  }
}
