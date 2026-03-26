<!-- 
## Idea 
Building an airtime distribution software for cooporate and small businesses to manage and automate  monthly airtime allowance to employees
 -->
<!-- Understand the problem -->
## Problem
Businesses lack a reliable, secure and auditable way to distribute monthly airtime allowances to employees

## Goal
Enable businesses to manage and automate monthly airtime distribution to employees

<!-- Deifne the scope -->
## Contraints
1. Monthlu distribution only
2. Employees do not log into the system
3. One allowance per employee per month
4. Supports two airtime providers(Safaricom and airtel)
5. Backend first, minimal UI

<!-- Define your Primary User & Core Use Cases -->
## Target users
- Corporate campanies
- Small businesses 
## Use cases
1. Distributor creates or logs into their accout 
2. Distributor can add, update and delete employees/recipients eg sets monthly allowance 
3. Distributor triggers the airtime distribution or schedules the distribution
4. Distributor views reports(transaction history)
## Non goals
1. Not an airtime reseller platform

## Tech stack
This project ises the PERN stack which involves the following technologies
- Postgres(Database)
- Express(For routing and middkeware)
- React(Building User interface)
- Node(Server side runti,e)

<!-- Functional requirements -->
## Functional requirements
1. Enable bulk airtime distribution
2. Enable recipient management
3. Enable scheduled monthly airtime distribution
4. Perform audit trails and provide detailed reports  
5. Handle payment processing
## Non Functional requirements
1. Reliability - the system must be able to handle the functions stated above without failure expecially when performing bulk airtime distribution
2. Security - the system should protect private data through robust authentication eg oauth 2.0 and use https for data transmission
3.  Scalability - the system should handle 1000+ airtime distributions per minute
4. Avalabilty - the system should be highly available to pro

<!-- Scope the MVP -->
## MVP features
1. Recipent management
2. Bulk distribution
3. Scheduled distribution
4. Audit log
5. Reporting(Transaction history)
7. Handle payments 
<!-- Research and analyze existing systems -->
## Research and analysis on existing systems
The project fouces in the Kenyan market and the existing systems are focused on airtime resell and are more flexible such that anyone can use them
Where they fail bassed on my view
1. Users have to upload a CSV containing airtime recipients each and everytime when distributing airtime, which can be redundant
2. They have basic audit trail for airtime disbursement thats general and not fir for cooporate environment which involves employees who receive different fixed monthly airtime allowances based on designation in different departments
 

<!-- Create a high level design -->
## High level design
### Architecture
The system adopts a monolithic pattern, packaging all the core layers(Presentation, Business logic and persistence) into a single binary deployable for rapid development,simplicity and easier debugging but risks redeployment overhead
### Major components
The system comprises of internal system and external system
The internal system icludes
- Backend for server side logic
- Frontend for the user interface
- Database to persists the data

The external system comprises of upstream services integrated into the main system, they include
- Payment API gateway
- Arrtime API gateway

### Data flow

![Diagram showing major components of the system](/assets/images/major-components.png)



<!-- Refine the design -->

<!-- Continuosly monitor and improve the system -->