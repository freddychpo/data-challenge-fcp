# DataChallengeFCP

This is a data challenge project that includes an API to manage historical employee, department and job data.

## Deployment

The application is deployed on Heroku and can be accessed at  
https://data-challenge-fcp-cf446e24c582.herokuapp.com/.

## Local Development

If you want to run the application locally, follow these steps:

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
4. Create a `.env` file at the root of the project and add your environment variables:
   ```bash
   CLEARDB_DATABASE_URL=mysql://<username>:<password>@<host>/<database>?reconnect=true
   ```
5. Build and run the application with Docker:
   ```bash
   docker build -t data-challenge-fcp .
   docker run -p 3000:3000 --env-file .env data-challenge-fcp
   ```

## Testing

1. Install the dependencies (if you haven't already):
   ```bash
   npm install
   ```
2. Run the tests:
   ```bash
   npm test
   ```
