<template>
  <section class="relative w-full overflow-x-hidden text-white">
    <div class="flex mx-auto min-h-screen max-w-6xl items-center gap-20">
      <div class="space-y-12">
        <h1
          class="text-5xl leading-tight font-extrabold tracking-tight md:text-6xl lg:text-7xl xl:text-8xl"
        >
          ПРОЕКТ ПОД<br>
          КОНТРОЛЕМ
        </h1>

        <p class="max-w-xl text-xl leading-relaxed text-white/70">
          Планируйте задачи, стройте диаграммы Ганта и держите команду в одном ритме.
          Современный SaaS для управления проектами, от постановки до результата.
        </p>

        <div class="flex items-center gap-6">
          <app-button @click="router.push('/auth/login')">
            Войти в аккаунт
          </app-button>
          <app-button
            variant-button="solid"
            @click="router.push('/auth/register')"
          >
            Зарегистрироваться
          </app-button>
        </div>
      </div>

      <div class="flex justify-end">
        <div
          class="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-9 backdrop-blur-xl"
        >
          <div
            class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70"
          >
            <span class="h-2 w-2 rounded-full bg-accent-base" />
            Начало работы
          </div>

          <h2 class="mb-3 text-2xl leading-snug font-bold">
            Создайте первый проект<br>
            и запустите работу
          </h2>

          <p class="mb-12 text-sm leading-relaxed text-white/50">
            Соберите команду, расставьте задачи и начните управлять сроками в одном
            рабочем пространстве.
          </p>

          <ul class="space-y-6">
            <li
              class="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-base text-sm font-bold text-dark-gray"
              >
                1
              </span>
              <div>
                <p class="font-semibold">
                  Создайте проект
                </p>
                <p class="text-sm text-white/50">
                  Дайте проекту название и задайте цели.
                </p>
              </div>
            </li>
            <li
              class="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-base text-sm font-bold text-dark-gray"
              >
                2
              </span>
              <div>
                <p class="font-semibold">
                  Добавьте команду
                </p>
                <p class="text-sm text-white/50">
                  Пригласите участников и распределите роли.
                </p>
              </div>
            </li>
            <li
              class="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-base text-sm font-bold text-dark-gray"
              >
                3
              </span>
              <div>
                <p class="font-semibold">
                  Запустите диаграмму Ганта
                </p>
                <p class="text-sm text-white/50">
                  Планируйте этапы и отслеживайте прогресс в реальном времени.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { AppButton } from '@/shared';

const router = useRouter();
</script>
