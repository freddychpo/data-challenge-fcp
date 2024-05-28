# DataChallengeFCP

## Description
This is a data challenge project that includes an API to handle historical data of employees, departments, and jobs.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/freddychpo/data-challenge-fcp.git
   ```
2. Navigate to the project directory:
   ```bash
   cd data-challenge-fcp
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create the database and tables by running the data_challenge_db.sql file:
   ```bash
   mysql -u root -p < data_challenge_db.sql
   ```
   This command will prompt you for your MySQL root user's password and then execute the SQL instructions to create the necessary database and tables.

## Use

### Development

To start the server in development mode with nodemon:
   ```bash
   npm run dev
   ```

### Production

To start the server in production mode:
   ```bash
   npm start
   ```

## Configuration

Create a .env file at the root of the project with the following variables:
   ```plaintext
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=data_challenge_db
   ```

## Endpoints

- `POST /upload-csv` - Upload and process CSV files.
- `GET /api/employees-hired-quarters` - Get the number of employees hired per quarter in 2021.
- `GET /api/departments-above-mean` - Get departments that hired more employees than the average in 2021.

## Autor
Freddy Ch P
