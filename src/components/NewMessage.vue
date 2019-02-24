<template>
  <div class="new-message">
    <form v-on:submit.prevent="handleFormSubmit">
      <div class="form-group new-message-form">
        <textarea
          v-on:keypress="handleInputKeypress"
          id="message-form-input"
          v-model="text"
          class="form-control"
          placeholder="Your message"
          rows="3">
        </textarea>
        <div class="typing-info">
          <i v-bind:key="nameOfTypingUser" v-for="nameOfTypingUser of namesOfTypingUsers">
            {{ nameOfTypingUser }} is typing...
          </i>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">{{ id ? 'Update' : 'Send New' }} Message</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { getDBRef } from '../database'

export default {
  name: 'NewMessage',
  computed: {
    ...mapState({
      id: state => state.messageForm.id,
      userName: state => state.auth.name,
      userId: state => state.auth.id,
      typingUsers: state => state.dialogs.typingUsers,
      users: state => state.users.usersMap,
      dialogsDBPath: state => `dialogs/${state.dialogs.selectedDialog}/messages`
    }),
    namesOfTypingUsers: function () {
      return Object.keys(this.typingUsers).reduce((res, userId) => {
        if (!this.typingUsers[userId] || userId === this.userId) {
          return res
        }
        return [...res, this.users[userId].name]
      }, [])
    },
    text: {
      get () {
        return this.$store.state.messageForm.text
      },
      set (value) {
        if (value && !this.typingUsers[this.userId]) {
          this.saveTypingUser({ userId: this.userId, isTyping: true })
        }
        if (!value) {
          this.saveTypingUser({ userId: this.userId, isTyping: false })
        }

        this.updateFormData({ text: value, id: this.id })
      }
    }
  },
  methods: {
    ...mapMutations('messageForm', ['updateFormData', 'resetFormData']),
    ...mapActions('dialogs', ['saveTypingUser']),

    saveNewMessage: function () {
      getDBRef(this.dialogsDBPath).push({
        userName: this.userName,
        userId: this.userId,
        text: this.text,
        timestamp: Date.now()
      }, (error) => {
        if (error) {
          throw new Error('Can not send the message')
        }
        this.resetFormData()
      })
    },

    updateMessage: function () {
      getDBRef(this.dialogsDBPath).child(this.id).update({
        text: this.text,
        updatedAt: Date.now()
      }, (error) => {
        if (error) {
          throw new Error('Can not update the message')
        }
        this.resetFormData()
      })
    },

    handleInputKeypress: function (event) {
      if (event.key === 'Enter') {
        this.handleFormSubmit()
      }
    },

    handleFormSubmit: function () {
      this.saveTypingUser({ userId: this.userId, isTyping: false })
      this.id ? this.updateMessage() : this.saveNewMessage()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .new-message {
    margin-top: 10px;
  }

  .typing-info {
    height: 24px;
    margin-top: 5px;
    font-weight: bold;
  }

  .new-message-form {
    margin-bottom: 5px;
  }
</style>
