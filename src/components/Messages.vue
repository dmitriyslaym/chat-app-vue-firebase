<template>
  <div class="messages-wrapper">
    <div :key="message.timestamp" class="messages card" v-for="message in messagesList">
      <div class="message card-body">
        <h5 class="message__name card-title">
          {{ message.name }}
        </h5>
        <p v-if="!message.isEditMode" class="message__name card-text">
          {{ message.text }}
        </p>
        <input v-if="message.isEditMode" v-model="message.textBeforeSaving" class="message__name card-text" />
        <div v-if="!message.isEditMode">
          <a href="#" class="card-link" v-on:click.prevent="deleteMessage({ id: message.id })">Delete</a>
          <a href="#" class="card-link" v-on:click.prevent="openEditMessageMode({ id: message.id })">Edit</a>
        </div>
        <div v-if="message.isEditMode">
          <a href="#" class="card-link" v-on:click.prevent="cancelEditMessageMode({ id: message.id })">Cancel</a>
          <a href="#" class="card-link" v-on:click.prevent="saveEditedMessage({ id: message.id })">Save changes</a>
        </div>
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
      messages: {}
    }
  },
  computed: {
    messagesList: function () {
      return Object.values(this.messages).filter(message => message)
    }
  },
  methods: {
    deleteMessage: function ({ id }) {
      getDBRef('messages').child(id).remove()
    },
    openEditMessageMode: function ({ id }) {
      this.messages = {
        ...this.messages,
        [id]: {
          ...this.messages[id],
          isEditMode: true,
          textBeforeSaving: this.messages[id].text
        }
      }
    },
    cancelEditMessageMode: function ({ id }) {
      this.messages = {
        ...this.messages,
        [id]: {
          ...this.messages[id],
          isEditMode: false,
          textBeforeSaving: this.messages[id].text
        }
      }
    },
    saveEditedMessage: function ({ id }) {
      const textToReturnIfError = this.messages[id].text;
      this.messages = {
        ...this.messages,
        [id]: {
          ...this.messages[id],
          isEditMode: false,
          text: this.messages[id].textBeforeSaving
        }
      }

      getDBRef('messages').child(id).set({
        ...this.messages[id],
        text: this.messages[id].text,
        updatedAt: Date.now()
      }, (error) => {
        if (error) {
          console.log('error while saving the editing', error)
          this.messages = {
            ...this.messages,
            [id]: {
              ...this.messages[id],
              text: textToReturnIfError
            }
          }
        }
        console.log('message edited successfully')
      })
    }
  },
  created () {
    getDBRef('messages').on('child_added', (snapshot) => {
      this.messages = { ...this.messages, [snapshot.key]: { ...snapshot.val(), id: snapshot.key } }
    })
    getDBRef('messages').on('child_removed', (snapshot) => {
      this.messages = { ...this.messages, [snapshot.key]: null }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
