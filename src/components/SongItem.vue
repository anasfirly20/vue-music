<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50 example"
    :class="`song-id-${song.docID}`"
  >
    <div class="flex flex-col">
      <router-link
        class="font-bold block text-gray-600"
        :to="{ name: 'song', params: { id: song.docID } }"
        >{{ song.modified_name }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ song.display_name }}</span>
      <small class="text-sm" v-if="song.genre"
        >Genre: <span class="text-slate-500">{{ song.genre }}</span></small
      >
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docID }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object,
      required: true
    }
  }
}
</script>
