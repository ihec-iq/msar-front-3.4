<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import backVue from "@/components/general/back.vue";
import { useRoleStore } from "@/stores/roles/roleStore";
import type IRole from "@/types/role/IRole.js";
import { i18nRepository } from "@/stores/i18n/I18nRepository";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);

const st = i18nRepository.getState();
const t = (text: string) => {
  return st.langTextRepo[st.info.lang][text] || text;
};
const namePage = ref("Add Role");

const role = reactive<IRole>({
  id: 0,
  name: "",
  checkedPermission: [],
  permissions: [],
});

const data = ref<Array<IRole>>([]);
const isLoading = ref(false);
const { get } = useRoleStore();
const getData = async () => {
  await get().then((response) => {
    if (response.status == 200) data.value = response.data.data;
  });
  isLoading.value = false;
};
onMounted(async () => {
  getData();
});
</script>
<template>
  <!-- <div class="text-gray-200">Permission</div> -->
  <div class="w-full">
    <PageTitle> {{ t(namePage) }}</PageTitle>
    <div class="px-4">
      <div
        class="mb-1 ml-2 capitalize focus:outline-none focus:border focus:border-gray-700 sm:text-sm text-base text-white font-bold"
      >
        {{ t("Role Name") }}
      </div>
      <div class="flex">
        <input
          v-model="role.name"
          name="name"
          label=""
          placeholder=""
          type="text"
          class="rounded-md w-full focus:outline-none focus:border focus:border-gray-700 bg-gray-800 text-white mb-10 font-bold"
        />
      </div>
    </div>
    <!-- table -->
    <div class="w-full">
      <div class="flex flex-col">
        <div class="py-4 min-w-full flex sm:px-6 lg:px-8">
          <div
            class="overflow-auto w-full rounded-xl"
            v-if="isLoading == false"
          >
            <table class="min-w-full text-center" v-if="data.length > 0">
              <thead class="bg-title">
                <tr>
                  <th
                    scope="col"
                    class="text-lg font-medium text-white px-6 py-4"
                  >
                    {{ t("Role") }}
                  </th>
                  <th
                    scope="col"
                    class="text-lg font-medium text-white px-6 py-4"
                  >
                    {{ t("Permission") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-gray-800 text-gray-300">
                <tr
                  class="hover:bg-gray-700 duration-300 border-t border-gray-500"
                  v-for="role in data"
                  :key="role.id"
                >
                  <td class="text-sm font-light px-6 py-4 whitespace-nowrap">
                    {{ role.name }}
                  </td>
                  <td
                    class="text-sm font-light px-6 flex flex-wrap py-4 whitespace-nowrap"
                  >
                    <button
                      class="bg-blue-600 mr-2 p-1 mb-2 rounded-lg"
                      v-for="item in role.permissions"
                      :key="item.id"
                    >
                      {{ item.name }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <loadingVue v-if="isLoading" />
        </div>
      </div>
    </div>
  </div>
  <!-- <div>
    <p class="text-gray-300">{{ permissionsStore.permissions.name }}</p>
    <button class="bg-delete" @click="removePermission(index)">Remove</button>
  </div> -->
  <!-- <div class="my-6 px-10"> -->
  <!-- <form @submit.prevent="addTodo()">
      <vSelect
        v-model="newTodo"
        name="newTodo"
        autocomplete="off"
        class="capitalize rounded-md h-10 w-full bg-gray-800 focus:outline-none focus:border focus:border-gray-700 text-white p-2 mb-10"
        label="name"
        :options="permissionsStore.permissions"
        :reduce="(permission: IHotelTable) => permission.name"
      />

      <button class="bg-create">Add ToDo</button>
    </form> -->
  <!-- <h2 class="text-gray-300">Permissions</h2>
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        <span
          class="text-gray-300"
          :class="{ done: todo.done }"
          @click="doneTodo(todo)"
          >{{ todo.content }}</span
        >
        <button class="bg-delete" @click="removeTodo(index)">Remove</button>
      </li>
    </ul>
    <h4 class="text-gray-300" v-if="todos.length === 0">Empty list.</h4>
  </div> -->
  <!-- bottom tool bar -->
  <div
    :class="{
      'w-[95%]': isClose,
      'w-10/12': !isClose,
    }"
    class="dark:bg-bottomTool duration-700 bg-sideNavLight p-2 rounded-lg flex items-center justify-between fixed bottom-0"
  >
    <!-- back button -->
    <div>
      <backVue :count="-1" />
    </div>
  </div>
</template>

<style scoped>
.disable {
  visibility: hidden;
}

.enable {
  visibility: visible;
}
</style>
@/stores/roles/roleStore@/stores/roles/permissionStore
