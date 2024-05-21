const { google } = require("googleapis")

// Import default data from external file
const DEFAULT_DATA = require("../additional_info.js")
const DEFAULT_CREDITAILS = "keys.json"
const DEFAULT_SPREADSHEET_ID = "1-1ts5mbdF7ebbCqdm7jMPIEFu2ql2juvDwFDGe12hwk"
const DEFAULT_SHEET_NAME = "Sheet1"
const DEFAULT_UPDATE_TIME = 2 * 60 * 1000
let intervalId

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
const clear = (sheets) => sheets.spreadsheets.values.clear({
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    range: DEFAULT_SHEET_NAME
})

// Function to append new data to the spreadsheet
const upload = (sheets, data) => sheets.spreadsheets.values.append({
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    range: DEFAULT_SHEET_NAME,
    valueInputOption: "RAW",
    resource: {
        values: data
    }
})

// Function to upload default data to Google Sheets
async function uploadData(){
    try {
        const { sheets } = await authSheets()
        if (!Array.isArray(DEFAULT_DATA)) {
            clearInterval(intervalId)
            return
        }

        // Transform default data into the format suitable for Google Sheets
        const transformedTestData = DEFAULT_DATA.map(item => Object.values(item))
        // Clear existing data in the spreadsheet
        await clear(sheets)
        // Append default data to the spreadsheet
        await upload(sheets, transformedTestData)

        // Set interval for periodic updates
        clearInterval(intervalId)
        intervalId = setInterval(async () => {
            try {
                // Clear existing data in the spreadsheet
                await clear(sheets)
                // Append default data to the spreadsheet
                await upload(sheets, transformedTestData)
                console.log(`Updated at: ${new Date().toLocaleString('lv-LV')}`)
            } catch (err) {
                console.error('Error on upload:', err)
            }
        }, DEFAULT_UPDATE_TIME)
        
    } catch (err) {
        console.error("Error appending data to Google Sheets:", err)
    }
}

// Call the function to upload default data to Google Sheets
uploadData()
