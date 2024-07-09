import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBncIdxsTYJcGleFczTpWUnUFw4-C0Ku4o",
  authDomain: "map-test-task-dc7cf.firebaseapp.com",
  databaseURL: "https://map-test-task-dc7cf-default-rtdb.firebaseio.com",
  projectId: "map-test-task-dc7cf",
  storageBucket: "map-test-task-dc7cf.appspot.com",
  messagingSenderId: "995010026998",
  appId: "1:995010026998:web:47fa321d05594d6681fbd7",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);