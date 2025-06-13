<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PieController,
  } from 'chart.js';
  import type { ChartData } from 'chart.js';
  import { Pie } from 'vue-chartjs';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import { supabase } from '@/services/DatabaseConnection';

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PieController,
    ChartDataLabels
  );

  // GRÁFICA
  const chartData = ref<ChartData<'pie'>>({
    labels: [],
    datasets: [],
  });
  const chartOptions = ref({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Calificaciones totales',
        font: { size: 20 },
        color: '#000000',
      },
      datalabels: {
        color: '#000000',
        formatter: (value: number, context: any) => {
          const data = context.chart.data.datasets[0].data;
          const total = data.reduce((sum: number, val: number) => sum + val, 0);
          const percentage = ((value / total) * 100).toFixed(1) + '%';
          const label = context.chart.data.labels[context.dataIndex];
          return [label, `${percentage}`];
        },
        font: {
          weight: 'bold' as const,
          size: 25,
        },
      },
    },
  });

  // OBTENER LA EMPRESA
  const route = useRoute();
  const companyId = route.params.id;

  onMounted(async () => {
    const { data: ratingsChart, error } = await supabase
      .from('internship')
      .select('alumn_id, result')
      .eq('company_id', companyId);

    if (error) {
      console.error('Error la información:', error);
      return;
    }

    const ratings = {
      apto: 0,
      'no apto': 0,
    };

    ratingsChart.forEach((i) => {
      const result = i.result?.toLowerCase();
      if (ratings.hasOwnProperty(result)) {
        ratings[result as keyof typeof ratings]++;
      }
    });

    chartData.value = {
      labels: ['Apto', 'No Apto'],
      datasets: [
        {
          data: [ratings['apto'], ratings['no apto']],
          backgroundColor: ['#0829fb', '#fb0808', '#13ea09'],
          hoverOffset: 10,
        },
      ],
    };
  });
</script>
