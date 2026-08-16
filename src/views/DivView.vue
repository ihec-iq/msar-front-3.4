<template>
  <div class="container">
    <h1>Responsive Div Component Examples</h1>

    <!-- Example 1: Basic responsive sizes -->
    <h2>Example 1: Mobile 1/2, Tablet 1/3, Desktop 1/4</h2>

    <div class="example-section flex">
      <ResponsiveDiv
        size="1/2"
        md="1/3"
        lg="1/3"
        sm="full"
        xs="full"
        custom-class="example-box"
        height="200px"
      >
        <div class="content">
          <p>This div is:</p>
          <ul>
            <li>100% width on mobile</li>
            <li>50% width on mobile</li>
            <li>33% width on tablet (md)</li>
            <li>25% width on desktop (lg)</li>
          </ul>
        </div>
      </ResponsiveDiv>
      <ResponsiveDiv
        size="1/2"
        md="1/3"
        lg="1/3"
        sm="full"
        xs="full"
        custom-class="example-box"
        height="200px"
      >
        <div class="content">
          <p>This div is:</p>
          <ul>
            <li>100% width on mobile</li>
            <li>50% width on mobile</li>
            <li>33% width on tablet (md)</li>
            <li>25% width on desktop (lg)</li>
          </ul>
        </div>
      </ResponsiveDiv>
    </div>

    <!-- Example 2: Complex breakpoint system -->
    <div class="example-section">
      <h2>Example 2: All Breakpoints</h2>
      <ResponsiveDiv
        xs="full"
        sm="3/4"
        md="1/2"
        lg="1/3"
        xl="1/4"
        :xxl="300"
        custom-class="example-box-2"
        min-height="150px"
      >
        <div class="content">
          <p>This div changes at every breakpoint:</p>
          <ul>
            <li>XS (0px+): 100% width</li>
            <li>SM (640px+): 75% width</li>
            <li>MD (768px+): 50% width</li>
            <li>LG (1024px+): 33% width</li>
            <li>XL (1280px+): 25% width</li>
            <li>XXL (1536px+): 300px fixed</li>
          </ul>
        </div>
      </ResponsiveDiv>
    </div>

    <!-- Example 3: Fixed pixel sizes -->
    <div class="example-section">
      <h2>Example 3: Fixed Pixel Sizes</h2>
      <ResponsiveDiv
        :size="250"
        :md="400"
        :lg="500"
        custom-class="example-box-3"
        height="180px"
      >
        <div class="content">
          <p>Fixed pixel widths:</p>
          <ul>
            <li>Mobile: 250px</li>
            <li>Tablet: 400px</li>
            <li>Desktop: 500px</li>
          </ul>
        </div>
      </ResponsiveDiv>
    </div>

    <!-- Example 4: Auto sizing -->
    <div class="example-section">
      <h2>Example 4: Auto Sizing</h2>
      <ResponsiveDiv
        size="auto"
        md="1/2"
        custom-class="example-box-4"
        height="120px"
      >
        <div class="content">
          <p>Auto width on mobile, 50% on tablet+</p>
        </div>
      </ResponsiveDiv>
    </div>

    <!-- Debug info -->
    <ScreenSizeComponent></ScreenSizeComponent>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ResponsiveDiv from "./ResponsiveDiv.vue";
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.example-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
}

.example-box-2 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
}

.example-box-3 {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
}

.example-box-4 {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
}

.content {
  height: 100%;
}

.content p {
  margin: 0 0 10px 0;
  font-weight: bold;
}

.content ul {
  margin: 0;
  padding-left: 20px;
}

.content li {
  margin-bottom: 5px;
}

h1,
h2,
h3 {
  color: #1f2937;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  margin-bottom: 15px;
  font-size: 18px;
}
</style>
