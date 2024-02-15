import Swal from "sweetalert2";
import { useI18n } from "@/stores/i18n/useI18n";
import { useRouter } from "vue-router";
const router = useRouter();
const { t } = useI18n();

interface DeleteParams {
  RouterGo: number;
  store: any;
  id: number;
}

export const crud_delete = async ({ RouterGo, store, id }: DeleteParams) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn m-2 bg-red-700",
      cancelButton: "btn bg-grey-400",
    },
    buttonsStyling: false,
  });

  try {
    const result = await swalWithBootstrapButtons.fire({
      title: t("Are You Sure?"),
      text: t("You Won't Be Able To Revert This!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("No, cancel!"),
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await store._delete(id);
      swalWithBootstrapButtons.fire(
        t("Deleted!"),
        t("Deleted successfully."),
        "success"
      );
      // Use nextTick to wait for the Vue instance to be updated
      //   await router.isReady();
      //router.go(RouterGo);
    }
  } catch (error) {
    console.error("Error during deletion:", error);
  }
};
 
