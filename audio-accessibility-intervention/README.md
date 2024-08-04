# Audio Accessibility Intervention

This React application is designed for audio accessibility intervention, featuring various audio files and button images. Below is a guide on how to set up and run the application, as well as an overview of the project's directory structure.

# Audio Accessibility Intervention

This React application is designed for audio accessibility intervention, featuring various audio files and button images. Below is a guide on how to set up and run the application, as well as an overview of the project's directory structure.

## Cloning the Repository

To get a copy of this application, clone the repository from GitHub:

```bash
git clone https://github.com/VaasviAgarwal/MScIndividualProject--NovelAccessibilityInterventionForAudio-RadioPodcastEtc/tree/main/audio-accessibility-intervention
```

## Directory Structure

Here is an overview of the directory structure for this project:
```bash
audio-accessibility-intervention/
├── public/
│ ├── audiofile/
│ │ ├── OurPlanet-FrozenWorlds/
│ │ │ ├── Part1.txt
│ │ │ ├── Part2.txt
│ │ │ ├── ...
│ │ │ └── Part215.txt
│ │ ├── TheMagicShop/
│ │ │ ├── Part1.txt
│ │ │ ├── Part2.txt
│ │ │ ├── ...
│ │ │ └── Part109.txt
│ │ ├── TheMagicShop.mp3
│ │ └── OurPlanet-FrozenWorlds.mp3
│ │
│ ├── buttonimages/
│ │ ├── 10.png
│ │ ├── 100.png
│ │ ├── 25.png
│ │ ├── 5.png
│ │ ├── 50.png
│ │ └── 75.png
│ ├── index.html
│ ├── manifest.json
│ ├── ourPlanetImage.png
│ ├── robots.txt
│ └── theMagicShopImage.png
│
├── src/
│ ├── App.css
│ ├── App.js
│ ├── App.test.js
│ ├── index.css
│ ├── index.js
│ ├── reportWebVitals.js
│ └── setupTests.js
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Getting Started

### **Navigate to the Project Directory**

Change to the project directory:

```bash
cd audio-accessibility-intervention
```
### **Install Dependencies**

Install the required dependencies using npm:

```bash
npm install
```

Alternatively, if you use Yarn, run:

```bash
yarn install
```

### **Install Additional Packages**

Install the OpenAI package using npm:

```bash
npm install openai
```
Alternatively, if you use Yarn, run:

```bash
yarn add openai
```
Install Font Awesome using npm:

```bash
npm install @fortawesome/fontawesome-free
```
Alternatively, if you use Yarn, run:

```bash
yarn add @fortawesome/fontawesome-free
```

### **Configure OpenAI API Key**
To use the OpenAI API, you need to add your own API key. Replace the placeholder API key in the code with your actual API key.

Locate the OpenAI configuration in your project files App.js and update the code as follows:

```javascript
const openai = new OpenAI({
  apiKey: "YOUR_API_KEY_HERE",
  dangerouslyAllowBrowser: true
});
```
Make sure to replace "YOUR_API_KEY_HERE" with your actual OpenAI API key.

### **Run the Application**

Start the development server with:

```bash
npm start
```

Or, if you use Yarn:

```bash
yarn start
```

This will open the application in your default web browser at http://localhost:3000.

### **Build for Production**
To create a production build of the application, use:

```bash
npm run build
```

Or with Yarn:

```bash
yarn build
```
The production build will be available in the build directory.

## Files and Directories

**public/:** Contains static assets such as audio files, button images, and the index.html file.

**src/:** Contains React components, CSS files, and other source code for the application.

**package.json:** Lists the project's dependencies and scripts.

**package-lock.json:** Locks the versions of the project's dependencies.

## About Project
This project was created as part of the MSc Individual Project at King’s College London, under the project Novel Accessibility Intervention for Audio (Podcast, Radio, etc). It includes both the backend and frontend code. For preprocessing code, please refer to the .pynb file included in the project.

