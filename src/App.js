import React, { useRef, useState } from 'react';
import VideoRecorder from './components/VideoRecorder';

const videoJsOptions = {
  controls: true,
  bigPlayButton: false,
  width: 320,
  height: 240,
  fluid: false,
  plugins: {
    /*
      // wavesurfer section is only needed when recording audio-only
      wavesurfer: {
          backend: 'WebAudio',
          waveColor: '#36393b',
          progressColor: 'black',
          debug: true,
          cursorWidth: 1,
          msDisplayMax: 20,
          hideScrollbar: true,
          displayMilliseconds: true,
          plugins: [
              // enable microphone plugin
              WaveSurfer.microphone.create({
                  bufferSize: 4096,
                  numberOfInputChannels: 1,
                  numberOfOutputChannels: 1,
                  constraints: {
                      video: false,
                      audio: true
                  }
              })
          ]
      },
      */
    record: {
      audio: true,
      video: true,
      maxLength: 10,
      debug: true,
    },
  },
};

const App = () => {
  const videoRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleVideoRecorderReady = (videoRecorder) => {
    videoRecorderRef.current = videoRecorder;

    // Device is ready
    videoRecorder.on('deviceReady', () => {
      console.log('Device is ready!');
    });

    // User clicked the record button and started recording
    videoRecorder.on('startRecord', () => {
      console.log('Started recording!');
      setIsRecording(true);
    });

    videoRecorder.on('stopRecord', () => {
      console.log('Stopped recording!');
      setIsRecording(false);
    });

    // User completed recording and stream is available
    videoRecorder.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      console.log('Finished recording: ', videoRecorder.recordedData);
    });

    // Error handling
    videoRecorder.on('error', (element, error) => {
      console.error('Error on video recorder', error);
    });

    videoRecorder.on('deviceError', () => {
      console.error('device error:', videoRecorder.deviceErrorCode);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <VideoRecorder
        options={videoJsOptions}
        onReady={handleVideoRecorderReady}
      />
      {videoRecorderRef && (
        <button
          style={{ width: '320px', marginTop: '5px' }}
          onClick={() => {
            isRecording && videoRecorderRef.current
              ? videoRecorderRef.current?.record().stop()
              : videoRecorderRef.current?.record().start();
          }}
        >
          {isRecording ? 'Stop record' : 'Start record'}
        </button>
      )}
    </div>
  );
};

export default App;
