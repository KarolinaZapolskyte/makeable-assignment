<script lang="ts">
import { defineComponent, toRaw } from "vue";

interface selQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const questions: any[] = [];
const answers: any[] = [];
let loginToken: string | null = null;
let selectedQuestion: selQuestion;
let showModal: boolean = false;
let correctAnswer: boolean = false;
let answered: boolean = false;

export default defineComponent({
  data() {
    return {
      questions,
      answers,
      loginToken,
      selectedQuestion,
      showModal,
      correctAnswer,
      answered,
    };
  },
  async mounted() {
    this.loginToken = window.sessionStorage.getItem("loginToken")
      ? window.sessionStorage.getItem("loginToken")
      : null;
    await fetch(
      `https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple&token${this.loginToken}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.questions = data.results;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    showAnswers(question: String) {
      this.showModal = true;
      this.selectedQuestion = this.questions.find(
        (x) => x.question === question
      );
      this.answers = [];
      this.answers.push(this.selectedQuestion.correct_answer);
      for (let i = 0; i < this.selectedQuestion.incorrect_answers.length; i++) {
        this.answers.push(this.selectedQuestion.incorrect_answers[i]);
      }
      // shuffle answers
      this.answers = toRaw(this.answers)
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      console.log(toRaw(this.answers));
    },
    checkCorrectAnswer(answer: string) {
      this.answered = true;
      this.correctAnswer = answer === this.selectedQuestion.correct_answer;

      if (this.correctAnswer) {
        setTimeout(() => {
          this.closeModal();
        }, 1000);
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
});
</script>

<template>
  <div :class="['overlay', showModal ? 'active' : '']">
    <img
      src="../assets/close.svg"
      alt="Close icon"
      class="close-icon"
      @click="closeModal"
    />
  </div>
  <div v-if="loginToken !== null" class="questions-section">
    <h1>This is an easy questions page</h1>
    <div class="scrollable-container">
      <div class="grid-header">
        <p class="number-column"></p>
        <p>Question</p>
        <p>Category</p>
        <p></p>
      </div>
      <div class="questions">
        <div v-for="(elem, i) in questions" :key="i" class="question">
          <p class="number-column">{{ i + 1 }}</p>
          <div>
            <p>{{ elem.question }}</p>
          </div>
          <div>
            <p>{{ elem.category }}</p>
          </div>
          <div class="no-border-right">
            <button class="button" @click="showAnswers(elem.question)">
              Answer question
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <h2>Please login to view questions</h2>
  </div>
  <div v-if="showModal" class="question-modal">
    <div v-if="answered" class="correct-incorrect-answer">
      <p v-if="correctAnswer">Your answer is correct 👏</p>
      <p v-else>Your answer is incorrect, try again 🫤</p>
    </div>
    <h2>{{ selectedQuestion.question }}</h2>
    <div class="answers">
      <div
        class="form-group"
        v-for="(answer, i) in answers"
        :key="i"
        @click="checkCorrectAnswer(answer)"
      >
        <input
          type="radio"
          :id="i.toString()"
          :name="selectedQuestion.question"
        />
        <label :for="i.toString()">{{ answer }}</label>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// helpers
.no-border-right {
  border-right: none !important;
}
//end of helpers
h1 {
  margin: 16px 0;
}
.overlay {
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
  &.active {
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
}
.questions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .question {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border: 1px solid black;
    border-top: none;
    // max-height: 48px;
    height: 48px;

    &:first-child {
      border-top: none;
    }

    .number-column {
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      margin: 0 !important;
      height: 48px !important;
    }

    div {
      width: calc(100% / 3);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px;
      border-right: 1px solid black;
    }

    p {
      height: 24px;
      display: -webkit-box;
      -webkit-line-clamp: 1; /*define how many line you want to show */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .button {
      margin: 8px 0;
      height: 32px;
      width: 160px;
      border: none;
    }
  }
}
.grid-header {
  display: inline-flex;
  width: 100%;
  border: 1px solid black;

  p {
    border-right: 1px solid black;
    height: 48px;
    width: calc(100% / 3);
    background: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;

    &:last-child {
      border-right: none;
    }
  }
}

.question-modal {
  position: absolute;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  color: white;

  .correct-incorrect-answer {
    p {
      font-size: 24px;
    }
  }

  h2 {
    font-size: 36px;
    margin-top: 80px;
  }

  .answers {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 600px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    margin-top: 80px;

    .form-group {
      padding: 1.5rem 1rem;
      width: 48%;
      text-align: initial;
      cursor: pointer;
      border-radius: 16px;
      transform: translateY(-50%);
      transition: background-color 400ms ease;

      &:nth-child(-n + 2) {
        margin-bottom: 16px;
      }

      &:nth-child(2n) {
        margin-left: 16px;
      }

      &:hover {
        background: #f6f6f6;
        color: black;

        label::before {
          border: 2px solid black;
        }
      }
    }

    input[type="radio"] {
      display: none;

      &:checked + label::before {
        border-color: #35605a;
      }

      &:checked + label::after {
        transform: translateY(-50%) scale(0.55);
      }
    }

    label {
      cursor: pointer;
      position: relative;
      min-width: 250px;
      font-size: 20px;
      padding-left: 35px;
      &::before {
        content: "";
        position: absolute;
        width: 25px;
        height: 25px;
        background-color: transparent;
        border: 2px solid #fff;
        border-radius: 50%;
        top: 50%;
        left: 0%;
        transform: translateY(-50%);
        transition: border-color 400ms ease;
      }

      &::after {
        content: "";
        position: absolute;
        width: 25px;
        height: 25px;
        background-color: #35605a;
        border: 2px solid #35605a;
        border-radius: 50%;
        top: 50%;
        left: 0%;
        transform: translateY(-50%) scale(0);
        transition: transform 400ms ease;
      }
    }
  }
}
.number-column {
  width: 60px !important;
  background: #f6f6f6;
  line-height: 48px;
}

@media (max-width: 1024px) {
  main {
    margin: 0;
  }
  .questions-section {
    .scrollable-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: scroll;
      padding: 8px 24px;

      &::-webkit-scrollbar {
        -webkit-appearance: none;
        background: transparent; /* Optional: just make scrollbar invisible */
        width: 0;
        height: 0;
      }
    }
    .grid-header {
      width: fit-content;
      p {
        width: 200px;
        min-width: 200px;
      }
    }
    .questions {
      width: fit-content;
      .question {
        div {
          width: 200px;
          min-width: 200px;
        }
      }
    }
    .number-column {
      width: 50px !important;
      min-width: 50px !important;
    }
  }
  .question-modal {
    padding: 0 24px;

    h2 {
      font-size: 24px;
    }
    .form-group {
      width: 100% !important;
      margin: 0 !important;
    }
  }
}
</style>
