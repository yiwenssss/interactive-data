<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  departments,
  formatMonthLabel,
  hospitalData,
  type Department,
  type ShiftName
} from '../data/hospitalData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const selectedDepartment = ref<Department>('ER')
const selectedShift = ref<ShiftName>('Night')

const departmentOptions = departments
const shiftOptions: ShiftName[] = ['Day', 'Evening', 'Night']

const filteredShifts = computed(() =>
  hospitalData.shifts.filter(
    (entry) => entry.department === selectedDepartment.value && entry.shift === selectedShift.value
  )
)

const staffingGapData = computed(() => filteredShifts.value.map((entry) => entry.recommendedStaffCount - entry.staffCount))
const waitTimeData = computed(() => filteredShifts.value.map((entry) => entry.avgWaitTimeMinutes))
const occupancyData = computed(() =>
  hospitalData.bedOccupancy
    .filter((entry) => entry.department === selectedDepartment.value)
    .map((entry) => ({ month: formatMonthLabel(entry.month), occupancyRate: entry.occupancyRate * 100 }))
)

const admissionsData = computed(() => ({
  labels: hospitalData.admissions.map((entry) => formatMonthLabel(entry.month)),
  values: hospitalData.admissions.map((entry) => entry.admissions)
}))

const worstShift = computed(() => {
  const entries = [...filteredShifts.value].sort((a, b) => b.avgWaitTimeMinutes - a.avgWaitTimeMinutes)
  return entries[0]
})

const peakAdmissionMonth = computed(() => {
  const max = [...hospitalData.admissions].sort((a, b) => b.admissions - a.admissions)[0]
  return max ? `${formatMonthLabel(max.month)} • ${max.admissions} admits` : 'N/A'
})

const lineChartData = computed(() => ({
  labels: filteredShifts.value.map((entry) => `${entry.date}`),
  datasets: [
    {
      label: 'Recommended staffing',
      data: filteredShifts.value.map((entry) => entry.recommendedStaffCount),
      borderColor: '#1f6feb',
      backgroundColor: 'rgba(31, 111, 235, 0.15)',
      tension: 0.35,
      fill: true,
      pointRadius: 4
    },
    {
      label: 'Actual staffing',
      data: filteredShifts.value.map((entry) => entry.staffCount),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      tension: 0.35,
      fill: false,
      pointRadius: 4
    },
    {
      label: 'Avg wait time',
      data: waitTimeData.value,
      borderColor: '#dc2626',
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      tension: 0.35,
      fill: false,
      yAxisID: 'y1',
      pointRadius: 4
    }
  ]
}))

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false
  },
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Staffing count'
      }
    },
    y1: {
      position: 'right' as const,
      beginAtZero: false,
      grid: {
        drawOnChartArea: false
      },
      title: {
        display: true,
        text: 'Minutes'
      }
    }
  }
}

const occupancyChartData = computed(() => ({
  labels: occupancyData.value.map((entry) => entry.month),
  datasets: [
    {
      label: `${selectedDepartment} occupancy`,
      data: occupancyData.value.map((entry) => entry.occupancyRate),
      backgroundColor: 'rgba(31, 111, 235, 0.7)',
      borderRadius: 8
    }
  ]
}))

const admissionsChartData = computed(() => ({
  labels: admissionsData.value.labels,
  datasets: [
    {
      label: 'Monthly admissions',
      data: admissionsData.value.values,
      backgroundColor: 'rgba(92, 124, 250, 0.28)',
      borderColor: '#5c7cfa',
      fill: true,
      borderWidth: 2,
      barThickness: 18
    }
  ]
}))

const narrativeStats = computed(() => [
  {
    label: 'Current staffing gap',
    value: `${Math.max(...staffingGapData.value)} open roles`,
    tone: 'warning'
  },
  {
    label: 'Peak wait time',
    value: `${worstShift.value?.avgWaitTimeMinutes ?? 0} min`,
    tone: 'danger'
  },
  {
    label: 'Peak demand month',
    value: peakAdmissionMonth.value,
    tone: 'info'
  }
])
</script>

