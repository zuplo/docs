import { Stream } from "@cloudflare/stream-react";
import React from "react";
import styles from "./video.module.css";

const Video: React.FC = (props: any) => {
  return (
    <div className={styles["video-container"]}>
      <Stream
        muted={true}
        controls={true}
        autoplay={true}
        loop={true}
        {...props}
        primaryColor="FF00BD"
      />
    </div>
  );
};

export default Video;
