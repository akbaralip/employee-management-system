Employee Management System

Project Overview
----------------

This project is a dynamic employee management system built with Django and React. It allows users to create custom form templates using a drag-and-drop form builder, then use those templates to create, manage, and search employee records.

The system is designed to be flexible, allowing for different data collection needs without requiring changes to the backend code. The backend provides a RESTful API for all data operations, while the frontend offers a responsive and user-friendly interface.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Technology Stack
----------------

Backend:
--------

Python (Django): The web framework for building the API.

Django REST Framework (DRF): For creating a powerful and well-documented REST API.

PostgreSQL: The relational database for data storage.

Frontend:
---------

React: A JavaScript library for building the user interface.

TypeScript: A typed superset of JavaScript for enhanced code quality.

Tailwind CSS: A utility-first CSS framework for rapid styling.

Axios: A library for making API requests.

Version Control:
----------------

Git & GitHub: For collaborative development and version management.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Getting Started
===============

Follow these steps to get the project up and running on your local machine.

Prerequisites
-------------

You will need the following software installed:

Python 3.8+
Node.js and npm (or yarn)
PostgreSQL (or another supported database)

Backend Setup
-------------

Clone the repository:
---------------------
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/akbaralip/employee-management-system.git)
cd employee-management-system

Create a Python virtual environment:
------------------------------------
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

Install backend dependencies:
-----------------------------
pip install -r requirements.txt

Configure the database:
-----------------------
Create a PostgreSQL database for the project.
Update the DATABASES settings in your settings.py file with your database credentials.

Run migrations:
---------------
python manage.py makemigrations
python manage.py migrate

Create a superuser to access the Django Admin:
----------------------------------------------
python manage.py createsuperuser

Run the backend server:
-----------------------
python manage.py runserver

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Frontend Setup:
===============

Navigate to the frontend directory:
-----------------------------------
cd frontend
npm install

Create a .env file for API configuration:
-----------------------------------------

Create a file named .env in the frontend root directory.

Add the following line, replacing the URL if your Django server is running on a different port:
-----------------------------------------------------------------------------------------------
REACT_APP_API_URL=http://localhost:8000/api

Run the frontend development server:
------------------------------------
npm start

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Postman Collection
------------------

A Postman collection is included to help you test the API endpoints.

Download the collection: The collection file is located at Employee-Management-Collection.postman_collection.json.

Import into Postman:
--------------------

Open Postman and click the "Import" button.

Select the downloaded JSON file.

Set up environment variables:

In the Postman environment settings, create a new environment.

Define a variable named host with the value http://localhost:8000. This will allow you to use the collection with your local server.




















