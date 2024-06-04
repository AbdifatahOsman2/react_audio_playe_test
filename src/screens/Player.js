import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AudioPlayer = () => {
  const [surahs, setSurahs] = useState([]);
  const [currentSurahIndex, setCurrentSurahIndex] = useState(0);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Fetch surah data from the API
    const fetchSurahData = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/quran/ar.alafasy');
        const surahsData = response.data.data.surahs;

        if (Array.isArray(surahsData) && surahsData.length > 0) {
          setSurahs(surahsData);
        } else {
          console.error('Invalid surah data in response', surahsData);
        }
      } catch (error) {
        console.error('Error fetching surah data', error);
      }
    };

    fetchSurahData();
  }, []);

  useEffect(() => {
    if (surahs.length > 0 && audioRef.current) {
      const currentSurah = surahs[currentSurahIndex];
      const currentAyah = currentSurah.ayahs[currentAyahIndex];
      audioRef.current.src = currentAyah.audio;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio', error);
        });
      }
    }
  }, [surahs, currentSurahIndex, currentAyahIndex, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio', error);
      });
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleNextAyah = () => {
    const currentSurah = surahs[currentSurahIndex];
    if (currentAyahIndex < currentSurah.ayahs.length - 1) {
      setCurrentAyahIndex(currentAyahIndex + 1);
    } else {
      if (currentSurahIndex < surahs.length - 1) {
        setCurrentSurahIndex(currentSurahIndex + 1);
        setCurrentAyahIndex(0);
      } else {
        // Last surah and last ayah reached
        setIsPlaying(false);
      }
    }
  };

  const handlePrevAyah = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex(currentAyahIndex - 1);
    } else {
      if (currentSurahIndex > 0) {
        setCurrentSurahIndex(currentSurahIndex - 1);
        const previousSurah = surahs[currentSurahIndex - 1];
        setCurrentAyahIndex(previousSurah.ayahs.length - 1);
      } else {
        // First surah and first ayah reached
        setIsPlaying(false);
      }
    }
  };

  const handleNextSurah = () => {
    if (currentSurahIndex < surahs.length - 1) {
      setCurrentSurahIndex(currentSurahIndex + 1);
      setCurrentAyahIndex(0);
    }
  };

  const handlePrevSurah = () => {
    if (currentSurahIndex > 0) {
      setCurrentSurahIndex(currentSurahIndex - 1);
      setCurrentAyahIndex(0);
    }
  };

  const handleSelectSurah = event => {
    const selectedSurahIndex = parseInt(event.target.value);
    setCurrentSurahIndex(selectedSurahIndex);
    setCurrentAyahIndex(0);
  };

  const handleEnded = () => {
    handleNextAyah();
  };

  return (
    <div>
      {surahs.length === 0 ? (
        <p>Loading surah data...</p>
      ) : (
        <>
          <audio ref={audioRef} onEnded={handleEnded} controls />
          <select onChange={handleSelectSurah} value={currentSurahIndex}>
            {surahs.map((surah, index) => (
              <option key={index} value={index}>
                {surah.name} ({surah.englishName})
              </option>
            ))}
          </select>
        </>
      )}
      <div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handlePrevAyah}>Previous Ayah</button>
        <button onClick={handleNextAyah}>Next Ayah</button>
        <button onClick={handlePrevSurah}>Previous Surah</button>
        <button onClick={handleNextSurah}>Next Surah</button>
      </div>
    </div>
  );
};

export default AudioPlayer;
