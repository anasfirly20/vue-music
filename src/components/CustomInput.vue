<template>
  <div class="mb-3">
    <label class="inline-block mb-2">{{ label }}</label>
    <vee-field
      v-if="type === 'select'"
      as="select"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      :name="name"
    >
      <option v-for="mappedData in data_to_map" :value="mappedData" :key="mappedData">
        {{ mappedData }}
      </option>
    </vee-field>
    <vee-field
      v-else
      :type="type"
      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      :placeholder="placeholder"
      :name="name"
    />
    <ErrorMessage class="text-red-600" :name="name" />
  </div>
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    label: String,
    name: String,
    placeholder: String,
    type: String,
    value: String,
    data_to_map: Array
  }
}
</script>
