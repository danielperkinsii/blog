import React from 'react';
import YouTubeVideo from './youtubeVideo';
import Date from './date';
import { VlogData } from '../lib/vlogs';

interface VlogCardProps {
  vlog: VlogData;
}

export default function VlogCard({ vlog }: VlogCardProps) {
  return (
    <article className="bg-white p-6 mb-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">{vlog.title}</h2>
      <div className="text-sm text-gray-600 mb-4">
        <Date dateString={vlog.date} />
      </div>
      <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">{vlog.description}</p>
      <YouTubeVideo
        videoId={vlog.youtubeId}
        title={vlog.title}
        className="mb-4"
      />
    </article>
  );
}
