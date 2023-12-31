import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC_BWdAIu9mNlsbAkBGZnTu2aZFvFVnv2I',
  authDomain: 'vue-music-d682b.firebaseapp.com',
  projectId: 'vue-music-d682b',
  storageBucket: 'vue-music-d682b.appspot.com',
  messagingSenderId: '556422036383',
  appId: '1:556422036383:web:4e141917c58946758b1baa'
}

const app = initializeApp(firebaseConfig)

initializeFirestore(app, { localCache: memoryLocalCache() })

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage()

export { auth, db, storage }
