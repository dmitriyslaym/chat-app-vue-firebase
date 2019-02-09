<template>
  <div class="messages-wrapper">
    <div :key="message.timestamp" class="messages card" v-for="message in messages">
      <div class="message card-body">
        <h5 class="message__name card-title">
          {{ message.name }}
        </h5>
        <p class="message__name card-text">
          {{ message.text }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getDBRef } from '../database'

export default {
  name: 'Messages',
  data () {
    return {
      messages: []
    }
  },
  created () {
    getDBRef('messages').on('child_added', (snapshot) => {
      this.messages.push(snapshot.val())
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
