import React, { useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import 'videojs-record/dist/videojs.record.js';

export const VideoRecorder = ({ options, onReady, getDevices = true }) => {
  const videoRef = useRef(null);
  const videoRecorderRef = useRef(null);

  useEffect(() => {
    if (!videoRecorderRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      const videoRecorderInstance = videojs(videoElement, options, () => {
        const version_info = `Using video.js: ${
          videojs.VERSION
        } with videojs-record: ${videojs.getPluginVersion(
          'record'
        )} and recordrtc: ${RecordRTC.version}`;
        videojs.log(version_info);

        if (videoRecorderInstance) {
          onReady && onReady(videoRecorderInstance);
        }
      });
      videoRecorderRef.current = videoRecorderInstance;
    }
  }, [onReady, options]);

  useEffect(() => {
    if (getDevices && videoRecorderRef.current) {
      videoRecorderRef.current.record().getDevice();
    }
    return () => {
      if (videoRecorderRef.current) {
        videoRecorderRef.current.record().destroy();
        videoRecorderRef.current = null;
      }
    };
  }, [getDevices]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        playsInline
        style={{ backgroundColor: '#000000' }}
      ></video>
    </div>
  );
};

export default VideoRecorder;
