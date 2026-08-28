import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBpR2SyQnfBxjXRmpmKQaqhzVCoy2gs2Cg",
  authDomain: "gen-lang-client-0530555722.firebaseapp.com",
  projectId: "gen-lang-client-0530555722",
  storageBucket: "gen-lang-client-0530555722.firebasestorage.app",
  messagingSenderId: "518497463646",
  appId: "1:518497463646:web:69dc16a1c7606b396833cf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Persistence failed: Multiple tabs open');
  } else if (err.code == 'unimplemented') {
    console.warn('Persistence failed: Browser does not support it');
  }
});
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signupWithEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const loginWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = () => signOut(auth);
