<template>
  <div class="border border-gray-200 p-3 mb-4 rounded relative">
    <div v-show="!isShowForm">
      <h4 class="grid text-2xl font-bold">
        {{ song.modified_name }}
        <small class="text-sm" v-if="song.genre"
          >Genre: <span class="text-slate-500">{{ song.genre }}</span></small
        >
      </h4>
      <div class="flex gap-1 absolute right-2 top-6">
        <button class="py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
          <i class="fa fa-times"></i>
        </button>
        <button
          class="py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
          @click.prevent="showForm"
        >
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
    </div>
    <div class="text-white text-center font-bold p-4 mb-4" v-if="show_alert" :class="alert_variant">
      {{ alert_message }}
    </div>
    <vee-form :validation-schema="schema" v-show="isShowForm" :initial-values="song" @submit="edit">
      <CustomInput
        :label="'Song Title'"
        :name="'modified_name'"
        :type="'text'"
        placeholder="Enter Song Title"
      />
      <CustomInput :label="'Genre'" :name="'genre'" :type="'text'" placeholder="Enter Genre" />
      <button
        type="submit"
        class="py-1.5 px-3 rounded text-white bg-green-600"
        :disabled="in_submission"
      >
        Submit
      </button>
      <button
        type="button"
        class="py-1.5 px-3 rounded text-white bg-gray-600 ml-1"
        @click.prevent="hideForm"
        :disabled="in_submission"
      >
        Go Back
      </button>
    </vee-form>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'
import { db } from '@/includes/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export default {
  name: 'CompositionItem',
  components: { CustomInput },
  data() {
    return {
      isShowForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      },
      in_submission: false,
      show_alert: false,
      alert_variant: 'bg-blue-500',
      alert_message: 'Please wait updating song info.'
    }
  },
  props: {
    song: {
      type: Object,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    hideForm() {
      this.isShowForm = false
      this.show_alert = false
    },
    showForm() {
      this.isShowForm = true
    },
    async edit(values) {
      this.in_submission = true
      this.show_alert = true
      this.alert_variant = 'bg-blue-500'
      this.alert_message = 'Please wait updating song info.'

      const songRef = doc(db, 'songs', this.song.docID)
      try {
        await updateDoc(songRef, values)
      } catch (error) {
        console.log(error)
        this.in_submission = false
        this.alert_variant = 'bg-red-500'
        this.alert_message = 'Something went wrong, ty again later.'
        return
      }

      this.updateSong(this.index, values)

      this.in_submission = false
      this.alert_variant = 'bg-green-500'
      this.alert_message = 'Song info successfully updated.'
    }
  }
}
</script>
