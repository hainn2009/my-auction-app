## 🏷️ Auction App

A **real-time online auction platform** built with a microservices architecture for scalability, responsiveness, and performance.  
The application allows users to join auctions, place bids, and instantly see live updates of the auction status.

---

### 🎨 Frontend – React.js

- **Tech Stack:** React.js, Redux Toolkit, React Router, Axios, WebSocket.
- **Key Features:**
  - Intuitive UI displaying product listings and live auction rooms.
  - Real-time bid updates via **WebSocket** connection.
  - Centralized state management using **Redux Toolkit**.
  - Integrated user authentication and auction session handling.
- **Deployment:** Deployed on **Vercel**, communicating with backend services through an API Gateway and WebSocket server.

---

### ⚙️ Backend – NestJS

- **Tech Stack:** NestJS, MongoDB, Redis, RabbitMQ, Docker, GKE (Google Kubernetes Engine).
- **Architecture:**
  - **Microservices-based design** including services such as _Gateway_, _Auction Service_, _Bidding Service_, and _Notification Service_.
  - **RabbitMQ** acts as the message broker enabling asynchronous communication between services.
  - **Redis Pub/Sub** provides real-time message broadcasting to frontend clients.
  - **MongoDB** stores user data, product information, and auction history.
- **Deployment:** All services are containerized and deployed on **GKE**, configured via **ConfigMap** and **Secret** for environment management and scalability.

---

### 🚀 Overview

The Auction App is designed to simulate a real-world auction process with a focus on:

- **Real-time responsiveness.**
- **Service decoupling and scalability.**
- **Cloud-native deployment and orchestration.**

🔁 Data Flow Overview

```js
[ User (Browser) ]
        │
        ▼
[ React Frontend (Vercel) ]
        │
        ▼
[ API Gateway (NestJS) ]
        │
        ├──► Publishes messages to RabbitMQ  (place bid, join auction)
        │
        ▼
[ Auction Service / Bidding Service (NestJS) ]
        │
        ├──► Processes bid logic
        │
        ├──► Updates MongoDB (in another worker process)
        │
        └──► Publishes auction result to Redis channel
                │
                ▼
[ Redis Pub/Sub ]
        │
        ▼
[ WebSocket Server → React Client ]
        │
        └──► Sends live auction updates in real time

```

#### 🏗️ Components

- **Frontend (React + Redux):** Renders UI and listens to real-time updates via WebSocket.
- **Gateway Service:** Entry point for HTTP/WebSocket connections; routes requests and emits events to RabbitMQ.
- **Auction & Bidding Services:** Handle business logic, validate bids, and update database state.
- **RabbitMQ:** Ensures asynchronous, reliable message delivery between services.
- **Redis:** Handles fast real-time broadcasting of auction results to clients.
- **MongoDB:** Stores user profiles, product listings, and auction history.
- **GKE:** Orchestrates Dockerized services, providing scalability, fault tolerance, and centralized management.

#### ⚡ Benefits

- **Real-time experience:** Instant feedback for all bidders through WebSocket + Redis Pub/Sub.
- **Scalability:** Each service can scale independently on Kubernetes.
- **Fault tolerance:** Message-driven design using RabbitMQ ensures no data loss on transient failures.
- **Cloud-native deployment:** Configurable via GKE ConfigMaps & Secrets for secure, flexible scaling.

#### AI Service

This feature is building. Done but need real data.
