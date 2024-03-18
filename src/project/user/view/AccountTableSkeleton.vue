<script setup lang="ts">
//#region "imports"
import { ref } from "vue";
const data = ref([
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
]);
</script>
<template>
  <section class="py-1 bg-blueGray-50">
    <div class="sm:px-6 w-full">
      <div class="mx-6 px-1">
        <div class="mt-7">
          <div>
            <table class="w-full whitespace-nowrap">
              <thead class="dark:bg-designTableHead bg-LightTableHead">
                <tr>
                  <th
                    scope="col"
                    class="rounded-tl-md rounded-bl-md text-sm font-medium px-6 py-1 animate-pulse"
                  >
                    <div
                      class="dark:bg-th bg-thLight rounded-lg text-textGray w-40 h-5"
                    ></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-7 py-1 animate-pulse"
                  >
                    <div
                      class="dark:bg-th bg-thLight rounded-lg text-textGray w-40 h-5"
                    ></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div
                      class="dark:bg-th bg-thLight rounded-lg text-textGray w-40 h-5"
                    ></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div
                      class="dark:bg-th bg-thLight rounded-lg text-textGray w-40 h-5"
                    ></div>
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div
                      class="dark:bg-th bg-thLight rounded-lg text-textGray w-40 h-5"
                    ></div>
                  </th>
                  <th
                    scope="col"
                    class="rounded-tr-md rounded-br-md text-sm font-medium px-6 py-4 animate-pulse"
                  >
                    <div
                      class="dark:bg-th bg-thLight rounded-lg text-textGray w-40 h-5"
                    ></div>
                  </th>
                </tr>
              </thead>

              <tbody class="dark:bg-designTableHead bg-LightTableHead">
                <tr
                  tabindex="0"
                  class="focus:outline-none text-center h-16 duration-300 border-b border-gray-500 border-t"
                  v-for="index in data"
                  :key="index.id"
                >
                  <td class="animate-pulse">
                    <div
                      class="bg-tdLight dark:bg-td rounded-lg text-textGray w-32 h-5 ml-8"
                    ></div>
                  </td>
                  <td class="animate-pulse">
                    <div class="">
                      <div
                        class="bg-tdLight dark:bg-td rounded-lg text-textGray w-32 h-5 ml-8"
                      ></div>
                    </div>
                  </td>
                  <td class="animate-pulse">
                    <div class="">
                      <div
                        class="bg-tdLight dark:bg-td rounded-lg text-textGray w-32 h-5 ml-8"
                      ></div>
                    </div>
                  </td>
                  <td class="animate-pulse">
                    <div class="">
                      <div
                        class="bg-tdLight dark:bg-td rounded-lg text-textGray w-32 h-5 ml-8"
                      ></div>
                    </div>
                  </td>
                  <td class="animate-pulse">
                    <div>
                      <div
                        class="bg-tdLight dark:bg-td rounded-lg text-textGray w-32 h-5 ml-8"
                      ></div>
                    </div>
                  </td>

                  <td class="animate-pulse">
                    <div
                      class="bg-tdLight dark:bg-td rounded-lg text-textGray w-32 h-5 ml-8"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
