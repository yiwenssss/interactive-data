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

type ShiftFilter = ShiftName | 'All'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const selectedDepartment = ref<Department>('ER')
const selectedShift = ref<ShiftFilter>('Night')

const departmentOptions = departments
const shiftOptions: ShiftFilter[] = ['Day', 'Night', 'All']

const filteredShifts = computed(() =>
  hospitalData.shifts.filter(
    (entry) =>
      entry.department === selectedDepartment.value &&
      (selectedShift.value === 'All' || entry.shift === selectedShift.value)
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

const insightCopy: Record<string, { headline: string; first: string; second: string }> = {
  'ER-Day': {
    headline: 'ER days absorb the first wave of demand.',
    first: 'Day coverage has the largest patient volume, so a small gap here can quickly lengthen the queue before evening arrives.',
    second: 'Protecting this handoff keeps the rest of the day from starting in recovery mode.'
  },
  'ER-Night': {
    headline: 'ER nights turn a staffing gap into a wait-time spike.',
    first: 'Night coverage is where the sharpest delay appears: fewer clinicians are carrying a queue that can reach nearly three hours.',
    second: 'That makes overnight staffing a practical lever for preventing tomorrow morning backlog.'
  },
  'ICU-Day': {
    headline: 'ICU days are about protecting complex care.',
    first: 'Daytime ICU work is less about volume and more about keeping high-acuity patients from competing for the same attention.',
    second: 'A stable daytime team creates room for careful decisions when the unit is full.'
  },
  'ICU-Night': {
    headline: 'ICU nights carry quiet but costly risk.',
    first: 'The night gap is easy to miss because fewer patients arrive, but each patient requires sustained, high-intensity care.',
    second: 'Coverage after dark protects continuity, not just capacity.'
  },
  'Telemetry-Day': {
    headline: 'Telemetry days depend on steady watchfulness.',
    first: 'During the day, consistent monitoring helps the team spot changes before they become escalations or transfers.',
    second: 'Reliable coverage turns early signals into earlier action.'
  },
  'Telemetry-Night': {
    headline: 'Telemetry nights expose the cost of thin coverage.',
    first: 'With fewer people watching the monitors overnight, small staffing gaps can stretch response time when a patient changes suddenly.',
    second: 'Night coverage is a quiet safeguard against avoidable escalation.'
  },
  'Surgery-Day': {
    headline: 'Surgery days are choreography under pressure.',
    first: 'The daytime schedule depends on every role arriving ready, because one missing person can slow several rooms at once.',
    second: 'Staffing the full chain keeps procedure time from becoming recovery time.'
  },
  'Surgery-Night': {
    headline: 'Surgery nights rely on readiness, not volume.',
    first: 'Overnight teams may see fewer procedures, but they need enough depth to respond safely when an urgent case arrives.',
    second: 'A small reserve of coverage buys the system valuable flexibility.'
  },
  'ER-All': {
    headline: 'ER pressure builds across the full day.',
    first: 'The department is not dealing with one isolated spike; morning volume, evening arrivals, and overnight gaps compound each other.',
    second: 'The strongest intervention is a coordinated day, not a single heroic shift.'
  },
  'ICU-All': {
    headline: 'ICU capacity is a continuity problem.',
    first: 'Across the day, staffing has to preserve the same level of attention as patients move between rounds, procedures, and rest periods.',
    second: 'Consistency is what keeps a full unit from becoming an unsafe unit.'
  },
  'Telemetry-All': {
    headline: 'Telemetry turns small signals into a system story.',
    first: 'The full-day view connects monitoring, response, and handoff quality rather than treating each shift as a separate island.',
    second: 'Better coverage gives the team time to act before the next alarm.'
  },
  'Surgery-All': {
    headline: 'Surgery capacity is limited by the whole chain.',
    first: 'Rooms, clinicians, recovery, and urgent readiness all have to line up; a staffing gap in one place can slow the entire schedule.',
    second: 'Planning for the day as a system protects both throughput and care quality.'
  }
}

const insightHighlight = computed(() => {
  const key = `${selectedDepartment.value}-${selectedShift.value}`
  return insightCopy[key]
})
</script>

<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 text-md-h2 mb-4">When staffing slips, wait time follows hours later.</h1>
        <p class="story-intro mb-5">
          A short staffing gap on a single night shift creates a backlog that lingers into the next day.
          The pattern becomes more dangerous when seasonal demand rises at the same time.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
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

      <v-col cols="12" md="4">
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

    </v-row>

    <v-row class="mt-2">
      <v-col v-for="stat in narrativeStats" :key="stat.label" cols="12" sm="4">
        <v-card class="pa-5" elevation="0" rounded="xl" border :class="`${stat.tone}-panel`">
          <div class="text-caption text-uppercase text-medium-emphasis">{{ stat.label }}</div>
          <div class="text-h5 mt-2 font-weight-bold">{{ stat.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4 insight-row" justify="end">
      <v-col cols="12" md="7" lg="5">
        <v-card class="pa-5 insight-card" elevation="0" rounded="xl" border>
          <div class="insight-heading mb-4">
            <span class="insight-heading-emoji" aria-hidden="true">📉</span>
            <h2 class="text-h5 mb-0">Insight Highlight</h2>
          </div>
          <div class="insight-callout mb-4">
            <strong>{{ insightHighlight.headline }}</strong>
          </div>
          <div class="insight-copy">
            <p class="mb-3">
              {{ insightHighlight.first }}
            </p>
            <p>
              {{ insightHighlight.second }}
            </p>
          </div>
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

.insight-callout {
  display: block;
  padding: 12px;
  border-left: none;
  border-radius: 10px;
  background: #fff8e7;
  color: #78350f;
  text-align: left;
  overflow-wrap: anywhere;
}

.insight-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.insight-copy {
  max-width: 900px;
  color: rgba(15, 23, 42, 0.78);
}

.insight-card {
  position: fixed;
  top: 143px;
  right: max(20px, calc((100vw - 1280px) / 2));
  width: 135px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 136px);
  overflow-y: auto;
  overflow-wrap: anywhere;
  font-size: 0.78rem;
  line-height: 1.35;
  z-index: 10;
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12) !important;
}

.insight-card h2 {
  font-size: 0.95rem !important;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.insight-card .insight-heading {
  margin-bottom: 12px !important;
}

.insight-heading-emoji {
  display: block;
  margin-bottom: 6px;
  font-size: 1.35rem;
  line-height: 1;
}

.insight-card .insight-callout {
  padding: 10px;
  font-size: 0.75rem;
  text-align: left;
}

.insight-card .insight-copy {
  font-size: 0.73rem;
  line-height: 1.4;
}

@media (max-width: 959px) {
  .insight-card {
    position: static;
    width: auto;
  }
}
</style>
