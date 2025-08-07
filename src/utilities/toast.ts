import { toast } from "vue-sonner";

type ToastStatus = "success" | "error" | "warning" | "info";

export function showToast(
  title: string,
  options: {
    description: string;
    status: ToastStatus;
    action?: { label: string; onClick: () => void };
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  }
) {
  toast(title, {
    description: options.description,
    action: options.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
    class: `toast-${options.status}`,
    icon: () => getStatusIcon(options.status),
    style: getStatusStyle(options.status),
    position: options.position || 'bottom-right', // Default position if not specified
  });
}
// Add this helper to return proper background + text colors
function getStatusStyle(status: ToastStatus): Record<string, string> {
  switch (status) {
    case "success":
      return { backgroundColor: "#dcfce7", color: "black" }; // green-100
    case "error":
      return { backgroundColor: "#fee2e2", color: "black" }; // red-100
    case "warning":
      return { backgroundColor: "#ffedd5", color: "black" }; // orange-100
    case "info":
      return { backgroundColor: "#dbeafe", color: "black" }; // blue-100
    default:
      return {};
  }
}
function getStatusIcon(status: ToastStatus): string {
  switch (status) {
    case "success":
      return "✅";
    case "error":
      return "⚪️";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
    default:
      return "";
  }
}

// export const updateToast = (pageName: string, status: ToastStatus) => {
//   showToast(${pageName} has been updated, {
//     description: ${pageName} has been updated,
//     status: status,
//     action: {
//       label: "Done",
//       onClick: () => {},
//     },
//   });
// };