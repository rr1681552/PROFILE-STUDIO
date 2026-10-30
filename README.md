# Profile Studio – Enhanced Frontend

## Features
- Live profile-card preview while typing
- Girl avatar / Boy avatar / own photo URL selection
- Save, edit and delete profiles
- Profiles persist in browser localStorage
- Download the profile card as a PDF
- Responsive layout for desktop and mobile

## Run
1. Extract this ZIP.
2. Open the `ProfileStudio_Enhanced` folder in VS Code.
3. Install the **Live Server** extension if needed.
4. Right-click `index.html` and choose **Open with Live Server**.

PDF export uses html2canvas and jsPDF CDN libraries, so an internet connection is needed for PDF generation and Google Fonts/avatar images.
Saved profiles are stored in the browser used to run the app. `profiles.json` is a sample data file and is not required for localStorage functionality.
