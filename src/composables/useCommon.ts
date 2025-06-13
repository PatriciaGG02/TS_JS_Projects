// useStatusColor.ts
import { computed } from 'vue';

export function useStatusColor(status: string) {
  const colorByStatusResult = computed(() => {
    const estado = status?.toLowerCase();

    switch (estado) {
      case 'cursando':
      case 'apto':
      case 'true':
        return 'bg-green-500';

      case 'a la espera':
      case 'pendiente':
        return 'bg-yellow-500';

      case 'finalizado':
      case 'no apto':
      case 'sin empresa':
      case 'false':
        return 'bg-red-500';

      default:
        return 'bg-gray-500';
    }
  });

  return {
    colorByStatusResult,
  };
}

export const normalize = (str: string): string =>
  String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
