import firebase from 'firebase'

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

const app = firebase.initializeApp(firebaseConfig);

export const realtimedb = app.database()

export const firestore = app.firestore()