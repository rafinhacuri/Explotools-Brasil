<script setup lang="ts">
const showBanner = ref(false)

onMounted(() => {
  if(!localStorage.getItem('cookieConsent')){
    showBanner.value = true
  }
})

function acceptCookies(){
  localStorage.setItem('cookieConsent', 'true')
  showBanner.value = false
}
</script>

<template>
  <section>
    <div v-if="showBanner" class="fixed inset-x-0 bottom-0 z-50 transform-gpu bg-gradient-to-r from-gray-800 to-gray-700 p-6 text-white shadow-lg transition-transform">
      <div class="container mx-auto flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div class="flex items-center space-x-4">
          <p class="text-center text-xs md:text-left md:text-base">
            Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com o uso de cookies.
          </p>
        </div>
        <button class="rounded-full bg-red-500 px-6 py-2 font-bold text-white shadow-md transition duration-300 ease-in-out hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/50" @click="acceptCookies">
          Aceitar
        </button>
      </div>
    </div>
  </section>
</template>
