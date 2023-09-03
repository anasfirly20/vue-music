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
    useLoggedIn: false
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
      this.useLoggedIn = true
    },
    async authenticate(values) {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      this.useLoggedIn = true
    },
    async logout() {
      console.log('TRIGG')
      try {
        await signOut(auth)
        this.userLoggedIn = false
        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    }
  }
})
