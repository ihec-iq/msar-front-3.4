// ─────────────────────────────────────────────────────────────────────────────
// File: ITableExampleUsage.vue // Quick example illustrating
slots/formatters/selection. //
─────────────────────────────────────────────────────────────────────────────
<script setup lang="ts">
import { ref } from "vue";
import ITable from "./ITable.vue";
import type { ITableHeader, ITableItem } from "./ITable.types";

const headers = ref<ITableHeader[]>([
  { caption: "ID", value: "id", width: "80px", align: "right" },
  { caption: "Name", value: "name" },
  { caption: "Email", value: "email", sortable: true },
  {
    caption: "Salary",
    value: "salary",
    align: "right",
    format: (r, v) => new Intl.NumberFormat().format(Number(v)),
  },
  { caption: "Created", value: "createdAt", sortKey: "createdAt" },
]);

const items = ref<ITableItem[]>(
  Array.from({ length: 42 }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@acme.test`,
    salary: Math.round(1000 + Math.random() * 9000),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }))
);

const selected = ref<Array<string | number>>([]);
</script>

<template>
  <ITable
    :headers="headers"
    :items="items"
    title="Employees"
    caption="Demo"
    :persist-key="'employees-table'"
    :selectable="true"
    row-key="id"
    v-model:selected-keys="selected"
  >
    <template #salary="{ value }">
      <span class="font-semibold"
        >$ {{ new Intl.NumberFormat().format(Number(value)) }}</span
      >
    </template>
  </ITable>
</template>
