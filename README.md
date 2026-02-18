## EventFlex

EventFlex is a web-based event management application developed as part of my training at ISTA Hay Al Adarissa – Fès. The platform helps organizers efficiently plan, manage, and monitor events through a simple and intuitive interface.

The application provides features such as event creation, participant management, session organization, and communication between stakeholders. EventFlex was built using modern web technologies including React for the frontend and Laravel for the backend.

### Features

Event creation and management

Participant registration and tracking

Session planning and organization

RESTful API integration

User-friendly interface

### Installation
#### Clone the repository
git clone https/github.com/noura8887777/Event-Flex-project
cd eventflex

#### Backend (Laravel)
cd gestion_courriers
composer install
cp .env.example .env
php artisan key:generate


#### Configure your database inside the .env file, then run:

php artisan migrate
php artisan serve

#### Frontend (React)
cd frontend
npm install
npm start

### Learning Outcomes

This project allowed me to apply and strengthen my knowledge in:

Full-stack web development

Laravel framework

React.js

Database design with MySQL

API development and integration

### Contributing

Thank you for considering contributing to EventFlex!
If you would like to improve the project, feel free to fork the repository and submit a pull request.

### Security

If you discover any security vulnerability within this project, please open an issue in the repository.

### License

This project is open-sourced software licensed under the MIT license.
