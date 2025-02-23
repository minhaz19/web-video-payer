'use client';
import VideoRecorder from '@/components/VideoRecorder';

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-center mb-8">Video Recorder</h1>
      <VideoRecorder />
    </div>
  );
}
