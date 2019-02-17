<template>
  <div class="messages">
    <div
      :key="message.timestamp"
      class="message"
      v-bind:class="{isReply: message.name !== 'Slaym', isSender: message.name === 'Slaym'}"
      v-for="message in messagesList"
    >
      <div class="message__content">
        <span class="message__icon" v-if="message.name !== 'Slaym'">{{ message.name.charAt(0) }}</span>
        <div v-bind:class="{edit: message.id === messageIdForEditMode}" class="message__text">
          <span>
            {{ message.text }}
          </span>
          <div v-if="message.id !== messageIdForEditMode" class="message__text-icons">
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
          <div v-else class="message__text-icons">
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
      messageIdForEditMode: state => state.messageForm.id
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
    },

    cancelEditMessageMode: function () {
      this.resetFormData()
    }
  },
  created () {
    getDBRef('messages').on('child_added', (snapshot) => {
      this.messages = { ...this.messages, [snapshot.key]: { ...snapshot.val(), id: snapshot.key } }
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
    border: 1px solid #c1c1c1;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

  .message {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .message__text {
    padding: 5px 15px;
    border-radius: 30px;
    margin-bottom: 0;
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
    display: inline-block;
    margin-left: 10px;
  }

  .message__text-icon {
    cursor: pointer;
  }
</style>
