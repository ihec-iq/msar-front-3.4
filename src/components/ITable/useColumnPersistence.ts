import { ref, watch } from "vue";
import { useLocalStorage } from "@/compositions/uselocalStorage";

export function useColumnPersistence(
  persistKey: string,
  initialColumns: string[]
) {
  const visibleColumns = ref<string[]>([...initialColumns]);

  const storageKey = `ITable/visibleColumns/${persistKey || "default"}`;

  // load once
  try {
    if (persistKey) {
      const raw = localStorage.getItem(storageKey);
      if (raw) visibleColumns.value = JSON.parse(raw);
    }
  } catch {
    /* ignore */
  }

  watch(
    visibleColumns,
    (val) => {
      if (!persistKey) return;
      try {
        useLocalStorage().set({
          key: storageKey,
          value: JSON.stringify(val),
          withEncrypt: false,
        });
      } catch {
        /* ignore */
      }
    },
    { deep: true }
  );

  const toggleAll = (allKeys: string[]) => {
    visibleColumns.value =
      visibleColumns.value.length === allKeys.length ? [] : [...allKeys];
  };
  const toggleOne = (key: string) => {
    visibleColumns.value = visibleColumns.value.includes(key)
      ? visibleColumns.value.filter((k) => k !== key)
      : [...visibleColumns.value, key];
  };

  return { visibleColumns, toggleAll, toggleOne };
}
