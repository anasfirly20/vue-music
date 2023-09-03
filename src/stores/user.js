import { defineStore } from 'pinia'

// firebase
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth, db } from '@/includes/firebase'
import { setDoc, doc } from 'firebase/firestore'

export default defineStore('user', {
  state: () => ({
    userLoggedIn: false
  }),
  actions: {
    async register(values) {
      const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password)
      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: values.name,
        email: values.email,
        age: values.age,
        role: values.role,
        country: values.country
      })
      if (userCred.user) {
        await updateProfile(userCred.user, {
          displayName: values.name
        })
      }
      this.userLoggedIn = true
    },
    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      this.userLoggedIn = true
    },
    async logout() {
      try {
        await signOut(auth)
        this.userLoggedIn = false
      } catch (error) {
        console.log(error)
      }
    }
  }
})
