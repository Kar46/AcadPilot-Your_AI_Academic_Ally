<<<<<<< HEAD
<<<<<<< HEAD
# Karam-ai-powered-todo
=======
# ai-academic-helper
# AcadPilot - AI-Powered Academic Assistant

AcadPilot is a cloud-native web application that assists students with academic tasks. It offers intelligent chat support and automated assignment generation using LLaMA 3 (via Groq API). The app allows exporting generated content as PDF and DOCX files. The entire backend is containerized and deployed on Google Cloud Run for scalability and reliability.

---

## Key Features

- AI Chat: Ask academic questions and get contextual answers.
- Assignment Helper: Auto-generates structured, clean assignment content.
- Export Options: Download responses as well-formatted PDF or DOCX files.
- Cloud-Native: Fully deployed using Google Cloud infrastructure.

---

## Cloud Services Used

| Google Cloud Service      | Purpose                                                   |
|--------------------------|-----------------------------------------------------------|
| Cloud Run                | Hosts the Node.js backend as a stateless, scalable API    |
| Artifact Registry        | Stores Docker container images securely                   |
| Cloud Build (Optional)   | Builds and deploys images automatically                   |
| Cloud Storage (Optional) | Hosts static frontend files (HTML, CSS, JS)               |

---

## Architecture Overview

1. **Frontend**: HTML/CSS/JS interface that communicates with the backend API.
2. **Backend**: Node.js + Express server, uses Groq’s LLaMA 3 via REST API.
3. **PDF/DOCX**: Generated using PDFKit and `docx` libraries.
4. **Deployment**: Dockerized and deployed to Google Cloud Run.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/acadpilot.git
cd acadpilot
>>>>>>> 75d217ba1d001c5c8e620177c2fce02e46d3b901
=======
# AcadPilot-Your_AI_Academic_Ally
>>>>>>> 0d93ce66296116e478bb71147fde2d7ca1638fe8
