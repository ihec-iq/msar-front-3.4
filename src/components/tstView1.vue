<template>
  <div class="w-3/5 mt-3">
    <div
      class="font-bold text-2xl ltr:float-right rtl:float-left text-white cursor-default text-center rounded-xl p-2 bg-update w-80"
    >
      <slot name="page_name"> Page Name</slot>
    </div>
  </div>
  <slot name="page_content">
    <div class="card w-96 bg-base-100 shadow-xl ml-10">
      <figure>
        <img src="https://placeimg.com/400/225/arch" alt="Shoes" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>
  </slot>
  <slot name="footer">
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">What is your name?</span>
        <span class="label-text-alt">Alt label</span>
      </label>
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full max-w-xs"
      />
      <label class="label">
        <span class="label-text-alt">Alt label</span>
        <span class="label-text-alt">Alt label</span>
      </label>
    </div>
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">What is your name?</span>
        <span class="label-text-alt">Alt label</span>
      </label>
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full max-w-xs"
      />
      <label class="label">
        <span class="label-text-alt">Alt label</span>
        <span class="label-text-alt">Alt label</span>
      </label>
    </div>
  </slot>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const tst = () => {
  router.push({
    name: "tst",
  });
};
</script>
