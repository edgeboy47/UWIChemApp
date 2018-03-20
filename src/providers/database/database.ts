import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../auth/auth';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class DatabaseProvider {
  userPath: string

  constructor(private db: AngularFireDatabase, private auth: AuthProvider) {
    this.init()
  }

  init(){
    console.log("DBProvider did load " + new Date().toLocaleTimeString())

    // If user obj is not null i.e user is logged in
    if(this.auth.isLoggedIn()){
      this.userPath = `/Users/${this.auth.getUID()}`
    }
    // If user is not logged in
    else{
      console.log("User not logged in")
    }
  }

  getUserType(): Observable<{}>{
    // Retrieve the user's type
    return this.db.object(`${this.userPath}/type`).valueChanges()
  }

  getUserNotificationToken(): Observable<{}> {
    // Retrieve user's notif token
    return this.db.object(`${this.userPath}/notificationToken`).valueChanges()
  }

  updateObject(path: string, obj: {}): Promise<void> {
    // Update obj at path in database
    return this.db.object(path).update(obj)
  }

  removeObject(path: string){
    //Remove data at path in database
    return this.db.object(path).remove()
  }

  readObject(path: string): Observable<{}> {
    // Read the data at path in database
    return this.db.object(path).valueChanges()
  }

  set(path: string, obj: {}): Promise<void> {
    return this.db.object(path).set({})
  }

  push(path: string, obj:{}){
    this.db.database.ref(path).push(obj);
  }
}
