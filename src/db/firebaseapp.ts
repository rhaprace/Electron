import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCm7qGQgD1lW74T1-TEV6uAPIYL_FrAtro",
  authDomain: "atletech.firebaseapp.com",
  projectId: "atletech",
  storageBucket: "atletech.firebasestorage.app",
  messagingSenderId: "125287754441",
  appId: "1:125287754441:web:bbb56d6b06089e45ccbb18"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { app, db, auth};
