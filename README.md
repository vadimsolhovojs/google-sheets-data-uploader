# Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your/repository.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-project-directory
   ```

3. Install dependencies using NPM:

   ```bash
   npm install
   ```
<br>
<br>
<br>

# 1. Google Sheets Data Uploader (appNoServer.js)

This application uploads data from a predefined source to a Google Sheets spreadsheet at regular intervals using the Google Sheets API.

## Features

- **Automatic Data Upload**: Data is automatically uploaded to a specified Google Sheets spreadsheet at regular intervals.
- **Data Transformation**: Before uploading, the data is transformed into a format suitable for the spreadsheet.
- **Error Handling**: Error handling is implemented to manage authentication issues and errors during data upload.
- **Logging**: The application logs important events and errors to the console for monitoring purposes.
- **External Data Source**: The data to be uploaded is retrieved from an external file.

## Prerequisites

Before running the application, ensure the following:

1. **Google Sheets API Credentials**: Obtain a `keys.json` file containing the credentials for accessing the Google Sheets API.
2. **Additional Data Source**: Ensure that the `additional_info.js` file contains the data to be uploaded.
3. **Google Sheets Spreadsheet**: Have a Google Sheets spreadsheet ready with the appropriate permissions for the Google account associated with the API credentials.
4. **Node.js and NPM**: Install Node.js and NPM on your system.

## Configuration

Before running the application, ensure to configure the following settings:

- **Google Sheets Credentials**: Place your `keys.json` file in the appropriate directory.
- **Spreadsheet ID**: Update the `DEFAULT_SPREADSHEET_ID` constant in the code with the ID of your Google Sheets spreadsheet.
- **Sheet Name**: Update the `DEFAULT_SHEET_NAME` constant in the code with the name of the sheet within your spreadsheet where data will be uploaded.
- **Update Time Interval**: Adjust the `DEFAULT_UPDATE_TIME` constant in the code to set the interval (in milliseconds) at which data will be uploaded.
- **External Data Source**: Make sure to define the correct path to the external data source file in `DEFAULT_DATA` constant.

## Usage

1. Start the application by running it with Node.js:

   ```bash
   node appNoServer.js
2. The application will start uploading data to the specified Google Sheets spreadsheet at the configured intervals.

## Example Payload

```javascript
const data = [
  {
    Name: 'TestName1',
    LastName: 'TestLastName1',
    Age: '20',
    UserID: '114546767'
  },
  {
    Name: 'TestName2',
    LastName: 'TestLastName2',
    Age: '25',
    UserID: '224557678',
    Comment: 'New client'
  }
]
module.exports = data
```
<br>
<br>
<br>


# 2. Google Sheets Data Uploader with the Express framework (app.js)

This application utilizes Node.js and the Express framework to periodically upload data from a JSON payload to a Google Sheets spreadsheet using the Google Sheets API.

## Features

- **Automatic Data Upload**: The application automatically uploads data to a specified Google Sheets spreadsheet at regular intervals.
- **Data Transformation**: Before uploading, the received JSON data is transformed into a format suitable for the spreadsheet.
- **Error Handling**: Error handling is implemented to manage authentication issues, invalid data payloads, and errors during data upload.
- **Logging**: The application logs important events and errors to the console for monitoring and debugging purposes.

## Prerequisites

Before running the application, ensure the following:

1. **Google Sheets API Credentials**: Obtain a `keys.json` file containing the credentials for accessing the Google Sheets API.
2. **Google Sheets Spreadsheet**: Have a Google Sheets spreadsheet ready with the appropriate permissions for the Google account associated with the API credentials.
3. **Node.js and NPM**: Install Node.js and NPM on your system.

## Configuration

Before running the application, ensure to configure the following settings:

- **Google Sheets Credentials**: Place your `keys.json` file in the project directory.
- **Spreadsheet ID**: Update the `DEFAULT_SPREADSHEET_ID` constant in `app.js` with the ID of your Google Sheets spreadsheet.
- **Sheet Name**: Update the `DEFAULT_SHEET_NAME` constant in `app.js` with the name of the sheet within your spreadsheet where data will be uploaded.
- **Update Time Interval**: Adjust the `DEFAULT_UPDATE_TIME` constant in `app.js` to set the interval (in milliseconds) at which data will be uploaded.

## Usage

1. Start the application by running:

   ```bash
   node app.js
   ```

2. Send a POST request to the server endpoint (e.g., `http://localhost:8080/`) with a JSON payload containing the data you want to upload. Ensure the data is an array of objects, where each object represents a row of data to be uploaded to the spreadsheet.

3. **Stopping Automatic Updates**: To stop automatic updates, send a POST request to the server endpoint with no body. This will clear the interval and stop further updates until a new POST request with data is received.

## Example JSON Payload

```json
[
  {
    "Name": "TestName1",
    "LastName": "TestLastName1",
    "Age": 20,
    "UserID": "114546767",
  },
  {
    "Name": "TestName2",
    "LastName": "TestLastName2",
    "Age": 25,
    "UserID": "224557678",
    "Comment": "New client"
  }
]
```

## Notes

- Ensure that the structure of the JSON payload matches the expected format for your spreadsheet columns.
- Monitor the console output for logs regarding successful uploads and any encountered errors.

## Acknowledgments

- This application utilizes the [Express](https://expressjs.com/) framework for handling HTTP requests.
- Data manipulation and upload are performed using the [googleapis](https://www.npmjs.com/package/googleapis) package provided by Google.

Feel free to extend and customize this application according to your specific requirements!
