# Hospital Capacity and Staffing

An interactive data story about how staffing gaps become longer emergency-room waits, especially when seasonal demand is already putting pressure on the hospital.

The data is invented and intentionally small. The goal is to make the relationship between staffing, occupancy, admissions, and wait time easy to see rather than model a production hospital system.

## Story

The experience follows one central idea: a staffing decision made on one shift can show up as a wait-time spike hours later. Seasonal admission peaks make that effect more pronounced, which means the pattern is predictable and preventable.

The home view lets readers compare:

- staffing coverage and average wait time by department and shift
- bed occupancy over the year
- monthly admissions and seasonal pressure

The department and shift controls change the story highlight and the staffing/wait-time view. The other charts retain the full-year context so the selected shift is not mistaken for the whole system.

## Tech Stack

- Vue 3 and TypeScript
- Vite
- Vuetify 4 with Material Design Icons
- Chart.js with vue-chartjs
- Vue Router

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite. To create a production build:

```bash
npm run build
```

## Project Structure

```text
src/
	data/hospitalData.ts   Invented story dataset and shared types
	views/HomeView.vue     Narrative layout, controls, and charts
	style.css              Global application styling
	plugins/vuetify.ts     Vuetify and icon configuration
```

## Data

All data lives in `src/data/hospitalData.ts` and follows three collections:

- `shifts`: staffing, recommended staffing, wait time, and patients seen
- `bedOccupancy`: monthly occupancy rate by department
- `admissions`: monthly admission volume and season

There is no backend, authentication, live data source, or in-app data editing. Update the TypeScript dataset directly when changing the story data.

## Scope

This is a static, client-side data story designed for mobile and tablet first, with a wider desktop layout. It is not a clinical decision-support tool and should not be used to make real patient-care or staffing decisions.
# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
