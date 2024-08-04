# Audio Accessibility Intervention

This React application is designed for audio accessibility intervention, featuring various audio files and button images. Below is a guide on how to set up and run the application, as well as an overview of the project's directory structure.

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

