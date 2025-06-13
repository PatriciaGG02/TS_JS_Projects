import { ref, computed, watch } from "vue";

// Estado reactivo para el día, mes y año seleccionados
export function useCalendar(appointmentsSource = []) {
  const selectedDay = ref(new Date().getDate());
  const selectedMonth = ref(new Date().getMonth());
  const selectedYear = ref(new Date().getFullYear());
  const citas = ref([...appointmentsSource]);

  // Formatea un número a dos dígitos
  const pad = (n) => n.toString().padStart(2, "0");

  // Fecha seleccionada en formato YYYY-MM-DD
  const selectedDate = computed(() =>
    selectedDay.value
      ? `${selectedYear.value}-${pad(selectedMonth.value + 1)}-${pad(
          selectedDay.value
        )}`
      : ""
  );

  // Citas del día seleccionado
  const citasDelDia = computed(() => {
    if (!selectedDay.value) return [];
    return citas.value.filter((c) => c.date === selectedDate.value);
  });

  // Citas de mañana
  const citasTomorrow = computed(() => {
    const hoy = new Date();
    const tomorrow = new Date(hoy);
    tomorrow.setDate(hoy.getDate() + 1);
    const fechaTomorrow = `${tomorrow.getFullYear()}-${pad(
      tomorrow.getMonth() + 1
    )}-${pad(tomorrow.getDate())}`;
    console.log("Citas de mañana:", citasTomorrow.value);
    return citas.value.filter((c) => c.date === fechaTomorrow);
  });

  // Fecha seleccionada formateada para mostrar
  const fechaFormateada = computed(() => {
    if (!selectedDay.value) return "";
    const dateObj = new Date(
      selectedYear.value,
      selectedMonth.value,
      selectedDay.value
    );

    // Extraemos año, mes y día en formato string con ceros a la izquierda si hace falta
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-based
    const day = String(dateObj.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  // Cambiar dia, mes y año
  function handleDaySelected(day) {
    selectedDay.value = day;
  }
  function handleChangeMonth(newMonth) {
    selectedMonth.value = newMonth;
    selectedDay.value = null;
  }
  function handleChangeYear(newYear) {
    selectedYear.value = newYear;
    selectedDay.value = null;
  }

  return {
    selectedDay,
    selectedMonth,
    selectedYear,
    citas,
    citasDelDia,
    citasTomorrow,
    fechaFormateada,
    selectedDate,
    handleChangeMonth,
    handleChangeYear,
    handleDaySelected,
  };
}
