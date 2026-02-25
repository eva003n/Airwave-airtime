## Overview 
<!-- What it does in two lines -->
## Features
## Installation
## Usage
## Design decisions
## Future improvements




<!-- # Bulk Airtime Distribution System Requirements Document

## Introduction & Scope

This document outlines the functional and non-functional requirements for a web application designed to facilitate the bulk distribution of mobile airtime. The system's primary purpose is to enable users to efficiently and securely send airtime to a large number of recipients simultaneously. The application will serve businesses, orgaanizations and individuals requiring scalable airtime distribution.

## User Roles & Permissions

### 2.1 Administrator

1. Full access to all system features.
2. Manage user accounts and roles.
3. View all transactions and system-wide reports.
4. Monitoring and maintanance


## 2.2 Standard User (Distributor)

1. Manage personal account settings.
2. Create, view, and manage recipient lists.
3. Initiate bulk airtime distributions.
4. View personal transaction history and distribution reports.
5. Perform wallet management tasks eg recharge via various payment methods
6. View account balance and top-up history.

## 3. Functional Requirements

### 3.1 Account Management

The system shall allow new users to register for an account with email, username and password.

The system shall provide secure user authentication via email and password.

### 3.2 Recipient Management

1. The system shall allow users to manually add new recipients and their details.
2. The system shall allow users to upload recipient lists in CSV or Excel format. The system must validate the mobile numbers to ensure they are in the correct format 
3. Filter recipients based on branch and department, search by name
4. The system shall allow users to manage (view, edit, delete) existing recipient lists.

### 3.3 Airtime Distribution

1. The system shall allow a user to select or upload  a recipient list for bulk distribution.
2. The system shall allow users to select the mobile network operator (MNO) if the system supports multiple providers.
3. The system shall process bulk distribution requests asynchronously to handle high loads and prevent overloading the server thus maintaining responsiveness.
4. The system shall support scheduled distributions to be executed at a future date and time.

### 3.4 Wallet Management
1. The system shall display the user's current wallet balance
2. The system shall provide a secure method for users to top up their wallets via integrated payment gateways.
3. Enable switching between wallet modes (Basic, plus, premium) 
   Basic plan (0 - 19000ksh)
     - Both safaricom and airtel addittinal cost of 4%
   Plus plan (20,000 - 99999ksh)
     - Both safaricom and airtel additional cost of 4%
   Premium plan (100,000 - 399,999ksh)
     - Both safaricom and airtel additional cost of 5%
   Max plan (400,000+ ksh)
     - Both safaricom and airtel additional cost of 6%   
4. Recharging a wallet is based on the volume  of airtime top ups (total amount used for airtime topups)

### 3.5 Payment management
1. The system will enable wallet recharges via mpesa paybill and additional payment methods if the need arises
2. The system will provide show a transaction history of all the transactions made within the system

### 3.6 Reporting & Analytics

The system shall provide a real-time status tracker for all ongoing bulk distributions (e.g., Processing, Completed, Failed).

The system shall generate detailed transaction reports, including the status of each individual airtime transfer within a bulk distribution.

The system shall provide clear reasons for failed transactions (e.g., Invalid Number, Insufficient Balance).

The system shall offer a dashboard with key metrics, such as total airtime distributed, number of recipients, and mobile network operators supported


## 4. Non-Functional Requirements

### 4.1 Performance & Scalability

The system shall be capable of processing at least 1,000 airtime transactions per minute.

The system must handle concurrent bulk distribution requests without performance degradation. A message queue or similar asynchronous processing model is required.

The user interface shall remain responsive during long-running bulk distribution tasks.

### 4.2 Security
All communication between the client and server shall be secured using HTTPS/TLS.
Sensitive data, including passwords shall be encrypted at rest.
The system will include a multifactor authenticatiion
The system shall be resilient to common web vulnerabilities such as SQL injection, cross-site scripting (XSS), and cross-site request forgery (CSRF).
Sessions will have short lifespan

### 4.3 Availability
The system shall maintain a minimum uptime of 99.9%.

### 4.4 Usability

The user interface shall be intuitive and easy to navigate, even for users with limited technical knowledge.

The design shall be fully responsive to function seamlessly on desktop, tablet, and mobile devices.
### 4.5 Realibility
The system should handle retries on failed top ups
### 5. Technical Requirements & Assumptions

API Integration: The system will require API integrations with mobile network operators for airtime distribution and with various payment gateways for account top-ups.

Database: A relational database (e.g., PostgreSQL, MySQL) will be used to store user, recipient, and transaction data.

Asynchronous Processing: A message queue (e.g., RabbitMQ, Kafka) is assumed to be part of the technical architecture to handle bulk transactions efficiently.

Hosting Environment: The application will be deployed on a cloud-based infrastructure (e.g., AWS, GCP, Azure) to ensure scalability and reliability.

Technology Stack: The backend can be built with modern framework Node.js The frontend can use a framework like React.
 -->
