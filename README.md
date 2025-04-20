# CSV to JSON Converter

A simple backend application that allows users to upload a CSV file and convert them to JSON format.
Current scope includes basic conversion functionality.

## Functionality & Scope

- Upload and convert CSV files to JSON format via an exposed API endpoint
- View converted & parsed JSON data in the response

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL (currently deployed on Render)
- **Authentication**: API-key based auth

## Authentication Requirements

- Requires an API key for authentication (curently held private to the developer)
- API key must be included in the request headers for all endpoints
- Example header:
  ```
  'x-api-key': 'your_api_key_here'
  ```

## API Usage

The application exposes an API endpoint for programmatic CSV to JSON conversion:

### CSV Processing Endpoint

**Endpoint:** `/csv/process`

**Method:** POST

**Authentication:** API Key (required in request headers)

**Request:**
- Format: `multipart/form-data`
- Required fields:
  - `csvFile`: The CSV file to be processed (file attachment)

**Headers:**
- `x-api-key`: Your API key

**Example using cURL:**
```bash
curl -X POST \
  -H "x-api-key: YOUR_API_KEY" \
  -F "csvFile=@/path/to/your/file.csv" \
  http://your-domain.com/csv/process
```

**Example using JavaScript fetch:**
```javascript
const formData = new FormData();
formData.append('csvFile', fileObject);

fetch('http://your-domain.com/csv/process', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  },
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Response:**
A JSON object containing the converted data.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL instance
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Set up environment variables
cp .env
# Edit .env with your configuration
PG_HOST=your_postgres_host
PG_PORT=your_postgres_port
PG_USER=your_postgres_user
PG_PASSWORD=your_postgres_password
PG_DATABASE=your_postgres_database
API_KEY=your_api_key_here

# Start development server
npm run dev
```

## License

[MIT](LICENSE)
