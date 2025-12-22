import React from 'react';

interface YouTubeVideoProps {
  videoId: string;
  title: string;
  className?: string;
}

export default function YouTubeVideo({ videoId, title, className = '' }: YouTubeVideoProps) {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`aspect-video w-full ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
}
