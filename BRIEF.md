# Hospital Capacity and Staffing: BRIEF

## 1. What You're Building

Data gets ignored all the time, not because it isn't useful, but because no one took the time to make it mean something. This is an interactive data story, not a dashboard. The numbers aren't the point, the narrative built around them is.

The story here: how thin staffing on a single shift ripples forward into hours of ER wait time, and how that pattern repeats across seasons. Interaction (filters, toggles, animation) is icing on top of that story, not the goal itself.

Data is invented or simplified. The job is telling the story well, not modeling a real hospital system.

## 2. Topic and Narrative

### 2.1 Topic

Hospital capacity and staffing: how staffing levels, bed occupancy, and seasonal admission spikes connect to ER wait times and patient outcomes.

### 2.2 Point of View

When a shift is understaffed, the effect isn't contained to that shift. It shows up hours later as a wait time spike, and it compounds when it lands on top of a seasonal admission surge. The story should make that cause and effect visible, not just plot three unrelated metrics next to each other.

### 2.3 What Someone Should Walk Away Understanding

That ER wait times are not random. They are downstream of staffing decisions made hours earlier, and that effect gets worse during predictable seasonal peaks, meaning it is preventable, not inevitable.

## 3. Audience

Health system administrator, primarily. Also relevant to a patient or caregiver who wants to understand why a given ER visit involved a long wait.

## 4. Data

### 4.1 Data Story Elements

- ER wait times by shift and department
- Staffing levels by shift and department
- Bed occupancy by department, over time
- Seasonal admission volume, by month

### 4.2 data.json Schema (draft, invented data)

All data for this project lives in a single `data.json` file at the project root or in `src/data/`.

```json
{
  "shifts": [
    {
      "date": "2026-01-05",
      "shift": "Night",
      "department": "ER",
      "staffCount": 4,
      "recommendedStaffCount": 7,
      "avgWaitTimeMinutes": 145,
      "patientsSeen": 38
    }
  ],
  "bedOccupancy": [
    {
      "month": "2026-01",
      "department": "ER",
      "occupancyRate": 0.82
    }
  ],
  "admissions": [
    {
      "month": "2026-01",
      "admissions": 620,
      "season": "Winter"
    }
  ]
}
```

Keep the invented dataset small (a handful of departments, a year or two of months, a representative sample of shifts). Enough to show a real pattern, not a production sized dataset.

## 5. Design Direction

### 5.1 Layout Priority

Mobile and iPad first, desktop second. Build and test the layout at narrow and medium breakpoints before expanding to desktop. Vuetify's grid and breakpoint system (`xs`, `sm`, `md`, `lg`, `xl`) should drive this, not custom media queries layered on top.

### 5.2 Visual Style Notes

Keep the visual language calm and clinical, this is a healthcare story. Reserve strong color (red/amber) for the moments the narrative wants to draw attention to, such as a wait time spike, so it doesn't compete with the rest of the palette.

## 6. Interaction

Interaction supports the story, it does not replace it. Candidates:

- A shift/date filter to move through the timeline and watch the staffing-to-wait-time relationship play out
- A department toggle to compare ER against other departments
- A simple animation or transition when a staffing gap and a wait time spike align, to visually reinforce the cause and effect

## 7. Tech Stack and Project Setup

### 7.1 Stack

- Vue 3 with Vite and TypeScript
- Vue Router
- Vuetify 3, with Material Design Icons
- Chart.js with vue-chartjs, for the data visualizations

### 7.2 Setup Commands

```bash
npm create vite@latest operational-dashboard -- --template vue-ts
cd operational-dashboard

npm install vue-router@4
npm install vuetify @mdi/font
npm install chart.js vue-chartjs

npm install
npm run dev
```

### 7.3 Configuration Notes

- Vuetify 3 needs to be wired up manually in `src/main.ts`: create the Vuetify instance with `createVuetify()`, set `mdi` as the icon font, and register it as a plugin alongside the router.
- Import the Material Design Icons stylesheet from `@mdi/font/css/materialdesignicons.css`.
- Register Chart.js components (e.g. `CategoryScale`, `LinearScale`, `LineElement`, `BarElement`) before using vue-chartjs components, per Chart.js v4 requirements.
- Place `data.json` where it can be imported directly, e.g. `src/data/data.json`, and import it into components as needed.

## 8. Chart Plan

| Chart | Data | Purpose in the story |
|---|---|---|
| Line chart | Staffing level vs. avg wait time, by shift | Show the cause and effect directly |
| Bar chart | Bed occupancy by department, by month | Show where the system is under the most pressure |
| Area or bar chart | Admissions by month, with season labeled | Show the seasonal pattern the whole story sits on top of |

## 9. Out of Scope

- [ ] Real hospital data or any live data source
- [ ] Authentication or multi-user support
- [ ] Server/backend, this is a static, client-side data story
- [ ] Editing data through the UI, `data.json` is edited directly

## 10. Open Questions / Assumptions

- [ ] Assuming a single static `data.json` file is sufficient, no API layer.
- [ ] Assuming "operational-dashboard" is the intended project name even though this is a data story, not an ops dashboard, confirm if a different name is preferred.
- [ ] Time range and number of departments in the invented dataset still need to be finalized, currently planned as small and illustrative.