<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <div class="hero-panel pa-6 pa-md-8 rounded-xl">
          <p class="eyebrow mb-2">Operational Story</p>
          <h1 class="text-h3 text-md-h2 mb-4">When staffing slips, wait time follows hours later.</h1>
          <p class="story-intro mb-5">
            A short staffing gap on a single night shift creates a backlog that lingers into the next day.
            The pattern becomes more dangerous when seasonal demand rises at the same time.
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4" elevation="0" rounded="xl" border>
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-subtitle-2 text-medium-emphasis">Department</span>
          </div>
          <v-btn-toggle v-model="selectedDepartment" color="primary" mandatory class="w-100" density="comfortable">
            <v-btn v-for="department in departmentOptions" :key="department" :value="department" class="flex-grow-1">
              {{ department }}
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card class="pa-4" elevation="0" rounded="xl" border>
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-subtitle-2 text-medium-emphasis">Shift focus</span>
          </div>
          <v-btn-toggle v-model="selectedShift" color="secondary" mandatory class="w-100" density="comfortable">
            <v-btn v-for="shift in shiftOptions" :key="shift" :value="shift" class="flex-grow-1">
              {{ shift }}
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="pa-4 metric-card" elevation="0" rounded="xl" border>
          <div class="text-subtitle-2 text-medium-emphasis mb-2">Narrative checkpoint</div>
          <div class="text-body-1">
            {{ selectedDepartment }} staffing and wait time are now aligned around the {{ selectedShift.toLowerCase() }} shift.
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col v-for="stat in narrativeStats" :key="stat.label" cols="12" sm="4">
        <v-card class="pa-5" elevation="0" rounded="xl" border :class="`${stat.tone}-panel`">
          <div class="text-caption text-uppercase text-medium-emphasis">{{ stat.label }}</div>
          <div class="text-h5 mt-2 font-weight-bold">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" lg="7">
        <v-card class="pa-4 chart-card" elevation="0" rounded="xl" border>
          <div class="d-flex justify-space-between align-center mb-3">
            <div>
              <div class="text-overline text-medium-emphasis">Cause and effect</div>
              <h2 class="text-h5 mb-0">Staffing gap vs. wait time</h2>
            </div>
          </div>
          <div class="chart-wrap">
            <Line :data="lineChartData" :options="lineChartOptions" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" lg="5">
        <v-card class="pa-4 chart-card" elevation="0" rounded="xl" border>
          <div class="text-overline text-medium-emphasis">Pressure signal</div>
          <h2 class="text-h5 mb-4">{{ selectedDepartment }} occupancy</h2>
          <div class="chart-wrap small-chart">
            <Bar :data="occupancyChartData" :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: false, max: 100, title: { display: true, text: 'Occupancy %' } } }
            }" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-4 chart-card" elevation="0" rounded="xl" border>
          <div class="text-overline text-medium-emphasis">Seasonality</div>
          <h2 class="text-h5 mb-4">Admission volume by month</h2>
          <div class="chart-wrap admissions-chart">
            <Bar :data="admissionsChartData" :options="{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: false, title: { display: true, text: 'Admissions' } } }
            }" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="pa-5" elevation="0" rounded="xl" border>
          <h2 class="text-h5 mb-2">What the story says</h2>
          <p class="mb-2">
            The highest waits cluster around the nights when staffing falls below the recommended level. Each spike in
            wait time arrives after the staffing shortfall, which means the system is absorbing risk several hours later.
          </p>
          <p>
            The admissions curve reinforces that trend: summer and early fall demand is already elevated, so the same
            staffing gap is amplified into much longer delays.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.hero-panel {
  background: linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%);
  border: 1px solid rgba(31, 111, 235, 0.15);
}

.eyebrow {
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #1f6feb;
}

.story-intro {
  max-width: 760px;
  color: rgba(15, 23, 42, 0.75);
  font-size: 1.05rem;
}

.metric-card,
.chart-card {
  height: 100%;
}

.warning-panel {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.25) !important;
}

.danger-panel {
  background: rgba(220, 38, 38, 0.06);
  border-color: rgba(220, 38, 38, 0.2) !important;
}

.info-panel {
  background: rgba(31, 111, 235, 0.06);
  border-color: rgba(31, 111, 235, 0.2) !important;
}

.chart-wrap {
  height: 320px;
}

.small-chart {
  height: 280px;
}

.admissions-chart {
  height: 260px;
}
</style>
