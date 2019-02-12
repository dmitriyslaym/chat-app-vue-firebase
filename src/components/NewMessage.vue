<template>
  <div class="new-message">
    <form v-on:submit.prevent="saveNewMessage">
      <div class="form-group">
        <label>Your name</label>
        <input v-model="name" name="name" type="text" class="form-control" placeholder="Your name">
      </div>
      <div class="form-group">
        <label>Your message</label>
        <input v-model="text" type="text" class="form-control" placeholder="Your message">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
import { getDBRef } from '../database'

export default {
  name: 'NewMessage',
  data () {
    return {
      text: '',
      name: ''
    }
  },
  methods: {
    saveNewMessage: function () {
      getDBRef('messages').push({
        name: this.name,
        text: this.text,
        timestamp: Date.now()
      }, (error) => {
        if (error) {
          throw new Error('Can not send the message')
        }
        this.name = ''
        this.text = ''
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
