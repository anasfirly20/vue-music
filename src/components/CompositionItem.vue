<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!isShowForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modified_name }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
        <i class="fa fa-times"></i>
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <vee-form :validation-schema="schema" v-show="isShowForm" :initial-values="song" @submit="edit">
      <CustomInput
        :label="'Song Title'"
        :name="'modified_name'"
        :type="'text'"
        placeholder="Enter Song Title"
      />
      <CustomInput :label="'Genre'" :name="'genre'" :type="'text'" placeholder="Enter Genre" />
      <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">Submit</button>
      <button
        type="button"
        class="py-1.5 px-3 rounded text-white bg-gray-600 ml-1"
        @click.prevent="hideForm"
      >
        Go Back
      </button>
    </vee-form>
  </div>
</template>

<script>
import CustomInput from '@/components/CustomInput.vue'

export default {
  name: 'CompositionItem',
  components: { CustomInput },
  data() {
    return {
      isShowForm: false,
      schema: {
        modified_name: 'required',
        genre: 'alpha_spaces'
      }
    }
  },
  props: {
    song: {
      type: Object,
      required: true
    }
  },
  methods: {
    hideForm() {
      this.isShowForm = false
    },
    showForm() {
      this.isShowForm = true
    },
    edit(values) {
      console.log('Song edited', values)
    }
  }
}
</script>
