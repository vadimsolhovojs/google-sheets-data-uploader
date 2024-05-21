const express = require("express")
const { google } = require("googleapis")

// Initialize Express app
const app = express()
const HOST = "localhost"
const PORT = 8080
const DEFAULT_CREDITAILS = "keys.json"
const DEFAULT_SPREADSHEET_ID = "1-1ts5mbdF7ebbCqdm7jMPIEFu2ql2juvDwFDGe12hwk"
const DEFAULT_SHEET_NAME = "Sheet1"
const DEFAULT_UPDATE_TIME = 2 * 60 * 1000
let intervalId

// Middleware to parse JSON requests
app.use(express.json())

// Start the server and log its URL
app.listen(PORT, () => console.log(`Send POST request here - http://${HOST}:${PORT}`))

// Function to authenticate with Google Sheets API
async function authSheets() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: DEFAULT_CREDITAILS,
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        })

        const authClient = await auth.getClient()

        const sheets = google.sheets({
            version: "v4",
            auth: authClient
        })

        return {
            auth,
            authClient,
            sheets
        }
    } catch (error) {
        console.error("Error authenticating with Google Sheets:", error)
        throw error
    }
}

// Function to clear existing data in the spreadsheet
const clear = async (sheets) => await sheets.spreadsheets.values.clear({
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    range: DEFAULT_SHEET_NAME
})

// Function to append new data to the spreadsheet
const upload = async (sheets, data) => await sheets.spreadsheets.values.append({
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    range: DEFAULT_SHEET_NAME,
    valueInputOption: "RAW",
    resource: {
        values: data
    }
})

// POST endpoint to receive data and update Google Sheets
app.post("/", async (req, res) => {
    try {
        const { sheets } = await authSheets()
        const rawData = req.body
        if (!Array.isArray(rawData)) {
            clearInterval(intervalId)
            res.status(400).send("Updating is stopped because no data was received.")
            return;
        }

        // Transform raw data into the format suitable for Google Sheets
        const transformedTestData = rawData.map(item => Object.values(item))
        // Clear existing data in the spreadsheet
        await clear(sheets)
        // Append new data to the spreadsheet
        await upload(sheets, transformedTestData)
        // Send response to client indicating successful data append
        res.status(200).send("Data appended successfully to Google Sheets.")

        // Clear the previous interval and set up a new one for periodic updates
        clearInterval(intervalId)
        intervalId = setInterval(async () => {
            try {
                // Clear existing data in the spreadsheet
                await clear(sheets)
                // Append new data to the spreadsheet
                await upload(sheets, transformedTestData)
                console.log(`Updated at: ${new Date().toLocaleString('lv-LV')}`)
            } catch (err) {
                console.error('Error on upload:', err)
            }
        }, DEFAULT_UPDATE_TIME)
        
    } catch (err) {
        console.error("Error appending data to Google Sheets:", err)
        res.status(500).send("Internal Server Error")
    }
})
