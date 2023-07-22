<script lang="ts" setup>
import { ref } from "vue";

const selectedOption = ref({
  id: null,
  name: "",
  val: null,
});

const options = [
  { id: 1, name: "Option 1", val: 10 },
  { id: 2, name: "Option 2", val: 20 },
  { id: 3, name: "Option 3", val: 30 },
];

const handleEnter = (event: KeyboardEvent) => {
  const enteredValue = (event.target as HTMLInputElement).value;
  const matchingOption = options.filter(
    (option) => option.name === enteredValue
  )[0];
  if (!matchingOption) {
    console.log("Entered value:", enteredValue);
  }
};
</script>

<template>
  <div>
    <vSelect
      v-model="selectedOption"
      :options="options"
      @keydown.enter="handleEnter"
    >
      <template #option="{ option }">
        <div>
          <span>{{ option.name }}</span>
          <span>{{ option.val }}</span>
        </div>
      </template>
    </vSelect>

    <div>
      <h2>Selected Option:</h2>
      <p>ID: {{ selectedOption.id }}</p>
      <p>Name: {{ selectedOption.name }}</p>
      <p>Value: {{ selectedOption.val }}</p>
    </div>
  </div>
</template>
