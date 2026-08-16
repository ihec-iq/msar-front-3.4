<script setup lang="ts">
import { Button } from "@/components/ui/button";
const props = defineProps<{
  openFn: () => void;
}>();
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { t } from "@/utilities/I18nPlugin";
import { Icon } from "@iconify/vue";
import { FolderOpen } from "lucide-vue-next";
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <Icon
          icon="mdi:menu"
          width="32"
          class="dark:text-gray-200 text-gray-900"
        ></Icon>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>{{ t("Option.basic") }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @click="openFn">
          <FolderOpen class="mr-2 h-4 w-4" />
          <span>{{ t("Open") }}</span>
        </DropdownMenuItem>
        <slot> </slot>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />
    </DropdownMenuContent>
  </DropdownMenu>
</template>
