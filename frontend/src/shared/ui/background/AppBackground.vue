<script setup lang="ts"></script>

<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-gray-950">
    <div class="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
    <div
      class="circle absolute opacity-80 w-[20%] h-[30%] left-89 -top-35 rounded-full gradient blur-[320px]"
    />
    <div
      class="circleOne absolute opacity-80 w-[50%] h-[75%] left-45 top-150 rounded-full gradient blur-[140px]"
    />
    <div
      class="absolute opacity-80 w-[40%] h-[70%] -right-50 -top-40 rounded-full gradient blur-[300px]"
    />
  </div>
</template>

<style scoped>
.gradient {
    background: linear-gradient(180deg, #00ffe1 0%, rgba(37, 239, 37, 100) 100%);
}

.circle {
    animation: animationCircle 12s infinite ease-in-out;
}

.circleOne {
    animation: animationCircleOne 12s infinite ease-in-out;
}

@keyframes animationCircleOne {
    0% {
        left: 25%;
        bottom: 100%;
    }
    20% {
        left: 35%;
        bottom: 170%;
    }
    60% {
        left: 10%;
        bottom: 100%;
        transform: rotate(1.3deg);
    }
    80% {
        left: 35%;
        bottom: 100%;
    }
    100% {
        left: 25%;
        bottom: 100%;
    }
}

@keyframes animationCircle {
    0% {
        transform: none;
        left: 89%;
        top: -35%;
    }
    20% {
        transform: rotate(60deg);
        left: 60%;
        top: -40%;
    }
    50% {
        transform: rotate(120deg);
        top: -30%;
    }
    70% {
        transform: rotate(60deg);
        left: 60%;
    }
    100% {
        transform: none;
        left: 89%;
        top: -35%;
    }
}
</style>
