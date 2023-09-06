<template>
  <!-- Registration Form -->
  <vee-form :validation-schema="schema" @submit="register" :initial-values="userData">
    <div
      class="text-white text-center font-bold p-4 rounded mb-4"
      v-if="reg_show_alert"
      :class="reg_alert_variant"
    >
      {{ reg_alert_msg }}
    </div>
    <!-- Name -->
    <CustomInput :label="'Name'" :name="'name'" :placeholder="'Enter Name'" :type="'text'" />
    <!-- Email -->
    <CustomInput :label="'Email'" :name="'email'" :placeholder="'Enter Email'" :type="'email'" />
    <!-- Age -->
    <CustomInput :label="'Age'" :name="'age'" :placeholder="'Enter Age'" :type="'number'" />
    <!-- Role -->
    <CustomInput :label="'Role'" :name="'role'" :type="'select'" :data_to_map="role_list" />

    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          type="password"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <CustomInput
      :label="'Confirm Password'"
      :name="'confirm_password'"
      :placeholder="'Confirm Password'"
      :type="'password'"
    />
    <!-- Country -->
    <CustomInput
      :label="'Country'"
      :name="'country'"
      :type="'select'"
      :data_to_map="country_list"
    />

    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        name="tos"
        value="1"
      />
      <i18n-t class="inline-block" keypath="register.accept" tag="label"
        ><a href="#">{{ $t('register.tos') }}</a></i18n-t
      >
    </div>
    <ErrorMessage class="text-red-600" name="tos" />
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from 'pinia'
import useUserStore from '@/stores/user'

// Comps
import CustomInput from './CustomInput.vue'

export default {
  name: 'RegisterForm',
  data() {
    return {
      country_list: ['USA', 'Mexico', 'Germany', 'Antarctica'],
      role_list: ['Listener', 'Artist'],
      schema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:6|max:100|excluded:password',
        confirm_password: 'password_mismatch:@password',
        country: 'required|country_excluded:Antarctica',
        tos: 'tos'
      },
      userData: {
        country: 'USA',
        role: 'Artist'
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Please wait! Your account is being created.'
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register'
    }),
    async register(values) {
      this.reg_show_alert = true
      this.reg_in_submission = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = 'Please wait! Your account is being created.'

      try {
        await this.createUser(values)
      } catch (error) {
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'
        this.reg_alert_msg = 'An unexpected error occurred. Please try again later.'
        console.log('ERROR HERE >>', error)
        return
      }
      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = 'Success! Your account has been created.'
      window.location.reload()
    }
  },
  components: { CustomInput }
}
</script>
