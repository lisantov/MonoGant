<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AppPoint from './AppPoint.vue';
import photoOne from '@/assets/images/photo-one.png';
import photoTwo from '@/assets/images/photo-two.png';
import photoThree from '@/assets/images/photo-three.png';

const listPicture = [photoOne, photoTwo, photoThree, photoOne];

const listText = [
    ['Оптимизируй работу своей команды', 'Создай свою команду и следим за движениями'],
    ['Отслеживание проекта в ваших руках', 'Упростите контроль над проектами и задачами'],
    [
        'Современные решения и удобный интерфейс',
        'Развиваемся ради Вас и Вашего комфорта в нашем приложении',
    ],
];

const points = ref([true, false, false]);
const positionPoint = ref(0);
const currentPicture = ref(0);
const animationEnabled = ref(true);
const progress = ref(1);
const cycleStart = ref(Date.now());

let progressInterval: ReturnType<typeof setInterval>;
let slideInterval: ReturnType<typeof setInterval>;
let resetInterval: ReturnType<typeof setInterval>;

const changePicture = () => {
    animationEnabled.value = true;
    currentPicture.value = (currentPicture.value + 1) % listPicture.length;
};

const changePoint = () => {
    const nextIndex = (positionPoint.value + 1) % points.value.length;

    points.value = points.value.map((val, i) =>
        i === positionPoint.value || i === nextIndex ? i === nextIndex : val
    );

    progress.value = 1;
    positionPoint.value = nextIndex;
    cycleStart.value = Date.now();

    changePicture();
};

const getSecondsDiff = () => {
    return ((Date.now() - cycleStart.value) / 1000) % 60;
};

const updateProgress = () => {
    progress.value = 1 + (75 - 1) * (getSecondsDiff() / 3);
};

const resetToFirst = () => {
    if (currentPicture.value === listPicture.length - 1) {
        animationEnabled.value = false;
        currentPicture.value = 0;
    }
};

onMounted(() => {
    resetInterval = setInterval(resetToFirst, 500);
    progressInterval = setInterval(updateProgress, 50);
    slideInterval = setInterval(changePoint, 3000);
});

onUnmounted(() => {
    clearInterval(resetInterval);
    clearInterval(slideInterval);
    clearInterval(progressInterval);
});
</script>

<template>
  <div class="relative flex h-full w-full overflow-hidden rounded-[40px] bg-none">
    <div
      class="flex w-full"
      :style="{
        transform: `translateX(-${100 * currentPicture}%)`,
        transition: animationEnabled ? 'all 0.3s linear' : 'none',
      }"
    >
      <div
        v-for="(item, i) in listPicture"
        :key="i"
        class="widget relative flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-[40px] bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${item})` }"
      />
    </div>

    <div
      class="absolute bottom-0 flex h-full w-full flex-col items-center justify-end gap-[34px] py-[40px]"
    >
      <div
        :key="positionPoint"
        class="widget-title flex flex-col items-center gap-1 text-center"
      >
        <p class="widget-text text-[32px] font-jost text-white transition duration-300">
          {{ listText[positionPoint][0] }}
        </p>
        <p
          class="widget-text text-[18px] font-montserrat text-white/70 transition duration-300"
        >
          {{ listText[positionPoint][1] }}
        </p>
      </div>

      <div class="flex gap-[36px]">
        <div
          v-for="(isActive, index) in points"
          :key="index"
          class="relative flex items-center justify-center"
        >
          <AppPoint
            :is-active="isActive"
            :progress="progress"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.widget::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 80%;
    background-image: linear-gradient(0deg, var(--dark-gray) 21%, transparent 81%);
}

.widget-title {
    transition: 0.5s all;
    animation: text-swap 0.5s forwards;
    animation-delay: 2.5s;
}

.widget-text {
    transition: 0.3s;
}

@starting-style {
    .widget-title {
        opacity: 0;
        transform: translateY(-20px);
    }
}

@keyframes text-swap {
    to {
        opacity: 0;
        transform: translateY(20px);
    }
}
</style>
