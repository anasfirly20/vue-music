<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          @click.prevent="this.newSong(song)"
        >
          <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, 'currency', 'ja') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">
            {{ $tc('song.comment_count', song.comment_count, { count: song.comment_count }) }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="show_alert"
            :class="alert_variant"
          >
            {{ alert_message }}
          </div>
          <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
            <div class="grid mb-4">
              <vee-field
                as="textarea"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Your comment here..."
                name="comment"
              />
              <ErrorMessage class="text-red-600" name="comment" />
            </div>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="in_submission"
            >
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>
        <p>
          {{ comment.content }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script>
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc
} from 'firebase/firestore'
import { db, auth } from '@/includes/firebase'

// Pinia
import { mapState, mapActions } from 'pinia'
import useUserStore from '@/stores/user'
import usePlayerStore from '@/stores/player'

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      comments: [],
      schema: {
        comment: 'required|min:3'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait! your comment is being submitted.',
      sort: '1'
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['playing']),
    ...mapState(useUserStore, ['userLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted)
        }
        return new Date(a.datePosted) - new Date(b.datePosted)
      })
    }
  },
  methods: {
    async addComment(values, { resetForm }) {
      console.log('values >>', values)
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait! your comment is being submitted.'
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      }
      try {
        await addDoc(collection(db, 'comments'), comment)

        // Called to update the comment list after adding new comment
        this.getComments()

        this.in_submission = false
        this.alert_variant = 'bg-green-500'
        this.alert_message = 'Comment added!'
        resetForm()

        // Add comment count
        this.song.comment_count += 1
        const songsRef = doc(db, 'songs', this.$route.params.id)
        await updateDoc(songsRef, {
          comment_count: this.song.comment_count
        })
      } catch (error) {
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong, ty again later.'
      }
    },
    async getComments() {
      // Comments
      const queryComments = query(
        collection(db, 'comments'),
        where('sid', '==', this.$route.params.id)
      )
      const commentsSnap = await getDocs(queryComments)

      this.comments = []

      commentsSnap.forEach((doc) => {
        this.comments.push({
          ...doc.data(),
          docID: doc.id
        })
      })
    },
    ...mapActions(usePlayerStore, ['newSong'])
  },
  async beforeRouteEnter(to, from, next) {
    const songRef = doc(db, 'songs', to.params.id)
    const docSnap = await getDoc(songRef)

    next((vm) => {
      if (!docSnap.exists()) {
        vm.$router.push({ name: 'home' })
        return
      }

      const { sort } = vm.$route.query
      vm.sort = sort === '1' || sort === '2' ? sort : '1'

      vm.song = docSnap.data()
      vm.getComments()
    })
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return
      }
      this.$router.push({
        query: {
          sort: newVal
        }
      })
    }
  }
}
</script>
