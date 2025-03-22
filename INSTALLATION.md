# Installation Guide for Metchera ID Generator

This guide will help you set up your own instance of Metchera ID Generator on your personal computer or server.

## Requirements

- **Basic computer skills** - If you can install apps on your computer, you can do this!
- **A computer with internet access** - Works on Windows, Mac, or Linux
- **Node.js** - Version 18 or newer (we'll show you how to get this)

## Step 1: Install Node.js

Node.js is the platform that runs our application.

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the "LTS" (Long Term Support) version for your operating system
3. Run the installer and follow the instructions

To check if Node.js is installed correctly, open a terminal or command prompt and type:
```
node -v
```

You should see a version number like `v18.0.0` or higher.

## Step 2: Get the Code

There are two ways to get the Metchera ID Generator code:

### Option A: Download the ZIP file

1. Go to the repository page
2. Click the "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder on your computer

### Option B: Use Git (Recommended)

If you're familiar with Git:

1. Open a terminal or command prompt
2. Navigate to where you want to store the project
3. Run the following command:
   ```
   git clone https://github.com/yourusername/metchera-id-generator.git
   cd metchera-id-generator
   ```

## Step 3: Install Dependencies

1. Open a terminal or command prompt
2. Navigate to the folder where you extracted/cloned the code
3. Run one of these commands:

If you use npm:
```
npm install
```

If you use yarn:
```
yarn install
```

This may take a few minutes as it downloads all the necessary packages.

## Step 4: Set Up Firebase (Optional)

For the best experience, you should set up a Firebase project. This allows you to save identities and access them later.

### Firebase Setup

1. Visit [firebase.google.com](https://firebase.google.com/) and sign in with a Google account
2. Click "Go to console" in the top right
3. Click "Add project" and follow the setup steps
4. Once your project is created, click on the Web icon (</>) to add a web app
5. Give your app a nickname and click "Register app"
6. You'll see a configuration object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123def456",
     measurementId: "G-ABCDEF123"
   };
   ```
7. Copy these values for the next step

### Enable Firestore Database

1. In your Firebase console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for now (you can adjust security rules later)
4. Select a location close to you
5. Click "Enable"

## Step 5: Configure Environment

1. In the project folder, create a file named `.env.local`
2. Open this file in a text editor
3. Add the following lines, replacing the values with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
4. Save the file

## Step 6: Run the Application

### For Development/Testing

1. In your terminal or command prompt, make sure you're in the project folder
2. Run one of these commands:

If you use npm:
```
npm run dev
```

If you use yarn:
```
yarn dev
```

3. Open a web browser and go to [http://localhost:3000](http://localhost:3000)

### For Production

To build the application for production:

If you use npm:
```
npm run build
npm start
```

If you use yarn:
```
yarn build
yarn start
```

## Step 7: Deployment (Optional)

To deploy your app to the internet, we recommend using Vercel:

1. Create an account at [vercel.com](https://vercel.com/)
2. Install the Vercel CLI: `npm install -g vercel`
3. Run `vercel login` and follow the instructions
4. In your project directory, run `vercel`
5. Follow the prompts to deploy your application

## Troubleshooting

### The app runs but identities aren't saved

- Check that your Firebase configuration is correct
- Make sure Firestore Database is enabled in your Firebase project
- Check the browser console for any errors

### Installation fails with errors

- Make sure you have the latest version of Node.js
- Try clearing your npm cache: `npm cache clean --force`
- Try removing the `node_modules` folder and `package-lock.json` file, then run `npm install` again

## Need Help?

If you run into any issues, please open an issue on the GitHub repository with details about your problem, and we'll do our best to help!

---

Enjoy your self-hosted Metchera ID Generator! If you have any questions or feedback, we'd love to hear from you. 