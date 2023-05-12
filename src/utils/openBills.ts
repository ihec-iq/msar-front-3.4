import { useRouter } from "vue-router";

export function openBills(
  router: object,
  type: string,
  id: number,
  isShow: boolean = true
) {
  let path = "";
  if (type == "Receipt" || type == "1") {
    path = isShow ? "voucherReceiptShow" : "voucherReceiptUpdate";
  } else if (type == "Payment" || type == "2") {
    path = isShow ? "voucherPaymentShow" : "voucherPaymentUpdate";
  } else if (type == "Extra Profit" || type == "3") {
    path = isShow ? "voucherExtraProfitShow" : "voucherExtraProfitUpdate";
  } else if (type == "Expenses" || type == "4") {
    path = isShow ? "voucherExpensesShow" : "voucherExpensesUpdate";
  } else {
    path = "";
  }
  // console.log("path");

  router.push({
    name: path,
    params: { id: id },
  });
}
