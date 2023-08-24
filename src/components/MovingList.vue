<script setup lang="ts">
import { ref } from "vue";

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

const draggableContainer = ref<HTMLDivElement>();

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
</script>

<template>
  <div ref="draggableContainer" id="draggable-container">
    <div id="draggable-header" @mousedown="dragMouseDown">
      <slot name="header"></slot>
    </div>
    <div id="draggable-header" @mousedown="dragMouseDown">
      <slot name="main"></slot>
    </div>
    <div id="draggable-header" @mousedown="dragMouseDown">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style>
#draggable-container {
  position: absolute;
  z-index: 9;
}
#draggable-header {
  z-index: 10;
}
</style>
