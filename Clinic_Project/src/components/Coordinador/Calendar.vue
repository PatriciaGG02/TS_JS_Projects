<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth">‹</button>
      <span>{{ monthName }} {{ currentDate.getFullYear() }}</span>
      <button @click="nextMonth">›</button>
    </div>

    <div class="days-grid">
      <div class="day-name" v-for="(day, i) in days" :key="i">{{ day }}</div>

      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'day',
          day === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear()
            ? 'today'
            : '',
          day === props.selectedDay ? 'selected' : '',
        ]"
        @click="selectDay(day)"
      >
        {{ day || "" }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const emit = defineEmits(["selectDay", "changeMonth", "changeYear"]);
//Recibe también selectedMonth y selectedYear como props.

const props = defineProps({
  selectedDay: {
    type: Number,
    default: null, // Día seleccionado inicialmente
  },
  selectedMonth: {
    type: Number,
    required: true,
  },
  selectedYear: {
    type: Number,
    required: true,
  },
});

const today = new Date();
const currentDate = ref(new Date());
const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

// Nombre del mes actual, calculado dinámicamente
const monthName = computed(() =>
  currentDate.value.toLocaleString("default", { month: "long" })
);

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getStartDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

// Computa los días del mes actual, incluyendo los días vacíos al inicio.
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  const daysArray = Array(startDay).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }

  return daysArray;
});

// Sincroniza currentDate con selectedMonth y selectedYear.
watch(
  () => [props.selectedMonth, props.selectedYear],
  ([newMonth, newYear]) => {
    currentDate.value = new Date(newYear, newMonth, 1);
  }
);

// Función para ir al mes anterior
function prevMonth() {
  const prev = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
  currentDate.value = prev;
  emit("changeMonth", prev.getMonth());
  emit("changeYear", prev.getFullYear());
}

// Función para ir al mes siguiente
function nextMonth() {
  const next = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
  currentDate.value = next;
  emit("changeMonth", next.getMonth());
  emit("changeYear", next.getFullYear());
}

// Función que emite el día seleccionado, si es válido
function selectDay(day) {
  if (!day) return;
  emit("selectDay", day);
}
</script>

<style scoped>
.calendar-container {
  background-color: #1e2a2a;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", sans-serif;
  transition: all 0.3s ease;
  width: 100%;
  height: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.3vw;
  margin-bottom: 0.8rem;
  width: 100%;
  flex: 0 0 auto;
}

.calendar-header button {
  background: none;
  border: none;
  color: #cfd2d3;
  cursor: pointer;
  font-size: 1.2rem;
  transition: color 0.2s;
  width: 2.5rem;
  height: 2.5rem;
}

.days-grid {
  flex: 1 1 0;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
  align-content: stretch;
}

.day-name {
  font-size: 0.85rem;
  font-weight: bold;
  text-align: center;
  color: #cfd2d3;
  width: 100%;
}
.day:hover {
  background-color: #2e3b4e;
  color: #fff;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 16px;
}
.day {
  padding: 0.6rem;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  font-size: 1vw;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  min-height: 2.2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day.selected {
  background-color: #177ca9;
  color: #fff;
  font-weight: bold;
  box-shadow: #0f5472 0px 0px 10px;
  border: 3px solid #0f5472;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  border-radius: 16px;
}

@media (max-width: 700px) {
  .calendar-container {
    max-width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    height: 100%;
  }
  .calendar-header {
    font-size: 1rem;
  }
  .day-name,
  .day {
    padding: 0.3rem;
    font-size: 0.9rem;
  }
}
</style>
