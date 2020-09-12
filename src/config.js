import * as firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/database'

console.log(`firebase config is executing`)

const firebaseConfig = {
  	apiKey: "AIzaSyCkGWxQSDTx_2cBletpyyaHdqZdm3zKTtw",
	authDomain: "charting-solutions-d5143.firebaseapp.com",
	databaseURL: "https://charting-solutions-d5143.firebaseio.com",
	projectId: "charting-solutions-d5143",
	storageBucket: "charting-solutions-d5143.appspot.com",
	messagingSenderId: "1095357016185",
	appId: "1:1095357016185:web:420ae0e9c78675e1e70ca8",
	measurementId: "G-J5V8YNGH2D"
};

firebase.initializeApp(firebaseConfig)

export const realtimedb = firebase.database()
// export const firestore = firebase.firestore()
export const auth = firebase.auth()

console.log( firebase )

export const authProviders = {

	'GoogleAuthProvider': firebase.auth.GoogleAuthProvider

}