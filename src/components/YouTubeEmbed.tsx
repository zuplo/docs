import type { CSSProperties } from "react";

interface YouTubeEmbedProps {
  /**
   * YouTube video ID (the part after v= in the URL)
   * Example: "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ
   */
  videoId: string;
  /**
   * Video title for accessibility
   */
  title?: string;
  /**
   * Size of the embed
   */
  size?: "sm" | "md" | "lg" | "full";
  /**
   * Additional CSS class names
   */
  className?: string;
  /**
   * Custom CSS styles
   */
  style?: CSSProperties;
  /**
   * Start time in seconds
   */
  start?: number;
  /**
   * Enable autoplay (note: browsers may require muted for autoplay)
   */
  autoplay?: boolean;
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  full: "max-w-full",
};

export function YouTubeEmbed({
  videoId,
  title = "YouTube video",
  size = "lg",
  className = "",
  style,
  start,
  autoplay = false,
}: YouTubeEmbedProps) {
  // Build YouTube URL with parameters
  const params = new URLSearchParams({
    ...(start && { start: start.toString() }),
    ...(autoplay && { autoplay: "1" }),
  });
  const paramString = params.toString();
  const embedUrl = `https://www.youtube.com/embed/${videoId}${paramString ? `?${paramString}` : ""}`;

  const containerStyle: CSSProperties = {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow:
      "0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "#000",
    ...style,
  };

  const sizeClass = sizeClasses[size] || sizeClasses.lg;

  return (
    <div className={`my-8 mx-auto ${sizeClass} ${className}`}>
      <div style={containerStyle}>
        {/* 16:9 aspect ratio container */}
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            height: 0,
            overflow: "hidden",
          }}
        >
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
