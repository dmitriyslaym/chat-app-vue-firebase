<template>
  <div class="new-message">
    <form v-on:submit.prevent="handleFormSubmit">
      <div class="form-group">
        <textarea
          v-on:keypress="handleInputKeypress"
          id="message-form-input"
          v-model="text"
          class="form-control"
          placeholder="Your message"
          rows="3">
        </textarea>
      </div>
      <button type="submit" class="btn btn-primary">{{ id ? 'Update' : 'Send New' }} Message</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { getDBRef } from '../database'

export default {
  name: 'NewMessage',
  computed: {
    ...mapState({
      id: state => state.messageForm.id,
      userName: state => state.auth.name,
      userId: state => state.auth.id,
      dialogsDBPath: state => `dialogs/${state.dialogs.selectedDialog}/messages`
    }),
    text: {
      get () {
        return this.$store.state.messageForm.text
      },
      set (value) {
        this.updateFormData({ text: value, id: this.id })
      }
    }
  },
  methods: {
    ...mapMutations('messageForm', ['updateFormData', 'resetFormData']),

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
</style>
