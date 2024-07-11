import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAaYWlRqh3LoCO7Di1b3k9F7rDFARq80jw",
  authDomain: "codedex-b3cc1.firebaseapp.com",
  projectId: "codedex-b3cc1",
  storageBucket: "codedex-b3cc1.appspot.com",
  messagingSenderId: "590984174177",
  appId: "1:590984174177:web:eb4f691d3fcd4ee7cda820",
  measurementId: "G-86TFNPEHF6"
};

const app = initializeApp(firebaseConfig);

export {
    app
}