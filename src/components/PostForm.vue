<template>
      <form @submit.prevent>
        <h4>Creating Post</h4>
        <custom-input
            v-model="post.title"
            type="text"
            placeholder="Title" />
        <custom-input
            v-model="post.body"
            type="text"
            placeholder="Description" />
        <custom-button
            class="custom-button-end"
            @click="createPost"
        >
          Create
        </custom-button>
      </form>
</template>

<script>
export default {
  data() {
    return {
      post : {
        title : '',
        body: '',
      }
    }
  },
  methods: {
    createPost() {
      this.post.id = Date.now();
      this.$emit('create', this.post);
      this.post = {
        title : '',
        body: '',
      }
    }
  }
}
</script>

<style scoped>
.custom-button-end{
  align-self: flex-end;
  margin-top: 15px;
}
</style>