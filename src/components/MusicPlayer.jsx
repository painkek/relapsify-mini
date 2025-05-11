import { useState, useRef, useEffect } from "react";
import "./MusicPlayer.css";
import Multo from "../assets/music/multo-coj.mp3";
import MultoCover from "../assets/album/multo.jpg";

import { FaPlay, FaPause } from "react-icons/fa";

const MusicPlayer = () => {
  const [songs] = useState([
    {
      title: "Multo",
      artist: "Cup of Joe",
      src: Multo,
      duration: 240, // 4:00 in seconds
      cover: MultoCover,
    },
    // Add more songs as needed
  ]);

  const [currentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(108); // 1:48 in seconds
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNext = () => {
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSongIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    const newTime = (newProgress / 100) * audioRef.current.duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  return (
    <div className={`music-player ${isPlaying ? "playing" : ""}`}>
      <audio
        ref={audioRef}
        src={songs[currentSongIndex].src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="album-cover-container">
        <img
          src={songs[currentSongIndex].cover}
          alt={`${songs[currentSongIndex].title} album cover`}
          className="album-cover"
        />
      </div>

      <div className="song-info">
        <h2 className="song-title">{songs[currentSongIndex].title}</h2>
        <p className="song-artist">{songs[currentSongIndex].artist}</p>
      </div>

      <div className="progress-container">
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(songs[currentSongIndex].duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={(currentTime / songs[currentSongIndex].duration) * 100}
          onChange={handleProgressChange}
          className="progress-bar"
        />
      </div>

      <div className="controls">
        <button className="play-pause" onClick={handlePlayPause}>
          {isPlaying ? (
            <FaPause className="icon" />
          ) : (
            <FaPlay className="icon" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
