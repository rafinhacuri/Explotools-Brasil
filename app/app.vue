<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="#fe0018" :height="2" />
  <MotionConfig reduced-motion="user">
    <TooltipProvider :delay-duration="150">
      <NuxtLayout>
        <NuxtPage :transition="{ name: 'page', mode: 'out-in' }" />
      </NuxtLayout>
    </TooltipProvider>
  </MotionConfig>
  <Toaster />
</template>
