<template>
    <div class="app">
      <h1> List with posts </h1>
      <custom-input
          v-model="searchQuery"
          placeholder="Start search by title"
      />
      <div class="app-butns">
        <custom-button
            @click="showDialog"
        >
          Create post
        </custom-button>
        <custom-select
          v-model="selectedSort"
          :options="sortOptions"
        />
      </div>
      <custom-dialog
          v-model:show="dialogVisible"
      >
        <post-form
            @create="createPost"
        />
      </custom-dialog>
      <post-list
          :posts = "sortedAndSearchedPosts"
          @remove = "removePost"
          v-if="!isPostLoading"
      />
      <div v-else> Loading </div>
      <div ref="observer" class="observer-wrapper"></div>
<!--      for pagination with numbers-->
<!--      <div class="pagination-wrapper">-->
<!--        <div-->
<!--            @click="changePage(page)"-->
<!--            v-for="page in totalPages"-->
<!--            :key="page"-->
<!--            class="pagination"-->
<!--            :class="{-->
<!--              'current-page' : page === currentPage-->
<!--            }"-->
<!--        >-->
<!--          {{ page }}-->
<!--        </div>-->
<!--      </div>-->
    </div>
</template>

<script>
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import CustomDialog from "@/components/UI/CustomDialog";
import CustomButton from "@/components/UI/CustomButton";
import CustomSelect from "@/components/UI/CustomSelect";
import axios from 'axios';
import CustomInput from "@/components/UI/CustomInput";

export default {
  components: {
    CustomInput,
    CustomSelect,
    CustomButton,
    CustomDialog,
    PostList,
    PostForm
  },
    data() {
        return {
            posts: [],
            dialogVisible: false,
            isPostLoading: false,
            selectedSort: '',
            searchQuery: '',
            currentPage: 1,
            totalPages: 0,
            limitItemsPerPage: 10,
            sortOptions: [
                {value: 'title', name: 'Sorted by title'},
                {value: 'body', name: 'Sorted by description'},
                {value: '', name: 'Show all'},

            ],
        }
    },
    methods: {
      createPost(post) {
        this.posts.push(post);
        this.dialogVisible = false;
      },
      removePost(post) {
        this.posts = this.posts.filter( p => p.id !== post.id)
      },
      showDialog() {
        this.dialogVisible = true
      },
      //----start----
      // for pagination with numbers
      // changePage(pageNumber) {
      //   this.currentPage = pageNumber;
      // },
      // -----end-----
      async fetchPost() {
        try {
          this.isPostLoading = true;
          const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
            params: {
              _page: this.currentPage,
              _limit: this.limitItemsPerPage,
            }
          });
          this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limitItemsPerPage);
          this.posts = response.data;
        } catch (err) {
          alert("Error, try to reload the page")
        } finally {
          this.isPostLoading = false;
        }
      },
      async loadPostsByScroll() {
        try {
          this.currentPage += 1;
          const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
            params: {
              _page: this.currentPage,
              _limit: this.limitItemsPerPage,
            }
          });
          this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limitItemsPerPage);
          this.posts = [...this.posts, ...response.data];
        } catch (err) {
          alert("Error, try to reload the page")
        }
      },
    },
  mounted() {
    this.fetchPost();
    const options = {
      rootMargin: '0px',
      threshold: 1.0
    }
    const callback = (entries, observer) => {
      if(entries[0].isIntersecting && this.currentPage < this.totalPages) {
      this.loadPostsByScroll()
      }
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.$refs.observer);
  },
  computed: {
    sortedPosts() {
      return [...this.posts].sort((post1, post2) => post1[this.selectedSort]?.localeCompare(post2[this.selectedSort]))
    },
    sortedAndSearchedPosts() {
      return this.sortedPosts.filter( post => post.title.toLowerCase() .includes(this.searchQuery.toLowerCase()))
    }
  },
  watch: {
    // for pagination with numbers
    // post() {
    //   this.fetchPost()
    // }
  },
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  border-radius: 5px;
}
.app {
  padding: 20px;
}
.app-butns {
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
}
.pagination {
  padding: 10px;
  border: 1px solid rgb(98, 0, 255);
}
.current-page {
  border: 2px solid orangered;
  background: blueviolet;
}

.observer-wrapper {
}

form {
  display: flex;
  flex-direction: column;
}

</style>