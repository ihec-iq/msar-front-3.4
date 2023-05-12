<template>
  <!-- <div class="w-3/5 mt-3">
    <div
      class="font-bold text-2xl ltr:float-right rtl:float-left text-white cursor-default text-center rounded-xl p-2 bg-update w-80"
    >
      Tst Slot
    </div>
  </div> -->
  <tst1>
    <template #page_name>laallala</template>
    <!-- <template #page_content>
      <div class="stats bg-slate-400 text-primary-content">
        <div class="stat">
          <div class="stat-title">Account balance</div>
          <div class="stat-value">$89,400</div>
          <div class="stat-actions">
            <button class="btn btn-sm btn-success">Add funds</button>
          </div>
        </div>

        <div class="stat">
          <div class="stat-title">Current balance</div>
          <div class="stat-value">$89,400</div>
          <div class="stat-actions">
            <button class="btn btn-sm">Withdrawal</button>
            <button class="btn btn-sm">deposit</button>
          </div>
        </div>
      </div>
    </template> -->
    <!-- <template #footer>
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-secondary w-full max-w-xs"
      />
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-xs w-full max-w-xs"
      />
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-sm w-full max-w-xs"
      />
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-md w-full max-w-xs"
      />
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered input-lg w-full max-w-xs"
      />
    </template> -->
    
  </tst1>
</template>
<script setup lang="ts">
import tst1 from "@/components/tstView1.vue";
</script>
