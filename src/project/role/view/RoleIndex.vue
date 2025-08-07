<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRoleStore } from "../roleStore"; // Make sure this path is correct
import type IRole from "../IRole"; // Make sure this path is correct
import Swal from "sweetalert2";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";

// Component Imports (make sure paths are correct)
import EditButton from "@/components/dropDown/EditButton.vue";
import DeleteButton from "@/components/dropDown/DeleteButton.vue";
import IDropdown from "@/components/ihec/IDropdown.vue";
import IPage from "@/components/ihec/IPage.vue";
import IButton2 from "@/components/ihec/IButton2.vue";
import IPageContent from "@/components/ihec/IPageContent.vue";

// --- State ---
const router = useRouter();
const roleStore = useRoleStore();
const roles = ref<IRole[]>([]);
const isLoading = ref(true);

// --- Methods ---

/**
 * Navigates to a given route name with optional parameters.
 * @param {string} name - The name of the route.
 * @param {object} params - The route parameters.
 */
const navigateTo = (name: string, params = {}) => {
  router.push({ name, params });
};

/**
 * Fetches the list of roles from the store.
 */
const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await roleStore.get();
    roles.value = response.data.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    // Optionally, show an error toast to the user here
  } finally {
    isLoading.value = false;
  }
};

/**
 * Shows a confirmation dialog and deletes a role if confirmed.
 * @param {number} id - The ID of the role to delete.
 */
const confirmAndDelete = async (id: number) => {
  const result = await Swal.fire({
    title: t("Are You Sure?"),
    text: t("You Won't Be Able To Revert This!"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: t("Yes, delete it!"),
    cancelButtonText: t("No, cancel!"),
  });

  if (result.isConfirmed) {
    try {
      await roleStore._delete(id);
      await Swal.fire({
        title: t("Deleted!"),
        text: t("The role has been deleted."),
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      await fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error("Deletion failed:", error);
      Swal.fire(t("Error!"), t("Could not delete the role."), "error");
    }
  }
};

// --- Lifecycle Hook ---
onMounted(fetchData);
</script>

<template>
  <IPage :HeaderTitle="t('Roles and Permissions')">
    <template #HeaderButtons>
      <IButton2 preIcon="add" :text="t('Add New Role')" :onClick="() => navigateTo('roleAdd')" />
    </template>

    <IPageContent>
      <div v-if="isLoading" class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="i in 4" :key="i" class="h-48 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div v-else-if="roles.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div v-for="role in roles" :key="role.id" class="relative">
          <div class="absolute top-4 left-4 z-20">
            <IDropdown>
              <li class="mb-1"><EditButton @click="navigateTo('roleUpdate', { id: role.id })" /></li>
              <li><DeleteButton @click="confirmAndDelete(role.id)" /></li>
            </IDropdown>
          </div>

          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
            class="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500"
          >
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ role.name }}</h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ t("Permissions Count") }}:
                <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ role.permissions.length }}</span>
              </p>
            </div>

            <div class="mt-4">
              <p v-if="role.permissions.length === 0" class="text-sm italic text-gray-400">
                {{ t("No permissions assigned.") }}
              </p>
              <div v-else class="flex flex-wrap gap-2">
                <span
                  v-for="item in role.permissions.slice(0, 4)"
                  :key="item.id"
                  class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                >
                  {{ item.name }}
                </span>
                <span
                  v-if="role.permissions.length > 4"
                  class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                >
                  +{{ role.permissions.length - 4 }} {{ t("more") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-20 text-center dark:border-gray-600 dark:bg-gray-800"
      >
        <Icon icon="mdi:shield-off-outline" class="h-16 w-16 text-gray-400" />
        <h3 class="mt-4 text-xl font-semibold text-gray-800 dark:text-white">{{ t("No Roles Found") }}</h3>
        <p class="mt-2 text-gray-500">{{ t("Get started by creating a new role.") }}</p>
        <IButton2 class="mt-6" preIcon="add" :text="t('Create First Role')" :onClick="() => navigateTo('roleAdd')" />
      </div>
    </IPageContent>
  </IPage>
</template>