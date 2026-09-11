<template>
  <AppModal name="EditTeam">
    <div>
      <p>Редактирование команды проекта <span>(45)</span></p>
      <div>
        <label
          for=""
          @click="closeModal"
        >
          <input type="text">
        </label>
        <app-icon name="arrow-down" />
      </div>
      <div
        v-for="(data, index) in participantsData"
        :key="index"
      >
        <p>{{ data.name }}</p>
        <p>{{ data.email }}</p>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { AppIcon, AppModal, useModal } from '@/shared';

const { closeModal } = useModal();
interface Participant {
    name: string;
    email: string;
    role: 'ответственный' | 'участник' | 'владелец' | 'наблюдатель';
}

const participantsData: Participant[] = [
    {
        name: 'Алергик Конь',
        email: 'anatolya@gmail.com',
        role: 'ответственный',
    },
    {
        name: 'Иван Петров',
        email: 'ivan.petrov@mail.ru',
        role: 'владелец',
    },
    {
        name: 'Мария Сидорова',
        email: 'maria.s@yandex.ru',
        role: 'участник',
    },
    {
        name: 'Алексей Волков',
        email: 'volkov.a@gmail.com',
        role: 'участник',
    },
    {
        name: 'Елена Новикова',
        email: 'elena.n@outlook.com',
        role: 'наблюдатель',
    },
    {
        name: 'Дмитрий Козлов',
        email: 'd.kozlov@mail.ru',
        role: 'ответственный',
    },
    {
        name: 'Анна Морозова',
        email: 'anna.morozova@gmail.com',
        role: 'участник',
    },
    {
        name: 'Сергей Павлов',
        email: 's.pavlov@yandex.ru',
        role: 'владелец',
    },
    {
        name: 'Ольга Соколова',
        email: 'olga.sokolova@mail.ru',
        role: 'участник',
    },
    {
        name: 'Андрей Лебедев',
        email: 'lebedev.a@gmail.com',
        role: 'наблюдатель',
    },
    {
        name: 'Татьяна Кузнецова',
        email: 't.kuznetsova@outlook.com',
        role: 'ответственный',
    },
    {
        name: 'Николай Попов',
        email: 'popov.n@mail.ru',
        role: 'участник',
    },
    {
        name: 'Екатерина Васильева',
        email: 'ekaterina.v@gmail.com',
        role: 'участник',
    },
    {
        name: 'Михаил Зайцев',
        email: 'zaycev.m@yandex.ru',
        role: 'владелец',
    },
    {
        name: 'Наталья Орлова',
        email: 'orlova.n@gmail.com',
        role: 'наблюдатель',
    },
    {
        name: 'Владимир Семёнов',
        email: 'v.semenov@mail.ru',
        role: 'ответственный',
    },
    {
        name: 'Ирина Голубева',
        email: 'irina.g@outlook.com',
        role: 'участник',
    },
    {
        name: 'Александр Виноградов',
        email: 'vinogradov.a@gmail.com',
        role: 'участник',
    },
    {
        name: 'Светлана Богданова',
        email: 'bogdanova.s@yandex.ru',
        role: 'наблюдатель',
    },
    {
        name: 'Павел Воробьёв',
        email: 'vorobyov.p@mail.ru',
        role: 'ответственный',
    },
];
</script>
