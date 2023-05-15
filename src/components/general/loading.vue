<template>
  <div class="flex justify-center items-center">
    <!-- <div class="spinner-box">
      <div class="blue-orbit leo">
      </div>

      <div class="green-orbit leo">
      </div>

      <div class="red-orbit leo">
      </div>

      <div class="white-orbit w1 leo">
      </div><div class="white-orbit w2 leo">
      </div><div class="white-orbit w3 leo">
      </div>
    </div> -->

    <!-- GRADIENT CIRCLE PLANES -->
    <div class="spinner-box">
      <div class="leo-border-1">
        <div class="leo-core-1"></div>
      </div>
      <div class="leo-border-2">
        <div class="leo-core-2"></div>
      </div>
    </div>

    <span class="visually-hidden">Loading...</span>
  </div>
</template>
<!-- <style>
  @keyframes spin {
  from {
    transform: rotate(0);
  }
  to{
    transform: rotate(359deg);
  }
}

@keyframes spin3D {
  from {
    transform: rotate3d(.5,.5,.5, 360deg);
  }
  to{
    transform: rotate3d(0deg);
  }
}

@keyframes configure-clockwise {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes configure-xclockwise {
  0% {
    transform: rotate(45deg);
  }
  25% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(-135deg);
  }
  75% {
    transform: rotate(-225deg);
  }
  100% {
    transform: rotate(-315deg);
  }
}

@keyframes pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: .25;
    transform: scale(.75);
  }
}


.spinner-box {
  width: 73px;
  height: 73px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.leo {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
}

.blue-orbit {
	width: 70px;
	height: 70px;
  border: 1px solid #91daffa5;
  -webkit-animation: spin3D 3s linear .2s infinite;
}

.green-orbit {
	width: 40px;
	height: 40px;
  border: 1px solid #91ffbfa5;
  -webkit-animation: spin3D 2s linear 0s infinite;
}

.red-orbit {
	width: 20px;
	height: 20px;
  border: 1px solid #ffca91a5;
  -webkit-animation: spin3D 1s linear 0s infinite;
}

.white-orbit {
	width: 10px;
	height: 10px;
  border: 2px solid #ffffff;
  -webkit-animation: spin3D 10s linear 0s infinite;
}

.w1 {
  transform: rotate3D(1, 1, 1, 90deg);
}

.w2 {
  transform: rotate3D(1, 2, .5, 90deg);
}

.w3 {
  transform: rotate3D(.5, 1, 2, 90deg);
}

.three-quarter-spinner {
  width: 10px;
  height: 10px;
  border: 3px solid #fb5b53;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin .5s linear 0s infinite;
}
</style> -->

<style>
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(359deg);
  }
}

@keyframes spin3D {
  from {
    transform: rotate3d(0.5, 0.5, 0.5, 360deg);
  }
  to {
    transform: rotate3d(0deg);
  }
}

@keyframes configure-clockwise {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes configure-xclockwise {
  0% {
    transform: rotate(45deg);
  }
  25% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(-135deg);
  }
  75% {
    transform: rotate(-225deg);
  }
  100% {
    transform: rotate(-315deg);
  }
}

@keyframes pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.25;
    transform: scale(0.75);
  }
}

.spinner-box {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.leo-border-1 {
  position: absolute;
  width: 50px;
  height: 50px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgb(63, 249, 220);
  background: linear-gradient(
    0deg,
    rgba(63, 249, 220, 0.1) 33%,
    rgba(63, 249, 220, 1) 100%
  );
  animation: spin3D 1.8s linear 0s infinite;
}

.leo-core-1 {
  width: 100%;
  height: 100%;
  background-color: #37474faa;
  border-radius: 50%;
}

.leo-border-2 {
  position: absolute;
  width: 50px;
  height: 50px;
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgb(251, 91, 83);
  background: linear-gradient(
    0deg,
    rgba(251, 91, 83, 0.1) 33%,
    rgba(251, 91, 83, 1) 100%
  );
  animation: spin3D 2.2s linear 0s infinite;
}

.leo-core-2 {
  width: 100%;
  height: 100%;
  background-color: #1d2630aa;
  border-radius: 50%;
}
</style>
