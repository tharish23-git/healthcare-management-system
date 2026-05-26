# Healthcare Appointment & Medical Record System (React + Vite)

## Overview
This is a simple healthcare web application built with React and Vite.

It simulates a clinic system where:
- Doctors can create appointment slots and manage medical records
- Patients can book appointments and view their medical records

The project demonstrates a full frontend CRUD system with role-based UI.


## User Roles
### Doctor
- Create appointment slots
- View all slots
- Create medical records for patients
- Edit medical records (Update)
- Delete medical records

### Patient
- View available appointment slots
- Book appointments
- Cancel appointments
- View personal medical records


## Features (CRUD)
### Appointments (Slots)
- Create slots (Doctor)
- Read available slots (Doctor/Patient)
- Book slot (Patient)
- Cancel booking (Patient)

### Medical Records
- Create record (Doctor)
- Read records (Doctor/Patient filtered)
- Update record (Doctor)
- Delete record (Doctor)


## Tech Stack
- React (Vite)
- useState for state management
- Inline CSS styling

(No backend is connected yet — data is stored in frontend state only)


## How to Run
npm install
npm run dev