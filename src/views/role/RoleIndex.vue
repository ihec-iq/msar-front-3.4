<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRoleStore } from "@/stores/roles/roleStore";
import type IRole from "@/types/role/IRole";
import Swal from "sweetalert2";
import { i18nRepository } from "@/stores/i18n/I18nRepository";
import { useRtlStore } from "@/stores/i18n/rtlPi";
import { storeToRefs } from "pinia";
import PageTitle from "@/components/general/namePage.vue";
import SimpleLoading from "@/components/general/loading.vue";

import EditButton from "@/components/dropDown/EditButton.vue";
import ShowButton from "@/components/dropDown/ShowButton.vue";
import DeleteButton from "@/components/dropDown/DeleteButton.vue";
import DuplicateButton from "@/components/dropDown/DuplicateButton.vue";
const rtlStore = useRtlStore();
const { isClose } = storeToRefs(rtlStore);
import { t } from "@/utils/I18nPlugin";
import IDropdown from "@/components/ihec/IDropdown.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";

const router = useRouter();
const roleData = ref<Array<IRole>>([]);
const isLoadingData = ref(false);
const { _delete } = useRoleStore();
const permissions = () => {
  router.push({
    name: "permissions",
  });
};
const back = () => {
  router.push({
    name: "setting",
  });
};
// const showRole = () => {
//   router.push({
//     name: "showRole",
//   });
// };
const update = (idRole: number) => {
  router.push({
    name: "roleUpdate",
    params: { id: idRole },
  });
};
const show = (idRole: number) => {
  router.push({
    name: "roleShow",
    params: { id: idRole },
  });
};
// const updateRole = (id: number) => {
//   router.push({
//     name: "updateRole",
//     params: { role.id },
//   });
// };
const getData = async () => {
  isLoadingData.value = true;
  await useRoleStore()
    .get()
    .then((response) => {
      if (response.status == 200) {
        roleData.value = response.data.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  isLoadingData.value = false;
};

const Delete = async (id: number) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn bg-grey-400",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: t("Are You Sure?"),
      text: t("You Won't Be Able To Revert This!"),
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        await _delete(id).then(async (response) => {
          swalWithBootstrapButtons.fire(
            t("Deleted!"),
            t("Deleted successfully ."),
            "success"
          );
          await getData();
        });
      }
    });
};
onMounted(async () => {
  await getData();
});
</script>
<template>
  <IPage :HeaderTitle="t('Role')">
    <template #HeaderButtons>
      <IButton2
        preIcon="add"
        :text="t('Add')"
        :onClick="permissions"
      ></IButton2>
    </template>
    <IPageContent>
      <!-- card -->
      <div class="rounded-xl" v-if="isLoadingData == false">
        <div
          v-motion
          :initial="{ opacity: 0, y: -15 }"
          :enter="{ opacity: 1, y: 0 }"
          :variants="{ custom: { scale: 2 } }"
          :delay="200"
          v-if="roleData.length > 0"
        >
          <div class="max-w-full relative">
            <div
              class="grid lg:grid-cols-2 md:grid-cols-2 xs:grid-cols-1 gap-10 lg:m-0 xs:mx-3"
            >
              <!-- card -->
              <div
                class="bg-cardLight dark:bg-card flex w-full p-5 rounded-lg border border-gray-600 shadow-md shadow-gray-900 duration-500 hover:border hover:border-gray-400 hover:shadow-md hover:shadow-gray-600"
                v-for="role in roleData"
                :key="role.id"
              >
                <div class="w-3/4 overflow-hidden">
                  <div class="ltr:ml-2 rtl:mr-2 ltr:text-left rtl:text-right">
                    <div class="text-2xl text-text dark:text-textLight mb-2">
                      {{ role.name }}
                    </div>
                    <div
                      class="text-text dark:text-textGray mb-2 justify-between"
                    ></div>
                    <div
                      class="transition-all m-auto justify-center rounded-md p-2 text-text dark:text-textLight"
                    >
                      {{ t("Permissions Count") }}:
                      {{ role.permissions.length }}
                    </div>
                    <div class="text-text dark:text-textLight flex">
                      <div
                        v-for="item in role.permissions.slice(0, 3)"
                        :key="item.id"
                        class="text-text dark:text-textLight w-36 text-center capitalize m-auto ml-2 rounded-md p-1 bg-blue-500 hover:bg-backHover transition-all"
                      >
                        {{ item.name }}
                      </div>
                      <!-- {{ role.permissions.slice(0, 2) }} -->
                    </div>
                  </div>
                </div>
                <div class="w-1/4">
                  <IDropdown>
                    <li>
                      <EditButton @click="update(role.id)" :title="t('Edit')" />
                    </li>
                    <li>
                      <DeleteButton @click="Delete(role.id)" />
                    </li>
                  </IDropdown>
                </div>
              </div>
              <!-- end card -->
            </div>
          </div>
        </div>
      </div>
      <SimpleLoading v-if="isLoadingData"></SimpleLoading>
      <!-- end card -->
    </IPageContent>
  </IPage>
</template>
<style scoped>
@media (max-width: 390px) {
  .bottom {
    width: 103%;
  }

  .backBtn {
    margin-left: 1%;
  }

  .role {
    margin-bottom: 15px;
  }
}
</style>
