<script setup lang="ts">
import { truncateString } from "@/utilities/tools";
import { useRouter } from "vue-router";
const router = useRouter();
const update = () => {
  router.push({
    name: "vacationTimeUpdate",
    params: { id: props.item.id },
  });
};
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const MakeTime = (time: string) => {
  return truncateString(time, 5);
};
</script>
<template>
  <div
    class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-600 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-400 hover:shadow-md hover:shadow-gray-600"
  >
    <div class="w-4/4 overflow-hidden">
      <div class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right flex w-full">
        <div class="text-2xl text-text dark:text-textLight mb-2">
          {{ item.Vacation.Employee.name }}
        </div>
        <IDropdown>
          <li>
            <EditButton @click="update()" />
          </li>
        </IDropdown>
      </div>
      <div class="flex justify-betweens">
        اجازة لمدة
        <div
          class="text-text dark:text-red-900 border-sky-100 border-2 pl-2 pr-2 ml-2 mr-2 bg-slate-300"
          v-html="item.record"
        ></div>
        بتاريخ
        <div
          class="text-text dark:text-textGray ml-2 mr-2"
          v-html="item.date"
        ></div>
        ساعة من
        <div
          class="text-text dark:text-textGray ml-2 mr-2"
          v-html="MakeTime(item.timeFrom)"
        ></div>
        الى
        <div
          class="text-text dark:text-textGray ml-2 mr-2"
          v-html="MakeTime(item.timeTo)"
        ></div>
      </div>
      <div class="text-[12px] text-text dark:text-textGray float-right">
        createdAt : {{ item.createdAt }}
      </div>
    </div>
  </div>
</template>
