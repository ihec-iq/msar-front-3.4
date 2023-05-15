<script setup lang="ts">
import { ref } from "vue";
const cards = ref([
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
]);
</script>
<template>
  <div class="container-card py-2 mx-auto pt-20 px-6">
    <div>
      <div>
        <div class="max-w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-10">
            <div
              v-for="card in cards"
              :key="card.id"
              class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-700 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-600 hover:shadow-lg hover:shadow-gray-800"
            >
              <div class="w-1/4 animate-pulse">
                <div
                  class="bg-tdLight dark:bg-td rounded-lg text-textGray w-[100px] h-[150px]"
                ></div>
              </div>
              <div class="w-3/4 animate-pulse">
                <div class="ml-2 text-left">
                  <div
                    class="text-2xl w-full h-9 bg-tdLight dark:bg-td rounded-lg text-textGray mb-2"
                  ></div>

                  <div class="flex justify-betweens">
                    <div
                      class="bg-tdLight dark:bg-td rounded-lg w-7 h-7 text-textGray"
                    ></div>

                    <div class="flex text-gray-400 mb-2">
                      <div
                        class="ml-2 bg-tdLight dark:bg-td w-20 h-7 rounded-lg text-textGray"
                      ></div>
                    </div>
                  </div>
                  <div
                    class="bg-tdLight dark:bg-td rounded-lg w-2/3 h-5 text-textGray my-2"
                  ></div>
                  <div class="flex">
                    <div
                      class="bg-tdLight dark:bg-td text-textGray w-8 h-8 py-1 px-3 rounded-lg mr-4"
                    ></div>
                    <div
                      class="bg-tdLight dark:bg-td text-textGray w-8 h-8 py-1 px-3 rounded-lg mr-2"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
