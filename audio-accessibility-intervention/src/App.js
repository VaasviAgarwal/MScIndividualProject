import React, { useRef, useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import OpenAI from 'openai';
import './App.css';

function App() {

  //Initial Values of constants used throughout the program to handle different states
  const [isAudioChosen, setIsAudioChosen] = useState(false);
  const [audioFile, setAudioFilePath] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [transcriptFolder, setTranscriptFolder] = useState(null);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playedPer, setPlayedPer] = useState(0);
  const [currentSegment, setCurrentSegment] = useState('');
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [isSummaryClicked, setIsSummaryClicked] = useState(false);
  const [summaryLength, setSummaryLength] = useState(0);
  const [isGenerateSummaryClicked, setIsGenerateSummaryClicked] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isSummaryPlaying, setIsSummaryPlaying] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [combinedText, setCombinedText] = useState('');
  const [isSliderClicked, setIsSliderClicked] = useState(false);
  const [isEmojiClicked, setIsEmojiClicked] = useState(true);
  const [emojis, setEmojis] = useState([]);
  const [difficultWords, setDifficultWords] = useState([]);
  const [GenerateVisuals, setGenerateVisuals] = useState(false);

  const openai = new OpenAI({
    apiKey: "PLACE_HOLDER",
    dangerouslyAllowBrowser: true
  })

  
  //Function that updates the values of audioFile and transcriptFolder based on the audio chosen by the user
  const handleAudioButtonClicked = (audioPath, folderPath, audioName) => {
    //audioFile : Contains the path to the audio based on the user's choice
    setAudioFilePath(audioPath);
    //transcriptFolder : Contains the path to the folder that has the transcripts for that audio's segments
    setTranscriptFolder(folderPath);
    //audioName : Name of the audio file playing
    setAudioName(audioName);
    //isAudioChosen is now true so that the player is visible
    setIsAudioChosen(true);
  }

  //Function that helps the user go back to the page where they selected the audio using the back button
  const handleBackClicked = () => {
    setIsAudioChosen(false);
  }

  //Function that is called when the user wants to see emojis for the visual representation
  const handleEmojiClicked = () => {
    setIsEmojiClicked(true);
    //GenerateVisuals is set to true to call the generateVisuals function through useEffect to generate the needed Visual Representations
    setGenerateVisuals(true);
  }

  //Function that is called when the user wants to see emojis for the visual representation
  const handleImageClicked = () => {
    setIsEmojiClicked(false);
    //GenerateVisuals is set to true to call the generateVisuals function through useEffect to generate the needed Visual Representations
    setGenerateVisuals(true);
  }

  //Function called when the user changes the length of summary they want through the slider
  const handleSliderChange = (event) => {
    //Math.min is used to make sure the chosen summmary length does not exceed the amount of audio played
    const value = Math.min(playedPer, event.target.value);
    setSummaryLength(value);
  };

  //Function called with the user wants to see summary of the audio
  const handleSummaryButtonClick = () => {
    //Updates the required states so the user can see the options to choose the length of summary
    setIsSummaryClicked(true);
    //Pauses the audio being played to provide the user time to choose the summary and prevent cognitive overload
    if(audioRef.current) {
      audioRef.current.pause();
    }
  };

  //Function called when the user either wants to listen to the summary being displayed or to pause it
  const handlePlaySummaryAudio = () => {
    if (!isSummaryPlaying && displayText) {
      //If audio is paused and the user clicks the play button to listen to it, the summary displayed on screen is read out
      const utterance = new SpeechSynthesisUtterance(displayText);
      window.speechSynthesis.speak(utterance);
      setIsSummaryPlaying(true);
    } else {
      //If the audio is already playing and the user clicks the mute button, the reading of the summary stops
      stopAudio();
    }
  };

  //Function called when the user is satisfied with the current summary and feels they understood it
  const handleDoneClick = () => {
    //Updates the required states to bring them to their initial values for the player
    setIsGenerateSummaryClicked(false);
    setIsSummaryClicked(false);
    //Stops the audio reading the summary if it was being played
    stopAudio();
    //Starts the audio player from the place that the user paused it when looking for a summary
    if(audioRef.current) {
      audioRef.current.play();
    }
  };

  //Function called when the user is unsatisfied with the current summary and wants another version of the summary to comprehend the audio's content better
  const handleRegenerateClick = () => {
    //Updates the required states such that they display the right screens for when the summary needs to be played
    setIsGenerateSummaryClicked(true);
    setIsSummaryClicked(true);
    //Calls the generate summary function with the transcript based on the length the user chose for the summary and the current audio position
    generateSummary(combinedText);
  };

  //Function to stop the audio that is reading the summary text
  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsSummaryPlaying(false);
  };

  //Function that updates the combinedText to contain the transcript that needs to be summarised
  const generate = async (percentage) => {
    //Summary Length set to the value passed to the function for future use if needed
    setSummaryLength(percentage)
    let length = 0;
    if(!isSliderClicked) {
      //If buttons were used then the length of summary needed is that percentage of audio played till now
      length = (percentage * currentTime) / 100;
    } else {
      //If sliders were used then the percentage of summary the user wants is current percetage of audio played minus the value chosen 
      const l = playedPer-percentage;
      //Then the length of hte summary is the percentage (that the use chose based on visuals) of audio played till now
      length = (l * currentTime) / 100;
    }

    //State changed to display the summary that will be generated based on the values chosen by the user
    setIsGenerateSummaryClicked(true);

    console.log("Summary Length Chosen: ", length);
    console.log("Current Time of Audio: ", currentTime)

    //Finding the index numbers of the segments that needed to be added to get the text that needs to be summarised
    const summaryParts = calculateSummaryParts(currentTime, length);

    let combinedText = '';

    //Combining the text from transcripts for each segment of the audio that is part of the list of transcripts needed to generate summary of desired length of audio
    await Promise.all(
      summaryParts.map(async (part) => {
        try {
          const response = await fetch(`${transcriptFolder}${part}.txt`);
          if (!response.ok) {
            throw new Error(`Failed to fetch text for part ${part}`);
          }
          const text = await response.text();
          combinedText += text + '\n';
        } catch (error) {
          console.error(error);
        }
      })
    );

    //Setting the transcript values to get new summary if needed when the user wants to regenerate the summary
    setCombinedText(combinedText);
    console.log('Text to be summarized:\n', combinedText);

    //Calling the function to generate the summary of the Text
    await generateSummary(combinedText);
  };

  //Function to generate the summary of the required text using OpenAI API calls
  const generateSummary = async (combinedText) => {

    //Getting the summary using API
    try {

      //Sending the API Request
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Summarize the given text to make understandable for someone with aphasia. Maximum number of sentences should be 3 and maximum words in each sentence should be 8."
          },
          {
            role: "user",
            content: combinedText,
          },
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });

      if (response.choices && response.choices.length > 0) {
        //If we received the summary then we save it to the text to be Displayed
        const summary = response.choices[0].message.content;
        setDisplayText(summary);
        console.log("Summarized Text:\n", summary);
      } else {
        //If we do not received it in the correct outuput provided by the documentation then we trhwo an error
        throw new Error("Unexpected response format from OpenAI API");
      }

    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  //Function to generate the visuals that represent the current 15 seconds of the audio being played
  const generateVisuals = async (currentSegmentIndex) => {

    //Setting the Generate Visual state to false as the function has been called and the visuals will be displayed anyway
    setGenerateVisuals(false);

    try {

      //Fincting the transcript of the segment playing currently that needs to be visualized
      let resp = await fetch(`${transcriptFolder}Part${currentSegmentIndex}.txt`);
      let text = await resp.text();
      console.log('Segment Playing Currently: ',currentSegmentIndex);
      console.log('Transcript of Segment Playing Currently:\n',text);

      //Sending API request to fetch the words that may be difficult to understand by people with aphasia in the current segment.
      //The required words should be ones that could be represented as images and should be return in the format "word1, word2, word3, word4"
      const wordsResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Give 4 difficult words from the text that might help patients with aphasia understand the transcript and that can be represented as images. (Only return words separated with commas without numbering and not in new lines.)"
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });

      //Finding the difficult words passed by the API call and processing them to be added to a list of difficult words
      if (wordsResponse.choices && Array.isArray(wordsResponse.choices) && wordsResponse.choices.length > 0) {
        const difficultWordsString = wordsResponse.choices[0].message.content.trim();
        //The words are capitablized so that they can be shown on the screen
        const difficultWords = difficultWordsString.split(',').map(word => {
          return word.trim().charAt(0).toUpperCase() + word.trim().slice(1).toLowerCase();
        });
        
        setDifficultWords(difficultWords);
        console.log('Difficult Words: ', difficultWords);
  
        if (isEmojiClicked) {
          //Sending API calls to represent to get emojis to represent the difficult words
          const emojiResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Give emojis to represent the following words. (Give the result with in the format 'word: emojis' where each word is in a new line. Also if there are no words then send an empty string) : " + difficultWords.join(", ")
              }
            ],
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1,
          });
          //Processing the API response to get the emojis representing each of the words
          if (emojiResponse.choices && Array.isArray(emojiResponse.choices) && emojiResponse.choices.length > 0) {
            const emojiString = emojiResponse.choices[0].message.content.trim();
            const emojiGroups = emojiString.split('\n').map(line => {
              const [word, emojis] = line.split(': ');
              return emojis;
            });
            console.log("Emojis:", emojiGroups);
            setEmojis(emojiGroups);
          } else {
            throw new Error("Unexpected response from OpenAI API");
          }
        } else {
          ///Sending API calls to represent to get images to represent the difficult words
          //Finding the words that can be represented and are not under moderation from OpenAI
          const moderationPromises = difficultWords.map(async (word) => {
            const moderationResponse = await openai.moderations.create({
              input: word,
            });
            const isSafe = !moderationResponse.results[0].flagged;
            return { word, isSafe };
          });
          const moderationResults = await Promise.all(moderationPromises);
          const imagePromises = moderationResults
            .filter(result => result.isSafe)
            .map(async (result) => {
              try {
                const imageResponse = await openai.images.generate({
                  model: "dall-e-3",
                  prompt: `A clear and very simple representation of the word "${result.word}".`,
                  n: 1,
                  size: "1024x1024",
                });
                return imageResponse.data[0].url;
              } catch (imageError) {
                console.error(`Error generating image for "${result.word}":`, imageError);
                return null;
              }
            });
          //Sending multiple requests at the same time to get responses more quickly
          const imageUrls = await Promise.all(imagePromises);

          //Saving the URLs for the images representing each of the words
          const filteredImageUrls = imageUrls.filter(url => url !== null);
          setImageUrls(filteredImageUrls);
          console.log('URLs of the images:\n',filteredImageUrls)
        }
      } else {
        throw new Error("Unexpected response from OpenAI API");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  //Function to calcluate the segments of the audio that will need to be summarized based on the users choice of lenght and current audio
  const calculateSummaryParts = (currentTime, length) => {
    //Current segment to always be included
    const endSegmentIndex = Math.floor(currentTime / 15) + 1;
    //Start segment should either be 1 or the values based on the calculation
    const startSegmentIndex = Math.max(1, endSegmentIndex - Math.ceil(length / 15) + 1);
    //List that contians the names of files that need to be combined to get the text that needs to be summarized
    const summaryParts = [];
    for (let i = startSegmentIndex; i <= endSegmentIndex; i++) {
      summaryParts.push(`Part${i}`);
    }
    console.log("Parts to be summarised : ", summaryParts);
    return summaryParts;
  };

  useEffect(() => {
    const audio = audioRef.current;
    //If a button between generate images and emojis is clicked then the genearteVisuals function is called to get the visual representation of the text
    if(GenerateVisuals)
    {
      generateVisuals(currentSegmentIndex);
    }
    //Updates the visual of the slider to choose summary length based on the audioplayed till now
    const slider = document.querySelector('.summary-slider');
    if (slider) {
      slider.style.background = `linear-gradient(to right, 
          #2196f3 0%, 
          #2196f3 ${summaryLength}%, 
          #0d47a1 ${summaryLength}%, 
          #0d47a1 ${playedPer}%, 
          #bbdefb ${playedPer}%, 
          #bbdefb 100%)`;
    }
    //Finding the current segment being played
    const updateTime = () => {
      const currentTime = audio.currentTime;
      setCurrentTime(currentTime);
      const currentSegmentIndex = Math.floor(currentTime / 15) + 1;
      const currentSegmentName = `Part${currentSegmentIndex}`;
      if (currentSegment !== currentSegmentName) {
        //If the current segment changes, then new visual representations ar called for
        setCurrentSegment(currentSegmentName);
        setCurrentSegmentIndex(currentSegmentIndex);
        generateVisuals(currentSegmentIndex);
      }
      const duration = audio.duration;
      if (duration) {
        const playedPer = (currentTime / duration) * 100;
        setPlayedPer(playedPer);
      }
    };
    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
      };
    }
  }, [playedPer, audioRef, summaryLength, currentSegment, isEmojiClicked, generateVisuals]); 


  return (
    <div className="App">
      <header className="App-header">

        {!isAudioChosen && (
           <div className='audio-buttons'>
            <button
              className='ourPlanetButton'
              onClick={()=>handleAudioButtonClicked('./audiofile/OurPlanet-FrozenWorlds.mp3','/audiofile/OurPlanet-FrozenWorlds/', 'Our Planet - Frozen Worlds by David Attenboroughh')}
            >
                <img src='/ourPlanetImage.png'></img>
                <h2 className='ourPlanetHeading'>Our Planet - Frozen Worlds</h2>
                <h4>by David Attenboroughh</h4>
            </button>
            <button
              className='magicShopButton'
              onClick={()=>handleAudioButtonClicked('./audiofile/TheMagicShop.mp3', '/audiofile/TheMagicShop/', 'The Magic Shop by H. G. Wells (Audiobook)')}
            >
                <img src='/theMagicShopImage.png'></img>
                <h2 className='magicShopHeading'>The Magic Shop - Audiobook</h2>
                <h4>by H. G. Wells</h4>
            </button>
          </div>
          )
        }

        {isAudioChosen && (
          <div className='audio-player'>

              <div className='audio-header'>
                <button 
                  className='back-button'
                  onClick={()=>handleBackClicked()}
                >
                    <i className='fas fa-arrow-left'></i>
                </button>
                <div className='audio-name'>
                  <p>{audioName}</p>
                </div>
              </div>

              <div className='image-container'>
                <div className='image-choice-buttons'>
                    <button
                      className={`select-emoji ${isEmojiClicked ? 'active' : ''}`}
                      onClick={() => {
                        handleEmojiClicked();
                      }}
                    >
                      <i className='fas fa-smile'></i>
                      Emojis
                    </button>
                    <button
                      className={`select-image ${!isEmojiClicked ? 'active' : ''}`}
                      onClick={() => {
                        handleImageClicked();
                      }}
                    >
                    <i className='fas fa-image'></i>
                      Images
                    </button>
                </div>
                {isEmojiClicked && (
                  <div className='emoji-display'>
                    {emojis.map((emoji, index) => (
                      <div className='emoji-card' key={index}>
                        <p className='emoji'>{emoji}</p>
                        <p className='word'>{difficultWords[index]}</p>
                      </div>
                    ))}
                  </div>
                )}
                {!isEmojiClicked && (
                  <div className='image-display'>
                    {imageUrls.map((url, index) => (
                      <div className='image-card' key={index}>
                        <img src={url} alt={`Generated representation of word ${index + 1}`} />
                        <p className='word'>{difficultWords[index]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <audio ref={audioRef} controls controlsList="nodownload" style={{ width: '78%' }}>
                <source src={audioFile} type="audio/mpeg" />
                  Your browser does not support the audio element
              </audio>

              {!isSummaryClicked && (
                <button className="summary-button" onClick={handleSummaryButtonClick}>
                  <i className="fas fa-file-alt"></i>
                  Summary
                </button>
              )}

            {isSummaryClicked && (
              <div className='summary-selection-container'>

                <div className='summary-heading'>
                  <i className="fas fa-file-alt"></i>
                  {isGenerateSummaryClicked ? (
                    <h2>Summary</h2>
                  ) : (
                    <h2>Summary Selection</h2>
                  )}
                </div>
                  
                {!isGenerateSummaryClicked && (
                  <div className='summary-type-selection-card'>
                    <div className='summary-type-buttons'>
                      <button
                        className={`select-summmary-slider-type ${isSliderClicked ? 'active' : ''}`}
                        onClick={() => setIsSliderClicked(true)}
                      >
                        <i className='fas fa-sliders-h'></i>
                        Slider
                      </button>
                      <button
                        className={`select-summmary-button-type ${!isSliderClicked ? 'active' : ''}`}
                        onClick={() => setIsSliderClicked(false)}
                      >
                        <i className='fas fa-hand-pointer'></i>
                        Buttons
                      </button>
                    </div>

                  {isSliderClicked && (
                    <div className='slider-wrapper'>
                      <input
                        className='summary-slider'
                        type='range'
                        min='0'
                        max='100'
                        value={summaryLength}
                        onChange={handleSliderChange}
                      />
                      <button className="generate-summary-button" onClick={() => generate(summaryLength)}>
                        <i className='fas fa-file-alt'></i>
                        Generate Summary
                      </button>
                    </div>
                  )}

                  {!isSliderClicked && (
                    <div className="summary-selection-buttons">
                      {[100, 75, 50, 25, 10, 5].map((percentage) => (
                        <button
                          key={percentage}
                          onClick={() => generate(percentage)}
                          className="image-button"
                        >
                          <img
                            src={`/buttonimages/${percentage}.png`}
                            alt={`${percentage}`}
                            className="percentage-image"
                          />
                          <h3 className="percentage-heading">{percentage}% audio</h3>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                )}

                
                {isGenerateSummaryClicked && (
                  <div className='summary-display'>
                    <div className='display-section'>
                      <div className='summary-text'>
                        <p>{displayText}</p>
                      </div>
                      <div className='divider-line'></div>
                      <button className="play-summary-button" onClick={handlePlaySummaryAudio}>
                      {!isSummaryPlaying ? (
                          <i className="fas fa-volume-up"></i>
                        ) : (
                          <i className="fas fa-volume-mute"></i>
                      )}
                      </button>
                    </div>

                    <div className='summary-control-buttons'>
                      <button className="summary-done-button" onClick={handleDoneClick}>
                        <i className='fas fa-check'></i>
                        Done
                      </button>
                      <button className="summary-regenerate-button" onClick={handleRegenerateClick}>
                        <i className='fas fa-redo'></i>
                        Regenerate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          )}
       
      </header>
    </div>
  );
}

export default App;
