<script setup lang="ts">
import { onMounted, ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePromotionStore } from "../promotionStore"; // Updated store import
import { storeToRefs } from "pinia";

import { TailwindPagination } from "laravel-vue-pagination";
import { t } from "@/utilities/I18nPlugin";
import SimpleLoading from "@/components/general/loading.vue";
import type { IPromotion, IPromotionFilter } from "../IPromotion"; // Updated type import
import { usePermissionsStore } from "@/project/core/permissionStore";
const { checkPermissionAccessArray } = usePermissionsStore();
const isLoading = ref(false);

const data = ref<Array<IPromotion>>([]); // Updated type
const dataPage = ref();
const dataBase = ref<Array<IPromotion>>([]); // Updated type
const { get_filter } = usePromotionStore(); // Updated store method

const fastSearch = ref("");
const searchFilter = ref<IPromotionFilter>({ // Updated filter type
  title: "",
  limit: 10,
  employeeName: "",
});

const getFilterData = async (page = 1) => {
  // ...
};
</script> 