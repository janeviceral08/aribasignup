import * as firebase from "firebase";
import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyAe7fH4DFvOXcRW2arUTwFmR2RH30oQHKc",
  authDomain: "deliveryappsample-5dca5.firebaseapp.com",
  databaseURL:
    "https://deliveryappsample-5dca5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "deliveryappsample-5dca5",
  storageBucket: "deliveryappsample-5dca5.appspot.com",
  messagingSenderId: "557927849659",
  appId: "1:557927849659:web:ff335a2c76d89eed1a539e",
  measurementId: "G-L3FJ62RN1P",
};
firebase.initializeApp(config);

export default firebase;
