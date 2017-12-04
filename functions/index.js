const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

//Subscribes users to a course topic when they add one to their course list, and unsubscribes them when they delete a course
exports.subscribeToCourse = functions.database.ref("UserCourses/{userID}/{courseCode}").onWrite( event => {
    // Gives the course name before the event was triggered
    const oldVal = event.data.previous.val()

    // Gives the course name after the event was triggered
    const newVal = event.data.current.val()

    // Creates the topic code for the course
    const topic = String(event.params.courseCode).split(' ').join('')
    
    // If a new course is added
    if(oldVal === null && newVal != null) {
        // Retrieve the user's notification token from the database
        admin.database().ref(`Users/${event.params.userID}/notificationToken`).on("value", currentVal => {
            // Subscribe the user to the topic
            admin.messaging().subscribeToTopic(currentVal.val(), topic)
            .then( res => console.log(`User: ${event.params.userID} successfully subscribed to topic: ${topic}, Response: ${res}`))
            .catch(err => console.log(`User: ${event.params.userID} failed to subscribe to topic: ${topic}, Error: ${err}`))
        })
    }

    // If a course is deleted
    if(oldVal != null && newVal === null) {
        // Retrieve the user's notification token from the database
        admin.database().ref(`Users/${event.params.userID}/notificationToken`).on("value", currentVal => {
            // Unsubscribe the user from the topic
            admin.messaging().unsubscribeFromTopic(currentVal.val(), topic)
            .then( res => console.log(`User: ${event.params.userID} successfully unsubscribed from topic: ${topic}, Response: ${res}`))
            .catch(err => console.log(`User: ${event.params.userID} failed to unsubscribe from topic: ${topic}, Error: ${err}`))
        })
    }
})


// Subscribes new users to the global topic
exports.globalNotification = functions.database.ref("Users/{userID}").onUpdate( event => {
    const user = event.data.current.toJSON()

    // Whenever a new user account is created, if the user has a notification token subscribe them to the global topic
    if(user.hasOwnProperty("notificationToken")) {
        admin.messaging().subscribeToTopic(user.notificationToken, 'global')
        .then( res => console.log("User",user.email,"successfully subscribed to global topic:", res))
        .catch( err => console.error("Error subscribing user",user.email,"to global topic:",err))
    }
    
})


// Sends a notification when an event is created
exports.eventNotification = functions.database.ref("Events/{courseCode}/{eventCode}").onCreate( event => {
    // Retrieve the event data from the databse
    const newVal = event.data.current.toJSON()

    // Create the topic code
    const topic = String(event.params.courseCode).split(' ').join('')

    // Create the payload to send to the user devices
    var payload = {
        // Used when app is in the background
        notification:{
            title: `New event for ${event.params.courseCode}`,
            body: `New ${newVal.Type} for ${newVal.Notes}`,
            sound: 'default'
        },
        // Used when the app is in the foreground
        data:{
            title: `New event for ${event.params.courseCode}`,
            message: `New ${newVal.Type} for ${newVal.Notes}`
        }
    };

    // Send the payload to all users subscribed to the topic
    admin.messaging().sendToTopic(topic, payload).then( res => {
        console.log("Event:", newVal.Notes, "sent successfully to topic:", topic)
        console.log("Response:", res)
    }).catch(err => {
        console.log("Event:", newVal.Notes, "was not sent to topic:", topic)
        console.log("Error:", err)
    })
})

// Deletes a user 
exports.deleteUser = functions.database.ref("Deletions/{userID}").onCreate( event => {
    // Retrieve the user's unique ID from the database
    const uid = String(event.params.userID)

    // Delete the user's firebase authentication
    admin.auth().deleteUser(uid).then( () => {
        console.log("User", uid, "successfully deleted")
        // Remove the deletion table entry from the databse
        admin.database().ref(`Deletions/${uid}`).remove().then( () => console.log('Deletion table entry removed'))
        .catch(err => console.log('Deletion table entry not removed:', err))
    })
    .catch(err => console.log('User not deleted:', err))
})