import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/style/NotFoundPage.css";
import { FaCameraRetro } from "react-icons/fa"; // Camera icon
import backgroundImage from "../assets/images/1.jpg"; // Blurred background image
import shutterSound from "../assets/images/shutter.mp3"; // Camera shutter sound
import ambientSound from "../assets/images/ambient.mp3"; // Ambient background sound

const NotFoundPage = () => {
  const [focusLevel, setFocusLevel] = useState(0);
  const [cameraPosition, setCameraPosition] = useState({ x: 50, y: 50 });
  const [isMuted, setIsMuted] = useState(false);

  // Play shutter sound
  const playShutterSound = () => {
    if (!isMuted) {
      const audio = new Audio(shutterSound);
      audio.play();
    }
  };

  // Move camera icon randomly
  const moveCamera = () => {
    const x = Math.random() * 80 + 10; // Random x position (10% to 90%)
    const y = Math.random() * 80 + 10; // Random y position (10% to 90%)
    setCameraPosition({ x, y });
    playShutterSound();
  };

  // Handle slider change for "Find the Focus" game
  const handleSliderChange = (e) => {
    setFocusLevel(e.target.value);
  };

  // Toggle mute for ambient sound
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 20 - 10;
      const y = (e.clientY / window.innerHeight) * 20 - 10;
      document.querySelector(
        ".not-found-container"
      ).style.backgroundPosition = `${x}% ${y}%`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="not-found-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="not-found-content">
        {/* Camera Icon */}
        <div
          className="camera-icon"
          style={{ left: `${cameraPosition.x}%`, top: `${cameraPosition.y}%` }}
          onClick={moveCamera}
        >
          <FaCameraRetro className="camera" />
        </div>

        {/* Main Heading */}
        <h1 className="not-found-title">
          <span className="glitch">404</span> - Page Not Found
        </h1>

        {/* Creative Message */}
        <p className="not-found-description">
          Oops! Looks like this shot is out of focus. Let's take you back to the
          gallery.
        </p>

        {/* Call-to-Action Button */}
        <Link to="/" className="not-found-button">
          View Portfolio
        </Link>

        {/* Mini-Game: Find the Focus */}
        <div className="mini-game">
          <h3>Find the Focus</h3>
          <input
            type="range"
            min="0"
            max="100"
            value={focusLevel}
            onChange={handleSliderChange}
            className="focus-slider"
          />
          <div
            className="focus-image"
            style={{ filter: `blur(${100 - focusLevel}px)` }}
          ></div>
        </div>

        {/* Mute Button */}
        <button className="mute-button" onClick={toggleMute}>
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Ambient Sound */}
      <audio src={ambientSound} autoPlay loop muted={isMuted}></audio>
    </div>
  );
};

export default NotFoundPage;
