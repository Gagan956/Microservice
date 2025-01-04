# inDrive
 
  inDrive User, Ride, and Captain with RabbitMQ and Log Polling
Overview
This project demonstrates a simple microservices architecture with three services running locally on localhost:3000:

User Service: Allows a user to request a ride.
Ride Service: Processes ride requests and communicates with the Captain Service.
Captain Service: Accepts or rejects ride requests.
These services communicate using RabbitMQ as the message broker for asynchronous communication. Additionally, each service logs its actions, and there is a log polling mechanism to print the logs in real-time.

In this architecture, we have three independent microservices —

User Service, Ride Service, and Captain Service — that communicate asynchronously through RabbitMQ, and each service performs log polling to monitor and log its activities. The services are designed to simulate a ride-sharing application where users request rides, the ride is processed, and captains (drivers) are assigned to the rides.

User Service: Allows users to request a ride.

Ride Service: Handles the ride requests from users, processes them, and forwards them to the captain.

Captain Service: Accepts or rejects the ride requests from the Ride Service.

All services will use RabbitMQ for message-driven communication, and each service logs its actions in a log file. A log polling mechanism checks the log file periodically to print the logs in real-time.

All services will be running locally on localhost:3000 for the sake of simplicity.

Flow of Communication

/ride-sharing
  /user
    - app.js           # User service (port 3001)
  /ride
    - app.js           # Ride service (port 3002)
  /captain
    - app.js           # Captain service (port 3003)


Technologies Used

Node.js: Server runtime for building the microservices.
Express.js: Web framework to create REST APIs in each service.
RabbitMQ: Message broker for communication between microservices.
AMQP (amqplib): Library to interact with RabbitMQ.

User Service:

Purpose: Represents the user of the ride-sharing application who wants to request a ride.

Operation:
When a user initiates a ride request (via an HTTP API call), the User Service sends the request as a message to a RabbitMQ queue (the "ride_queue").
It logs the request to a shared log file for monitoring purposes.
Ride Service:

Purpose: Processes ride requests, handles logic for assigning rides, and communicates with the Captain Service.
Operation:

The Ride Service listens for incoming messages on the "ride_queue" from the User Service.
Upon receiving a ride request, it processes the request (e.g., updates the status) and forwards it to the "captain_queue" for the Captain Service to handle.
It logs the action of forwarding the ride request to the Captain in a shared log file.
Captain Service:

Purpose: Simulates a driver (captain) who accepts or rejects the ride request.
Operation:
The Captain Service listens for ride requests from the "captain_queue", which it receives from the Ride Service.
Once a ride request is received, the Captain Service updates the status of the request (e.g., accepting the ride) and logs the action.
RabbitMQ Communication

RabbitMQ is used to decouple the services and allow asynchronous communication. Each service will communicate with others via queues:
User to Ride: The User Service sends ride requests to the ride_queue in RabbitMQ.

Ride to Captain: The Ride Service processes the requests and forwards them to the captain_queue.

Captain updates: The Captain Service processes requests from the captain_queue, updating the ride status (e.g., "Accepted").
Each message contains essential information about the ride, such as the user ID, destination, and ride status, which is updated at each service.

Log Polling Mechanism
Log Polling refers to periodically reading the application’s log file to monitor the activities and status of the system. The logs are written in a shared log file, typically by each service, after performing actions such as receiving a request, forwarding a request, or accepting a ride.

Every 30 seconds, a log polling process reads the current content of the app.log file, which logs events like ride requests, status changes, and ride acceptances.
The log polling service outputs the logs to the console for real-time monitoring.
This log polling allows administrators or developers to track the flow of messages and diagnose any issues in the communication between the services.

Key Technologies Used

Node.js: Each microservice is built using Node.js and Express to expose RESTful endpoints.

RabbitMQ: Acts as the message broker between services, enabling asynchronous communication via queues.

Logging: Each service logs important events, such as requests, status changes, and actions, to a shared log file.

Log Polling: A mechanism that periodically checks the log file for updates and prints the logs to the console.
