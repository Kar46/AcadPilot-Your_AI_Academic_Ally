
# AcadPilot - AI-Powered Academic Assistant

AcadPilot is a fully cloud-native web application that leverages AI to assist students with academic tasks. It integrates with LLaMA 3 to offer intelligent responses for questions and auto-generates assignment content. The project is entirely deployed and orchestrated using Google Cloud Platform services to ensure scalability, reliability, and performance.

---

## Key Features

- **AI Chat System**: Ask academic queries and get instant responses using LLaMA 3.
- **Assignment Helper**: Automatically generates detailed academic answers.
- **Multi-format Export**: Download responses as clean, formatted PDF or DOCX files.
- **Modern UI**: Simple and responsive frontend built with HTML/CSS/JS.

---

## Google Cloud Services Utilized

| GCP Service              | Role & Usage                                                                 |
|--------------------------|------------------------------------------------------------------------------|
| **Cloud Run**            | Hosts the backend API (Node.js + Express) as a serverless container.        |
| **Artifact Registry**    | Stores Docker images used for deployment.                                    |
| **Cloud Storage** | Used for hosting static frontend files like HTML, CSS, and assets.           |
| **IAM & Permissions**    | Manages access controls to services and deployments.                         |
| **Cloud Logging**        | Monitors application performance and error logs in real time.                |

---

## System Architecture

Frontend (HTML/CSS/JS) >
Node.js + Express Backend (AI Chat + Assignment Generator) >
Groq API (LLaMA 3) PDFKit / docx Libraries >
Deployment via Docker → Container pushed to Artifact Registry → Deployed on Cloud Run
