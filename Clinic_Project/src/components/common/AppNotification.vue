<template>
  <transition name="slide-fade">
    <div v-if="visible" :class="['notification', type]">
      <img :src="iconSrc" alt="Success icon" width="30px" />
      <span class="message">{{ message }}</span>
      <button
        class="close-btn"
        @click="visible = false"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watchEffect, onUnmounted, computed } from "vue";

const emit = defineEmits(["hidden"]);

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success",
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

// Mapeo de iconos por tipo
const iconMap = {
  success: new URL("@/assets/notification-icons/success.svg", import.meta.url)
    .href,
  error: new URL("@/assets/notification-icons/error.svg", import.meta.url).href,
  info: new URL("@/assets/notification-icons/info.svg", import.meta.url).href,
  warning: new URL("@/assets/notification-icons/warning.svg", import.meta.url)
    .href,
};

const iconSrc = computed(() => iconMap[props.type]);

const visible = ref(true);
let timeoutId = null;

watchEffect(() => {
  if (!props.message) return;

  visible.value = true;

  if (props.duration > 0) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      visible.value = false;
      emit("hidden");
    }, props.duration);
  }
});

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  min-width: 280px;
  max-width: 400px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  user-select: none;
  z-index: 9999;
}

.notification.success {
  background: linear-gradient(135deg, var(--verde-confianza), #2e7d32);
}

.notification.error {
  background: linear-gradient(135deg, var(--rojo-controlado), #c62828);
}

.notification.warning {
  background: linear-gradient(135deg, #ff9800, #ef6c00);
}

.notification.info {
  background: linear-gradient(135deg, #2196f3, #1565c0);
}

.message {
  flex-grow: 1;
  font-size: 1rem;
  line-height: 1.2;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: transform 0.2s ease;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn:hover {
  transform: scale(1.2);
  background-color: rgba(255, 255, 255, 0.15);
}

.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
