<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const role = () => {
  router.push({
    name: "role",
  });
};
</script>
<template>
  <div class="w-full items-center">
    <div class="flex justify-around w-full my-4">
      <button
        @click="role()"
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 p-2 rounded-lg text-gray-300"
        is-link
      >
        Role
      </button>
      <button
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 px-4 rounded-lg text-gray-300"
        is-link
      >
        IDK
      </button>
      <button
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 px-4 rounded-lg text-gray-300"
        is-link
      >
        IDK
      </button>
      <button
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 px-4 rounded-lg text-gray-300"
        is-link
      >
        IDK
      </button>
    </div>
    <div class="flex justify-around w-full mt-10">
      <button
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 px-4 rounded-lg text-gray-300"
        is-link
      >
        IDK
      </button>
      <button
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 px-4 rounded-lg text-gray-300"
        is-link
      >
        IDK
      </button>
      <button
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 px-4 rounded-lg text-gray-300"
        is-link
      >
        IDK
      </button>
      <button
        class="bg-update hover:bg-updateHover mr-2 duration-500 h-10 px-4 rounded-lg text-gray-300"
        is-link
      >
        IDK
      </button>
    </div>
  </div>
</template>
