🚀 Full-Stack Chat Application (DevOps + Kubernetes)

A production-ready real-time chat application built using the MERN stack, containerized with Docker, and deployed on Kubernetes with Ingress, Auto Scaling (HPA), and MongoDB.

This project demonstrates real-world DevOps practices, cloud-native architecture, and scalable microservice deployment.

📌 Key Highlights

-Real-time chat using Socket.IO

-Fully containerized using Docker

-Deployed on Kubernetes (Minikube)

-NGINX Ingress for single entry point

-Horizontal Pod Autoscaler (HPA) for frontend & backend

-Secure configuration using Environment Variables

-Works with or without Ingress

-Clean GitHub-ready project structure

🧱 Technology Stack
Frontend
    -React.js
    -Axios
    -Socket.IO Client
    -NGINX (production build)

Backend
    -Node.js
    -Express.js
    -MongoDB (Mongoose)
    -Socket.IO
    -JWT Authentication

DevOps / Cloud
    -Docker & Docker Hub
    -Kubernetes (Minikube)
    -Kubernetes Services (ClusterIP / NodePort)
    -NGINX Ingress Controller
    -Horizontal Pod Autoscaler (HPA)
    -Metrics Server

📐 Architecture Diagram

User Browser
     |
     |  http://chatapp.local
     v
┌────────────────────┐
│  NGINX Ingress     │
│  chatapp.local     │
└─────────┬──────────┘
          |
          ├── "/"     → Frontend Service (React + NGINX)
          |
          └── "/api"  → Backend Service (Node.js + Express)
                             |
                             v
                       MongoDB Service



🔁 Application Flow

1.User opens chatapp.local
2.Ingress routes traffic:
    / → Frontend Service
    /api → Backend Service
3.Frontend sends API requests to /api
4.Backend processes requests and connects to MongoDB
5.Socket.IO enables real-time messaging
6.Kubernetes HPA scales pods automatically based on CPU usage

📂 Project Structure

chat-app/
│
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── models/
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   └── components/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── .env.example
│
├── k8s/
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-hpa.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── frontend-hpa.yaml
│   ├── mongodb-deployment.yaml
│   ├── mongodb-service.yaml
│   └── chatapp-ingress.yaml
│
└── README.md

🔐 Environment Variables

    -Backend (backend/.env.example)
        PORT=5001
        MONGO_URI=your_mongodb_uri_here
        JWT_SECRET=your_jwt_secret

    -Frontend (frontend/.env.example)
        VITE_API_BASE_URL=/api

🚀 Run Locally (Without Kubernetes)
    -Backend
        cd backend
        npm install
        npm run dev
    
    -Frontend
        cd frontend
        npm install
        npm run dev

☸️ Run on Kubernetes
    1. Enable Ingress
        minikube addons enable ingress

    2. Deploy Application
        kubectl apply -f k8s/

    3. Add Host Entry
        <minikube-ip> chatapp.local

    4. Access Application
        http://chatapp.local
        
📊 Auto Scaling (HPA)
Component	CPU Target	Min Pods	Max Pods
Backend	    50%	            1	        5
Frontend	60%	            1	        4

Metrics Server is enabled for HPA support.


