const { google } = require("googleapis");

const DEFAULT_DATA = require("../additional_info.js");
const DEFAULT_CREDITAILS = "keys.json";
const DEFAULT_SPREADSHEET_ID = "1-1ts5mbdF7ebbCqdm7jMPIEFu2ql2juvDwFDGe12hwk";
const DEFAULT_SHEET_NAME = "Sheet1";
const DEFAULT_UPDATE_TIME = 2 * 60 * 1000;
let intervalId;

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

async function uploadData(){
    try {
        const { sheets } = await authSheets()
        if (!Array.isArray(DEFAULT_DATA)) {
            clearInterval(intervalId);
            return;
        }

        const transformedTestData = DEFAULT_DATA.map(item => [
            item.Name, 
            item.LastName, 
            item.Age, 
            item.UserID, 
            item.Comment || ''
        ]);

        const clear = () => sheets.spreadsheets.values.clear({
            spreadsheetId: DEFAULT_SPREADSHEET_ID,
            range: DEFAULT_SHEET_NAME
        });

        const upload = () => sheets.spreadsheets.values.append({
            spreadsheetId: DEFAULT_SPREADSHEET_ID,
            range: DEFAULT_SHEET_NAME,
            valueInputOption: "RAW",
            resource: {
                values: transformedTestData
            }
        });

        clearInterval(intervalId);
        intervalId = setInterval(async () => {
            try {
                await clear()
                await upload()
                console.log(`Updated at: ${new Date().toLocaleString('lv-LV')}`)
            } catch (err) {
                console.error('Error on upload:', err)
            }
        }, DEFAULT_UPDATE_TIME);
        
    } catch (err) {
        console.error("Error appending data to Google Sheets:", err);
    }
};

uploadData();