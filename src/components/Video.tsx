import React from "react";
import videojs from "video.js";
import styles from "./video.module.css";

import "video.js/dist/video-js.css";

const Video: React.FC<{ id: string }> = ({ id }) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  const options = {
    autoplay: true,
    controls: true,
    muted: true,
    responsive: true,
    loop: true,
    fluid: true,
    sources: [
      {
        src: `https://customer-syik58259xvgy0tz.cloudflarestream.com/${id}/manifest/video.m3u8`,
        type: "application/x-mpegURL",
      },
    ],
    html5: {
      vhs: {
        limitRenditionByPlayerDimensions: true,
        useDevicePixelRatio: true,
        useNetworkInformationApi: true,
      },
    },
  };

  React.useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className={styles["video-container"]}>
      <div ref={videoRef} />
    </div>
  );
};

export default Video;
