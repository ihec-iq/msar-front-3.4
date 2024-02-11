<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
  height: { type: Number, default: 100 },
  width: { type: Number, default: 100 },
  isMaximized: { type: Number, default: 0 },
  isMinimized: { type: Number, default: 0 },
});
const positions = ref({
  clientX: 0,
  clientY: 0,
  movementX: 0,
  movementY: 0,
});

const dragMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  // get the mouse cursor position at startup:
  positions.value.clientX = Number(event.clientX);
  positions.value.clientY = Number(event.clientY);
  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;
};

//const draggableContainer = ref<HTMLDivElement>();
const draggableContainer = ref();

const elementDrag = (event: MouseEvent) => {
  event.preventDefault();
  positions.value.movementX = positions.value.clientX - Number(event.clientX);
  positions.value.movementY = positions.value.clientY - Number(event.clientY);
  positions.value.clientX = Number(event.clientX);
  positions.value.clientY = event.clientY;
  // set the element's new position:
  draggableContainer.value.style.top =
    draggableContainer.value.offsetTop - positions.value.movementY + "px";
  draggableContainer.value.style.left =
    draggableContainer.value.offsetLeft - positions.value.movementX + "px";
};
const closeDragElement = () => {
  document.onmouseup = null;
  document.onmousemove = null;
};
const isMaximized = ref(props.isMaximized);
const isMinimized = ref(props.isMinimized);
const maximize = () => {
  isMaximized.value = 1;
};
const restore = () => {
  isMaximized.value = 0;
};
const minimize = () => {
  isMinimized.value = 1;
};
const close = () => {};
</script>

<template>
  <div
    ref="draggableContainer"
    id="draggable-container"
    class="window flex flex-col overflow-hidden shadow-lg bg-transparent"
    :class="{
      minimized1: isMinimized,
      'rounded-md': !isMaximized,
      'w-[99%] h-[99%]': isMaximized,
    }"
  >
    <div
      id="draggable-header"
      class="hover:cursor-pointer"
      @mousedown="dragMouseDown"
    >
      <div
        class="title-bar flex items-center gap-2 bg-black pl-2 h-30"
        @dblclick="isMaximized ? restore() : maximize()"
      >
        <img width="14" src="@/assets/image/moon.png" />

        <span class="text-white text-xs flex-grow">
          <slot name="header"></slot
        ></span>

        <div class="window-controls h-full flex">
          <button
            class="px-5 py-3 hover:bg-white hover:bg-opacity-10 duration-100"
            @click="minimize()"
          >
            <svg
              class="fill-current text-white w-2 h-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 10 1"
            >
              <path d="M10 -0.000976562V1H0V-0.000976562H10Z"></path>
            </svg>
          </button>
          <button
            class="px-5 py-3 hover:bg-white hover:bg-opacity-10 duration-100"
            v-if="isMaximized"
            @click="restore()"
          >
            <svg
              class="fill-current text-white w-2 h-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 10 10"
            >
              <path
                d="M10 7.99805H7.99805V10H0V2.00195H2.00195V0H10V7.99805ZM7.00195
                  2.99805H1.00098V8.99902H7.00195V2.99805ZM8.99902
                  1.00098H2.99805V2.00195H7.99805V7.00195H8.99902V1.00098Z"
              ></path>
            </svg>
          </button>
          <button
            class="px-5 py-3 hover:bg-white hover:bg-opacity-10 duration-100"
            v-else
            @click="maximize()"
          >
            <svg
              class="fill-current text-white w-2 h-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 10 10"
            >
              <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z"></path>
            </svg>
          </button>
          <button
            class="px-5 py-3 hover:bg-red-500 duration-100"
            @click="close()"
          >
            <svg
              class="fill-current text-white w-2 h-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 10.2 10.2"
            >
              <path
                d="M10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2
                    5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div id="draggable-header">
      <slot name="main"></slot>
    </div>
    <div id="draggable-header" @mousedown="dragMouseDown">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
#draggable-container {
  position: absolute;
  z-index: 9;
}
#draggable-header {
  z-index: 10;
}

.window {
  box-shadow: 0 4px 15px #0004;
}

.resizable-component {
  position: absolute !important;
}

.minimized1 {
  opacity: 0;
  transform: translateY(100px);
}
</style>
