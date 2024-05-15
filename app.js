const express = require("express");
const { google } = require("googleapis");

const app = express();
const HOST = "localhost";
const PORT = 8080;
const DEFAULT_CREDITAILS = "keys.json";
const DEFAULT_SPREADSHEET_ID = "1-1ts5mbdF7ebbCqdm7jMPIEFu2ql2juvDwFDGe12hwk";
const DEFAULT_SHEET_NAME = "Sheet1";
const DEFAULT_UPDATE_TIME = 2 * 60 * 1000;
let intervalId;

app.use(express.json());
app.listen(PORT, () => console.log(`Send POST request here - http://${HOST}:${PORT}`));

async function authSheets() {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: DEFAULT_CREDITAILS,
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        });

        const authClient = await auth.getClient();

        const sheets = google.sheets({
            version: "v4",
            auth: authClient
        });

        return {
            auth,
            authClient,
            sheets
        };
    } catch (error) {
        console.error("Error authenticating with Google Sheets:", error);
        throw error;
    }
};

app.post("/", async (req, res) => {
    try {
        const { sheets } = await authSheets()
        const rawData = req.body;
        if (!Array.isArray(rawData)) {
            clearInterval(intervalId);
            res.status(400).send("Updating is stopped because no data was received.");
            return;
        }

        const transformedTestData = rawData.map(item => [
            item.Name, 
            item.LastName, 
            item.Age, 
            item.UserID, 
            item.Comment || ''
        ]);

        const clear = async () => await sheets.spreadsheets.values.clear({
            spreadsheetId: DEFAULT_SPREADSHEET_ID,
            range: DEFAULT_SHEET_NAME
        });

        const upload = async () => await sheets.spreadsheets.values.append({
            spreadsheetId: DEFAULT_SPREADSHEET_ID,
            range: DEFAULT_SHEET_NAME,
            valueInputOption: "RAW",
            resource: {
                values: transformedTestData
            }
        });

        res.status(200).send("Data appended successfully to Google Sheets.");

        clearInterval(intervalId);
        intervalId = setInterval(async () => {
            try {
                await clear()
                await upload()
                console.log(`Updated at: ${new Date()}`)
            } catch (err) {
                console.error('Error on upload:', err)
            }
        }, DEFAULT_UPDATE_TIME);
        
    } catch (err) {
        console.error("Error appending data to Google Sheets:", err);
        res.status(500).send("Internal Server Error");
    }
});
