export type Department = 'ER' | 'ICU' | 'Telemetry' | 'Surgery'
export type ShiftName = 'Day' | 'Evening' | 'Night'
export type Season = 'Winter' | 'Spring' | 'Summer' | 'Fall'

export interface ShiftObservation {
  date: string
  shift: ShiftName
  department: Department
  staffCount: number
  recommendedStaffCount: number
  avgWaitTimeMinutes: number
  patientsSeen: number
}

export interface BedOccupancyRecord {
  month: string
  department: Department
  occupancyRate: number
}

export interface AdmissionRecord {
  month: string
  admissions: number
  season: Season
}

export interface StoryData {
  shifts: ShiftObservation[]
  bedOccupancy: BedOccupancyRecord[]
  admissions: AdmissionRecord[]
}

export const hospitalData: StoryData = {
  shifts: [
    { date: '2026-01-05', shift: 'Night', department: 'ER', staffCount: 4, recommendedStaffCount: 7, avgWaitTimeMinutes: 145, patientsSeen: 38 },
    { date: '2026-01-05', shift: 'Evening', department: 'ER', staffCount: 6, recommendedStaffCount: 7, avgWaitTimeMinutes: 96, patientsSeen: 35 },
    { date: '2026-01-05', shift: 'Day', department: 'ER', staffCount: 8, recommendedStaffCount: 8, avgWaitTimeMinutes: 58, patientsSeen: 42 },
    { date: '2026-01-10', shift: 'Night', department: 'ER', staffCount: 5, recommendedStaffCount: 7, avgWaitTimeMinutes: 128, patientsSeen: 41 },
    { date: '2026-01-10', shift: 'Evening', department: 'ER', staffCount: 7, recommendedStaffCount: 7, avgWaitTimeMinutes: 84, patientsSeen: 39 },
    { date: '2026-02-14', shift: 'Night', department: 'ER', staffCount: 4, recommendedStaffCount: 7, avgWaitTimeMinutes: 168, patientsSeen: 45 },
    { date: '2026-02-14', shift: 'Evening', department: 'ER', staffCount: 6, recommendedStaffCount: 7, avgWaitTimeMinutes: 120, patientsSeen: 44 },
    { date: '2026-02-14', shift: 'Day', department: 'ER', staffCount: 8, recommendedStaffCount: 8, avgWaitTimeMinutes: 71, patientsSeen: 46 },
    { date: '2026-03-19', shift: 'Night', department: 'ER', staffCount: 5, recommendedStaffCount: 7, avgWaitTimeMinutes: 134, patientsSeen: 43 },
    { date: '2026-03-19', shift: 'Evening', department: 'ER', staffCount: 7, recommendedStaffCount: 7, avgWaitTimeMinutes: 90, patientsSeen: 40 },
    { date: '2026-04-17', shift: 'Night', department: 'ER', staffCount: 6, recommendedStaffCount: 7, avgWaitTimeMinutes: 117, patientsSeen: 33 },
    { date: '2026-04-17', shift: 'Evening', department: 'ER', staffCount: 7, recommendedStaffCount: 7, avgWaitTimeMinutes: 78, patientsSeen: 34 },
    { date: '2026-06-02', shift: 'Night', department: 'ER', staffCount: 4, recommendedStaffCount: 7, avgWaitTimeMinutes: 176, patientsSeen: 52 },
    { date: '2026-06-02', shift: 'Evening', department: 'ER', staffCount: 5, recommendedStaffCount: 7, avgWaitTimeMinutes: 128, patientsSeen: 49 },
    { date: '2026-06-02', shift: 'Day', department: 'ER', staffCount: 8, recommendedStaffCount: 8, avgWaitTimeMinutes: 74, patientsSeen: 47 },
    { date: '2026-07-12', shift: 'Night', department: 'ER', staffCount: 4, recommendedStaffCount: 7, avgWaitTimeMinutes: 188, patientsSeen: 56 },
    { date: '2026-07-12', shift: 'Evening', department: 'ER', staffCount: 6, recommendedStaffCount: 7, avgWaitTimeMinutes: 140, patientsSeen: 54 },
    { date: '2026-08-23', shift: 'Night', department: 'ER', staffCount: 4, recommendedStaffCount: 7, avgWaitTimeMinutes: 194, patientsSeen: 59 },
    { date: '2026-08-23', shift: 'Evening', department: 'ER', staffCount: 5, recommendedStaffCount: 7, avgWaitTimeMinutes: 146, patientsSeen: 56 },
    { date: '2026-08-23', shift: 'Day', department: 'ER', staffCount: 7, recommendedStaffCount: 8, avgWaitTimeMinutes: 82, patientsSeen: 48 },
    { date: '2026-09-15', shift: 'Night', department: 'ER', staffCount: 5, recommendedStaffCount: 7, avgWaitTimeMinutes: 152, patientsSeen: 46 },
    { date: '2026-09-15', shift: 'Evening', department: 'ER', staffCount: 6, recommendedStaffCount: 7, avgWaitTimeMinutes: 110, patientsSeen: 43 },
    { date: '2026-10-21', shift: 'Night', department: 'ER', staffCount: 4, recommendedStaffCount: 7, avgWaitTimeMinutes: 171, patientsSeen: 48 },
    { date: '2026-10-21', shift: 'Evening', department: 'ER', staffCount: 5, recommendedStaffCount: 7, avgWaitTimeMinutes: 125, patientsSeen: 44 },
    { date: '2026-10-21', shift: 'Day', department: 'ER', staffCount: 7, recommendedStaffCount: 8, avgWaitTimeMinutes: 76, patientsSeen: 40 },

    { date: '2026-01-05', shift: 'Night', department: 'ICU', staffCount: 7, recommendedStaffCount: 10, avgWaitTimeMinutes: 92, patientsSeen: 18 },
    { date: '2026-01-05', shift: 'Evening', department: 'ICU', staffCount: 9, recommendedStaffCount: 10, avgWaitTimeMinutes: 64, patientsSeen: 17 },
    { date: '2026-06-02', shift: 'Night', department: 'ICU', staffCount: 7, recommendedStaffCount: 10, avgWaitTimeMinutes: 118, patientsSeen: 24 },
    { date: '2026-06-02', shift: 'Evening', department: 'ICU', staffCount: 8, recommendedStaffCount: 10, avgWaitTimeMinutes: 86, patientsSeen: 21 },
    { date: '2026-08-23', shift: 'Night', department: 'ICU', staffCount: 6, recommendedStaffCount: 10, avgWaitTimeMinutes: 126, patientsSeen: 26 },
    { date: '2026-08-23', shift: 'Evening', department: 'ICU', staffCount: 8, recommendedStaffCount: 10, avgWaitTimeMinutes: 89, patientsSeen: 22 },

    { date: '2026-01-05', shift: 'Night', department: 'Telemetry', staffCount: 6, recommendedStaffCount: 8, avgWaitTimeMinutes: 54, patientsSeen: 16 },
    { date: '2026-06-02', shift: 'Night', department: 'Telemetry', staffCount: 5, recommendedStaffCount: 8, avgWaitTimeMinutes: 76, patientsSeen: 18 },
    { date: '2026-08-23', shift: 'Night', department: 'Telemetry', staffCount: 5, recommendedStaffCount: 8, avgWaitTimeMinutes: 88, patientsSeen: 19 },

    { date: '2026-01-05', shift: 'Night', department: 'Surgery', staffCount: 8, recommendedStaffCount: 11, avgWaitTimeMinutes: 62, patientsSeen: 14 },
    { date: '2026-06-02', shift: 'Night', department: 'Surgery', staffCount: 7, recommendedStaffCount: 11, avgWaitTimeMinutes: 84, patientsSeen: 17 },
    { date: '2026-08-23', shift: 'Night', department: 'Surgery', staffCount: 6, recommendedStaffCount: 11, avgWaitTimeMinutes: 98, patientsSeen: 19 }
  ],
  bedOccupancy: [
    { month: '2026-01', department: 'ER', occupancyRate: 0.82 },
    { month: '2026-02', department: 'ER', occupancyRate: 0.87 },
    { month: '2026-03', department: 'ER', occupancyRate: 0.84 },
    { month: '2026-04', department: 'ER', occupancyRate: 0.8 },
    { month: '2026-05', department: 'ER', occupancyRate: 0.83 },
    { month: '2026-06', department: 'ER', occupancyRate: 0.91 },
    { month: '2026-07', department: 'ER', occupancyRate: 0.93 },
    { month: '2026-08', department: 'ER', occupancyRate: 0.96 },
    { month: '2026-09', department: 'ER', occupancyRate: 0.89 },
    { month: '2026-10', department: 'ER', occupancyRate: 0.88 },
    { month: '2026-11', department: 'ER', occupancyRate: 0.82 },
    { month: '2026-12', department: 'ER', occupancyRate: 0.85 },

    { month: '2026-01', department: 'ICU', occupancyRate: 0.74 },
    { month: '2026-02', department: 'ICU', occupancyRate: 0.76 },
    { month: '2026-03', department: 'ICU', occupancyRate: 0.78 },
    { month: '2026-04', department: 'ICU', occupancyRate: 0.8 },
    { month: '2026-05', department: 'ICU', occupancyRate: 0.81 },
    { month: '2026-06', department: 'ICU', occupancyRate: 0.86 },
    { month: '2026-07', department: 'ICU', occupancyRate: 0.9 },
    { month: '2026-08', department: 'ICU', occupancyRate: 0.92 },
    { month: '2026-09', department: 'ICU', occupancyRate: 0.88 },
    { month: '2026-10', department: 'ICU', occupancyRate: 0.85 },
    { month: '2026-11', department: 'ICU', occupancyRate: 0.79 },
    { month: '2026-12', department: 'ICU', occupancyRate: 0.81 },

    { month: '2026-01', department: 'Telemetry', occupancyRate: 0.68 },
    { month: '2026-02', department: 'Telemetry', occupancyRate: 0.71 },
    { month: '2026-03', department: 'Telemetry', occupancyRate: 0.72 },
    { month: '2026-04', department: 'Telemetry', occupancyRate: 0.75 },
    { month: '2026-05', department: 'Telemetry', occupancyRate: 0.79 },
    { month: '2026-06', department: 'Telemetry', occupancyRate: 0.8 },
    { month: '2026-07', department: 'Telemetry', occupancyRate: 0.84 },
    { month: '2026-08', department: 'Telemetry', occupancyRate: 0.88 },
    { month: '2026-09', department: 'Telemetry', occupancyRate: 0.81 },
    { month: '2026-10', department: 'Telemetry', occupancyRate: 0.77 },
    { month: '2026-11', department: 'Telemetry', occupancyRate: 0.7 },
    { month: '2026-12', department: 'Telemetry', occupancyRate: 0.73 },

    { month: '2026-01', department: 'Surgery', occupancyRate: 0.7 },
    { month: '2026-02', department: 'Surgery', occupancyRate: 0.72 },
    { month: '2026-03', department: 'Surgery', occupancyRate: 0.74 },
    { month: '2026-04', department: 'Surgery', occupancyRate: 0.76 },
    { month: '2026-05', department: 'Surgery', occupancyRate: 0.78 },
    { month: '2026-06', department: 'Surgery', occupancyRate: 0.83 },
    { month: '2026-07', department: 'Surgery', occupancyRate: 0.85 },
    { month: '2026-08', department: 'Surgery', occupancyRate: 0.9 },
    { month: '2026-09', department: 'Surgery', occupancyRate: 0.84 },
    { month: '2026-10', department: 'Surgery', occupancyRate: 0.8 },
    { month: '2026-11', department: 'Surgery', occupancyRate: 0.75 },
    { month: '2026-12', department: 'Surgery', occupancyRate: 0.77 }
  ],

  admissions: [
    { month: '2026-01', admissions: 620, season: 'Winter' },
    { month: '2026-02', admissions: 640, season: 'Winter' },
    { month: '2026-03', admissions: 690, season: 'Spring' },
    { month: '2026-04', admissions: 710, season: 'Spring' },
    { month: '2026-05', admissions: 760, season: 'Spring' },
    { month: '2026-06', admissions: 820, season: 'Summer' },
    { month: '2026-07', admissions: 905, season: 'Summer' },
    { month: '2026-08', admissions: 960, season: 'Summer' },
    { month: '2026-09', admissions: 835, season: 'Fall' },
    { month: '2026-10', admissions: 800, season: 'Fall' },
    { month: '2026-11', admissions: 735, season: 'Fall' },
    { month: '2026-12', admissions: 680, season: 'Winter' }
  ]
}

export const months = hospitalData.admissions.map((entry) => entry.month)
export const departments: Department[] = ['ER', 'ICU', 'Telemetry', 'Surgery']
export const shifts: ShiftName[] = ['Day', 'Evening', 'Night']

export const formatMonthLabel = (value: string) => {
  const [year, month] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date)
}
