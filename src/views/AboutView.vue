<template>
  <main class="absolute top-0 left-0 w-full">
    <section class="text-white md:bg-black">
      <div class="vi-bg">
        <video
          src="@/assets/world1.mp4"
          autoplay
          loop
          muted
          class="fixed w-full"
        ></video>
        <!-- md:h-5/6 md:w-11/12 screen -->
        <img
          src="@/assets/image/avatar-2.png"
          class="absolute op-0 right-0 bottom-0"
        />
      </div>
      <div
        class="px-4 py-32 mx-auto max-w-screen-xl h-screen items-center flex"
      >
        <div class="max-w-3xl mx-auto text-center z-10">
          <h1
            class="text-3xl animate-pulse font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-[white] via-[black] to-[white]"
          >
            Archive.

            <span class="sm:block"> </span>
          </h1>

          <p
            class="max-w-xl mx-auto mt-4 text-gray-500 sm:leading-relaxed sm:text-xl"
          >
            Welcome to best solution to manage your work.
          </p>

          <div class="flex flex-wrap justify-center mt-8 gap-4">
            <router-link to="/login">
              <a
                href="#"
                class="flex text-gray-100 justify-center transition duration-200 ease-in-out transform px-4 py-2 w-48 border-b-4 border-gray-500 hover:border-b-2 bg-gradient-to-t from-gray-400 via-gray-600 to-gray-200 rounded-2xl hover:translate-y-px"
                style="
                  -webkit-box-shadow: 0px 10px 13px -7px #000000,
                    5px 5px 15px 8px rgba(0, 0, 0, 0);
                  box-shadow: 0px 10px 13px -7px #000000,
                    5px 5px 15px 5px rgba(0, 0, 0, 0);
                "
              >
                <span class="font-bold"> Get Started</span>
              </a>
            </router-link>

            <!-- Button trigger modal -->
            <a
              href="#"
              class="flex text-gray-100 justify-center transition duration-200 ease-in-out transform px-4 py-2 w-48 border-b-4 border-gray-500 hover:border-b-2 bg-gradient-to-t from-gray-400 via-gray-600 to-gray-200 rounded-2xl hover:translate-y-px"
              style="
                -webkit-box-shadow: 0px 10px 13px -7px #000000,
                  5px 5px 15px 8px rgba(0, 0, 0, 0);
                box-shadow: 0px 10px 13px -7px #000000,
                  5px 5px 15px 5px rgba(0, 0, 0, 0);
              "
            >
              <span class="font-bold"> Launch demo modal</span>
            </a>

            <!-- Modal -->
            <div
              class="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog relative w-auto pointer-events-none">
                <div
                  class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current"
                >
                  <div
                    class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md"
                  >
                    <h5
                      class="text-xl font-medium leading-normal text-gray-800"
                      id="exampleModalLabel"
                    >
                      Modal title
                    </h5>
                    <button
                      type="button"
                      class="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body relative p-4">
                    Modal body text goes here.
                  </div>
                  <div
                    class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md"
                  >
                    <button
                      type="button"
                      class="px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <svg class="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
    <path
      fill="#fff"
      fill-opacity="1"
      d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
    ></path>
  </svg>
</template>
