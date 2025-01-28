import Swal from "sweetalert2";
import { t } from "@/utilities/I18nPlugin";
import { SuccessToast } from "./Toast";

interface DeleteParams {
  store: any;
  id: number;
}

export const crud_delete = async ({ store, id }: DeleteParams) => {
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
      SuccessToast();
    }
  } catch (error) {
    console.error("Error during deletion:", error);
  }
};

export const prepareFormData = (data : object) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    const formattedKey = key.replace(/ /g, "_").replace(/([A-Z])/g, "_$1").replace(/^_/, "").toLowerCase();
    if (value !== null && value !== undefined) {
      formData.append(formattedKey + (typeof value === 'object' ? "_id" : ""), value['id'] || String(value));
    }
  });
  return formData;
}
