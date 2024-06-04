import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
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

  return (
    <div>
      {surahs.length === 0 ? (
        <p>Loading surah data...</p>
      ) : (
        <ul>
          {surahs.map((surah, index) => (
            <li key={index}>
              <Link to={`/surah/${index}`}>
                {surah.name} ({surah.englishName})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SurahList;
