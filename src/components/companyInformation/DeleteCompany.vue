<template>
  <p class="text-center mb-6 text-gray-700">
    Esta acción eliminará todos los datos relacionados cona la empresa.
  </p>
  <div class="flex justify-end gap-4">
    <button
      @click="$emit('close')"
      class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 hover:cursor-pointer"
    >
      Cancelar
    </button>
    <button
      @click="deleteCompany"
      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
    >
      Eliminar
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { supabase } from '@/services/DatabaseConnection';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const props = defineProps<{
    companyId: string | string[];
  }>();

  const deleteCompany = async () => {
    try {
      await supabase
        .from('company_cicle')
        .delete()
        .eq('company_id', props.companyId);

      await supabase
        .from('internship')
        .delete()
        .eq('company_id', props.companyId);

      const { error } = await supabase
        .from('company')
        .delete()
        .eq('id', props.companyId);

      if (error) {
        console.error('Error al eliminar la empresa:', error);
        alert(
          'Error al eliminar la empresa. Por favor, inténtelo de nuevo más tarde.'
        );
        return;
      }
      router.push('/dashboard/company');
    } catch (err) {
      console.error('Error al eliminar la empresa:', err);
      alert(
        'Error al eliminar la empresa. Por favor, inténtelo de nuevo más tarde.'
      );
    }
  };
</script>
