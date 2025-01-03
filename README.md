﻿# Microservice
 
 Microservices-based application for a ride-sharing system where you have three main services:

1. **Ride Service** - This service manages ride requests.
2. **Captain Service** - This service manages captain (driver) actions, such as accepting a ride.
3. **User Service** - This service manages the users (riders).

We will use **RabbitMQ** for communication between the services and **log polling** to simulate logging.

All services will be running locally on `localhost:3000` for the sake of simplicity.

### Key Components:
- **RabbitMQ** for asynchronous communication between services.
- **Express.js** for the microservices.
- **Amqplib** for RabbitMQ communication.
- **Polling** a log file to simulate log tracking.
  
We'll also assume that we have installed RabbitMQ locally and have `npm` (Node.js) set up.

### Prerequisites:
1. RabbitMQ should be running locally on `localhost:5672`.
2. You need to install the following dependencies in your services:
   ```bash
   npm install express amqplib fs
   ```

---

### Directory Structure:

```
/ride-sharing
  /ride-service
    - app.js
  /captain-service
    - app.js
  /user-service
    - app.js

```


 The **Captain Service** will automatically process the request, and you can monitor the log file by checking the `app.log` file for logs. It will also be outputted to the console every 5 seconds as part of the log polling.

---

### Explanation:
- **RabbitMQ**: The services communicate via RabbitMQ. The Ride service sends a message to the RabbitMQ queue, and the Captain service consumes messages from that queue.
- **Log Polling**: A simple polling mechanism that reads the `app.log` file every 5 seconds to simulate log monitoring.
- **Microservice Communication**: Each service runs on a different port and handles its own responsibilities (user, ride, captain).
  
This is a very basic simulation of a ride-sharing app with microservices. In a real-world scenario, you'd need to add error handling, more advanced features, and ensure proper scalability.
