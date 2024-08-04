# Audio Accessibility Intervention

This repository contains a React application for audio accessibility intervention and a Jupyter Notebook for preprocessing audio files. Below are the instructions for preprocessing the audio files and information about the project.

## Repository Structure

The repository includes the following components:

- **React Application**: Located in the `audio-accessibility-intervention` directory. Detailed setup and running instructions can be found in the `README.md` file within this directory.
- **Jupyter Notebook**: For preprocessing audio files, available as `preprocess_audio.ipynb` in the root directory.

## Preprocessing Audio Files

To preprocess the audio files for the React application, follow these steps:

### **Run the Jupyter Notebook**

1. Open the Jupyter Notebook for preprocessing in Google Colab:

   [Open the notebook on Google Colab](https://colab.research.google.com/github/your-username/audio-accessibility-intervention/blob/main/preprocess_audio.ipynb)

2. **Upload Audio Files**

   Upload the following audio files into the Colab environment:
   - `OurPlanet-FrozenWorlds.mp3`
   - `TheMagicShop.mp3`

3. **Process the Files**

   Run all the cells in the notebook. This will generate two zip files:
   - `OurPlanet-FrozenWorlds.zip`
   - `TheMagicShop.zip`

4. **Download Processed Files**

   After processing, download the zip files to your local system.

5. **Add Processed Files to Project**

   Unzip the downloaded files and place the contents into the `public/audiofile` directory of the React application. Although these files are already present in the repository, you can update them if needed.

6. **Additional Information**

   For detailed instructions on running the React application, please refer to the `README.md` file located in the `audio-accessibility-intervention` directory.

## Files and Directories

**audio-accessibility-intervention/:** Provides the backend and frontend code for the project.

**MScProject-AudioIntervention-PreProcessing.ipynb:** Jupyter Notebook for preprocessing audio files.

## About the Project

This project was created as part of the MSc Individual Project at King’s College London, under the project **Novel Accessibility Intervention for Audio (Podcast, Radio, etc)**. It includes both the backend and frontend code. For detailed instructions on running the React application, please refer to the `README.md` file in the `audio-accessibility-intervention` directory. For preprocessing code, please refer to the `.pynb` file included in the root directory.
