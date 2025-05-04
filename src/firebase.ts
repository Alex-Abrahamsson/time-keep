import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyB_55Su-qzkYizK2wbN4Vdjv_SGhyF9uPI',
    authDomain: 'time-keeper-abra.firebaseapp.com',
    projectId: 'time-keeper-abra',
    storageBucket: 'time-keeper-abra.firebasestorage.app',
    messagingSenderId: '1067265473410',
    appId: '1:1067265473410:web:17f6ba3490b66d3d9eed9b',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
