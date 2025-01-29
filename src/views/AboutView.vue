<template>
  <main class="absolute top-0 left-0 w-full">
    <section class="text-white md:bg-black">
      <div class="vi-bg">
        <video src="@/assets/world1.mp4" autoplay loop muted class="fixed w-full"></video>
        <!-- md:h-5/6 md:w-11/12 screen -->
        <img src="@/assets/image/avatar-2.png" class="absolute op-0 right-0 bottom-0" />
      </div>
      <div class="px-4 py-32 mx-auto max-w-screen-xl h-screen items-center flex">
        <div class="max-w-3xl mx-auto text-center z-10">
          <h1
            class="text-3xl drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]  animate-pulse font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-[black] via-[white] to-[black]">
            نظام ادارة تخطيط موراد المؤسسات مسار

            <span class="sm:block"> </span>
          </h1>

          <p class="max-w-xl mx-auto mt-4 text-gray-100 bg-opacity-50 
          font-Tajawal sm:leading-relaxed sm:text-xl">
            اهلا وسهلا بك في نظام مسار.
          </p>

          <div class="flex flex-wrap justify-center mt-8 gap-4">
            <router-link to="/login">
              <a href="#"
                class="flex text-gray-100 justify-center transition duration-200 ease-in-out transform px-4 py-2 w-48 border-b-4 border-gray-500 hover:border-b-2 bg-gradient-to-t from-gray-400 via-gray-600 to-gray-200 rounded-2xl hover:translate-y-px"
                style="
                  -webkit-box-shadow: 0px 10px 13px -7px #000000,
                    5px 5px 15px 8px rgba(0, 0, 0, 0);
                  box-shadow: 0px 10px 13px -7px #000000,
                    5px 5px 15px 5px rgba(0, 0, 0, 0);
                ">
                <span class="font-bold text-2xl"> ابدأ </span>
              </a>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </main>
  <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path fill="#fff" fill-opacity="1"
      d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
    </path>
  </svg>
</template>
