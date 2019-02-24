<template>
  <div class="messages" id="messages">

    <div v-if="!messagesList.length || !name" class="messages__loader d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div
      v-else
      :key="message.timestamp"
      class="message"
      v-bind:class="{isReply: message.name !== name, isSender: message.name === name}"
      v-for="message in messagesList"
    >
      <div class="message__content">
        <span class="message__icon" v-if="message.name !== name">{{ message.name.charAt(0) }}</span>
        <div v-bind:class="{edit: message.id === messageIdForEditMode}" class="message__text">
          <span>
            {{ message.text.trim() }}
          </span>
          <div v-if="message.name === name" class="message__text-icons">
            <div v-if="message.id !== messageIdForEditMode">
              <font-awesome-icon
                class="message__text-icon"
                icon="edit"
                v-on:click.prevent="openEditMessageMode({ id: message.id })"
              />
              <font-awesome-icon
                class="message__text-icon"
                icon="times-circle"
                v-on:click.prevent="deleteMessage({ id: message.id })"
              />
            </div>
            <div v-else>
              <!--<font-awesome-icon-->
              <!--class="message__text-icon"-->
              <!--icon="save"-->
              <!--v-on:click.prevent="saveEditedMessage({ id: message.id })"-->
              <!--/>-->
              <font-awesome-icon
                class="message__text-icon"
                icon="undo"
                v-on:click.prevent="cancelEditMessageMode({ id: message.id })"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
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
    },
    ...mapState({
      messageIdForEditMode: state => state.messageForm.id,
      name: state => state.auth.name
    })
  },
  methods: {
    ...mapMutations('messageForm', ['updateFormData', 'resetFormData']),

    deleteMessage: function ({ id }) {
      getDBRef('messages').child(id).remove()
    },

    openEditMessageMode: function ({ id }) {
      this.updateFormData({
        text: this.messages[id].text,
        id: id
      })

      document.getElementById('message-form-input').focus()
    },

    cancelEditMessageMode: function () {
      this.resetFormData()
    }
  },
  created () {
    getDBRef('messages').on('child_added', (snapshot) => {
      this.messages = { ...this.messages, [snapshot.key]: { ...snapshot.val(), id: snapshot.key } }
      setTimeout(() => {
        const messagesEl = document.getElementById('messages')
        messagesEl.scrollTop = messagesEl.scrollHeight
      }, 100)
    })
    getDBRef('messages').on('child_changed', (snapshot) => {
      this.messages = { ...this.messages, [snapshot.key]: { ...snapshot.val(), id: snapshot.key } }
    })
    getDBRef('messages').on('child_removed', (snapshot) => {
      this.messages = { ...this.messages, [snapshot.key]: null }
    })
  }
}
</script>

<style scoped>
  .messages {
    height: calc(100vh - 500px);
    border: 1px solid #c1c1c1;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .messages__loader {
    align-items: center;
    flex-grow: 1;
  }

  .message {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .message__text {
    padding: 5px 20px;
    border-radius: 30px;
    margin-bottom: 0;
    max-width: 75%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .message__text > span {
    text-align: left;
  }

  .message.isSender .message__text {
    background-color: #0099FF;
    margin-left: auto;
    color: white;
  }

  .message.isSender .message__text.edit {
    background-color: orangered;
  }

  .message.isReply .message__text {
    background-color: #ffdd82;
    color: #002c49;
    margin-right: auto;
  }

  .message__content {
    display: flex;
    align-items: center;
  }

  .message__icon {
    padding: 5px;
    border-radius: 50%;
    background-color: pink;
    width: 30px;
    height: 30px;
    margin-right: 5px;
  }

  .message__text-icons {
    margin-left: 10px;
    display: flex;
    width: 50px;
  }

  .message__text-icon {
    cursor: pointer;
  }
</style>
