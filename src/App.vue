<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { defineComponent } from "vue";

let sidenav: boolean = false;
let loginToken: string | null = null;

export default defineComponent({
  data() {
    return {
      sidenav,
      loginToken,
    };
  },
  mounted() {
    this.loginToken = window.sessionStorage.getItem("loginToken")
      ? window.sessionStorage.getItem("loginToken")
      : null;
  },
  methods: {
    logout() {
      sessionStorage.removeItem("loginToken");
    },
    openSidenav() {
      this.sidenav = true;
    },
    closeSidenav() {
      this.sidenav = false;
    },
  },
});
</script>

<template>
  <div>
    <header>
      <div class="wrapper">
        <nav>
          <div class="left-box">
            <RouterLink to="/easy-questions">Easy quesions</RouterLink>
            <RouterLink to="/medium-questions">Medium questions</RouterLink>
            <RouterLink to="/hard-questions">Hard questions</RouterLink>
          </div>
          <RouterLink to="/" class="right-box button" @click="logout">{{
            loginToken !== null ? "Logout" : "Login"
          }}</RouterLink>
          <div class="burger-menu-mobile" @click="openSidenav">
            <img
              src="@/assets/burger.svg"
              alt="Burger menu"
              class="burger-menu"
            />
          </div>
        </nav>
      </div>
    </header>
    <div :class="['mobile-sidenav', sidenav ? 'active' : '']">
      <img
        src="./assets/close.svg"
        alt="Close icon"
        class="close-icon"
        @click="closeSidenav"
      />
      <RouterLink to="/easy-questions">Easy quesions</RouterLink>
      <RouterLink to="/medium-questions">Medium questions</RouterLink>
      <RouterLink to="/hard-questions">Hard questions</RouterLink>
      <RouterLink to="/" class="button" @click="logout">{{
        loginToken !== null ? "Logout" : "Login"
      }}</RouterLink>
    </div>
    <RouterView />
  </div>
</template>

<style lang="scss">
header {
  height: 80px;
  font-weight: 400;
  font-size: 24px;
  color: black;
  border-bottom: 1px solid rgba(225, 225, 225, 0.75);
  width: 100%;

  nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 48px;
    height: 80px;

    .left-box {
      width: 650px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    a {
      color: black;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
    .burger-menu-mobile {
      display: none;
      filter: invert(1);
      position: absolute;
      top: 30px;
      right: 0;
    }
  }
}
.mobile-sidenav {
  display: none;
  z-index: 100;
  position: fixed;
  background-color: #212121;
  opacity: 0;
  width: 100%;
  height: 110%;
  top: 0;
  left: 0;
  transition: 0s;
  pointer-events: none;
  padding: 50px 24px;

  &.active {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.97;
    pointer-events: all;
    transition: 0.5s;
  }

  .close-icon {
    position: absolute;
    top: 24px;
    right: 24px;
    height: 36px;
    width: 36px;
    border-radius: 100%;
    padding: 4px;
    cursor: pointer;

    &:hover {
      filter: invert(1);
      background: black;
    }
  }

  a {
    color: white;
    text-decoration: none;
    font-size: 24px;
    margin-bottom: 16px;
    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 1024px) {
  .left-box,
  .right-box {
    display: none !important;
  }
  .burger-menu-mobile {
    display: block !important;
  }
}
</style>
