import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds = 1 minute
  const timerRef = useRef(null);

  const startRecording = useCallback(() => {
    setRecording(true);
    setTimeLeft(60);
    const stream = webcamRef.current.video.srcObject;
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setRecordedVideo(url);
    };

    mediaRecorderRef.current.start();

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    }
    setRecording(false);
  }, []);

  const retakeVideo = useCallback(() => {
    setRecordedVideo(null);
    setTimeLeft(60);
  }, []);

  const handleSubmit = useCallback(() => {
    if (recordedVideo) {
      // Here you would typically upload the video to your server
      alert('Video submitted successfully!');
      // Reset the state after submission
      setRecordedVideo(null);
      setTimeLeft(60);
    }
  }, [recordedVideo]);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto p-4">
      {!recordedVideo ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={true}
            className="w-full rounded-lg"
          />
          <div className="text-lg font-bold">
            {recording ? `Time remaining: ${timeLeft}s` : 'Ready to record'}
          </div>
          <button
            onClick={recording ? stopRecording : startRecording}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            {recording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </>
      ) : (
        <>
          <video
            src={recordedVideo}
            controls
            className="w-full rounded-lg"
          />
          <div className="flex gap-4">
            <button
              onClick={retakeVideo}
              className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
            >
              Retake
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoRecorder; 