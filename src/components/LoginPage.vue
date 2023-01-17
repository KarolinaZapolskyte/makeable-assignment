<script lang="ts">
import { defineComponent } from "vue";

let username: String = "";
let password: String = "";
let loggedIn: boolean = false;

export default defineComponent({
  data() {
    return {
      username,
      password,
      loggedIn,
    };
  },
  methods: {
    async checkLogin() {
      await fetch(`https://opentdb.com/api_token.php?command=request`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          window.sessionStorage.setItem("loginToken", data.token);
          this.loggedIn = true;
        })
        .catch((err) => {
          console.error(err);
          this.loggedIn = false;
        });
    },
  },
});
</script>

<template>
  <div>
    <div v-if="!loggedIn" class="login-form">
      <h1>Login</h1>
      <input v-model="username" type="text" />
      <input v-model="password" type="password" @keyup.enter="checkLogin" />
      <button class="button" @click="checkLogin">Login</button>
    </div>
    <div v-else>
      <h2>You are logged in</h2>
    </div>
  </div>
</template>

<style lang="scss">
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin-bottom: 16px;
  }

  input {
    width: 400px;
    height: 40px;
    margin-bottom: 8px;
    border-radius: 8px;
  }

  button {
    width: 400px;
  }
}

@media (max-width: 1024px) {
  h2 {
    margin-top: 150px;
  }
  .login-form {
    margin-top: 150px;
    input {
      width: 300px;
    }
    button {
      width: 300px;
      font-size: 20px;
    }
  }
}
</style>
