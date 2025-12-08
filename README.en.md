
# 🎭 joke-gen-ai  
Technical challenge developed for the Incuca hiring process
(where even a SPA experiences emotional crises — the Single Page Application, not the relaxing kind)

An application whose mood swings more than a developer waiting for a deploy to finish — all powered by geek jokes served through the backend.

---

## 🚀 Technologies Used  
*Because even an emotionally unstable application needs stable tools.*

### **Frontend**
- **Vue.js 3** (Composition API)
- **Pinia** — state management
- **Vue Router** — route handling / mood switching
- **Vuetify** — UI components
- **Axios** — backend communication
- **ESLint** — static code analysis
- **Jest** — automated tests (planned)

### **Backend**
- **AdonisJS 6** — REST API
- **JWT Authentication** using `jsonwebtoken`
- **Lucid ORM** — migrations and models
- **Migration** to create the initial user
- **Axios** — Geek Joke API consumption
- **Japa** — official AdonisJS test runner
- **Docker** — unified environment (planned)

---

## 🎯 Project Objective  
*Because every SPA deserves a well-defined emotional journey.*

Build a SPA whose mood changes based on user interaction, using jokes from the **Geek Joke API**, always fetched through the backend.

---

## 🎭 Mood Flow by Routes  

| Route         | Mood |
|---------------|------|
| `/inicial`    | 😐 Neutral |
| `/triste`     | 😭 Sad |
| `/poker-face` | 😐 Poker Face + joke modal |
| `/feliz`      | 😁 Happy |

---

## 🧠 Interaction Flow (Summary)  

1. User logs in → redirected to `/inicial`
2. First click → `/triste`
3. Second click → `/poker-face`
   - Backend fetches a joke from the Geek Joke API
   - SPA displays the joke in a modal
   - Mood gradually improves
4. The modal can only be closed once the route becomes`/feliz`
5. Closing the modal returns the app to `/inicial`

🔒 All external communication is handled by the **backend**, as required.

API used: https://github.com/sameerkumar18/geek-joke-api

---

## 🔑 Authentication  

- JWT implemented with `jsonwebtoken`
- Token stored in **sessionStorage** for persistence
- Internal routes are protected

Default user created via migration:

- **Email:** `cliente@incuca.com.br`
- **Password:** `seumamesapossuirtrespernaschamadasqualidadeprecobaixoevelocidadeelaseriacapenga.`

---

## 🗂 Project Structure  

The final folder structure will be documented at the end of development.
Frontend and backend are fully decoupled to ensure maintainability and scalability.

---

## 🚧 How to Run the Project  

Full instructions will be added once core development is complete.

Final goal:

```bash
docker-compose up
```
---

## 📡 Application API  
*The backend makes both the bridge — and the joke — happen.*

### **POST /login**
- Validates credentials  
- Returns JWT  
- Persists session in the frontend  

### **GET /joke** *(authenticated)*
- Backend fetches a random joke  
- Returns it to the SPA  

---

## 🧠 Technical Decisions  
*(Serious section — someone has to stay composed.)*

- AdonisJS 6 chosen for its modern architecture and robust migration system.  
- JWT handled with `jsonwebtoken` for full control over the authentication flow.  
- Vue 3 + Pinia offer a scalable and lightweight state management structure.  
- Vuetify accelerates UI development with ready-to-use components.  
- Japa is the recommended test runner for AdonisJS 6.  
- Backend mediates the Geek Joke API to ensure security and compliance with the challenge requirements.  
- Clear separation between frontend and backend improves modularity and maintainability.  

> **Note:** The project is still under development, and some decisions may evolve. Any relevant update will be documented here.

---

## ⏱ Initial Estimate  
*Estimated time — not emotional stability (that one varies).*

Estimated **20 to 25 hours**, including:

- Backend + JWT  
- Migrations + initial user  
- SPA with mood-changing routes  
- Integration with the Geek Joke API  
- Basic tests  
- Documentation  

---

## 📝 Final Considerations  
*If even the SPA improves its mood, imagine this repository when it’s done.*

This project is being developed with:

- Clarity  
- Good practices  
- Organization  
- Focus on user experience  
- Full adherence to challenge requirements  

This README will be updated as development progresses.

---
