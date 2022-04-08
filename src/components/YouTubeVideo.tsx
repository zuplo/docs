import React from "react";
import styles from "./YouTubeVideo.module.css";

const YouTubeVideo: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div className={styles["video-container"]}>
      <iframe
        src={url}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTubeVideo;
