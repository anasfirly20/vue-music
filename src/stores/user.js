import { defineStore } from 'pinia'

// firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/includes/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default defineStore('user', {
  state: () => ({
    useLoggedIn: false
  }),
  actions: {
    async register(values) {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      await addDoc(collection(db, 'users'), {
        name: values.name,
        email: values.email,
        age: values.age,
        role: values.role,
        country: values.country
      })

      this.useLoggedIn = true
    }
  }
})
