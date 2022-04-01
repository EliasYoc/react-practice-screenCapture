import { useEffect, useRef, useState } from "react";
import "./App.css";
import PlayBar from "./components/PlayBar";
let mediaRecorder = null;
let recordedChunks = [];
function App() {
  const videoRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => {
    console.log(
      "is mp4 supported: ",
      MediaRecorder.isTypeSupported("video/mp4")
    );
    console.log(
      "getSupportedConstrains",
      navigator.mediaDevices.getSupportedConstraints()
    );
  }, []);

  const startSharedScreen = () => {
    console.log("start shared...");
    const promScreen = navigator.mediaDevices.getDisplayMedia({
      video: {
        echoCancellation: true,
        // width: 1080,
        // height: 720,
        //constraints properties👇
        //shared screen (cursor,displaySurface,logicalSurface) aun no compatible
      },
      audio: true,
    });
    promScreen
      .then((mediaStream) => {
        setIsRecording(true);
        console.log("mediaStream", mediaStream);
        videoRef.current.srcObject = mediaStream;
        mediaRecorder = new MediaRecorder(mediaStream, {
          mimeType: "video/webm; codecs=vp9",
          //bitspersecond:
        });
        mediaRecorder.ondataavailable = (e) => {
          //blobevent => e
          console.log("recorder dataavailable prop:", e);
          if (e.data.size > 0) {
            //array de recordedChunks para un Blob()
            recordedChunks.push(e.data);
            download();
          } else {
            alert("no hay video");
          }
          setIsRecording(false);
        };
        mediaRecorder.start();
        // console.log(mediaRecorder.state);
      })
      .catch((err) => console.log("catch", err));
  };

  const download = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" }); //video webm
    console.log("f:download blob->", blob);
    const videoFile = new File([blob], "video.webm", { type: blob.type });
    console.log(videoFile);
    //el siguiente código descarga el video a webm
    let url = URL.createObjectURL(blob);
    const $a = document.createElement("a");
    $a.download = "video.webm";
    $a.href = url;
    $a.click();
    URL.revokeObjectURL(url);
    url = "";
    mediaRecorder = null;
    recordedChunks = [];
  };
  const stopSharedScreen = () => {
    console.log("stop...");
    console.log("srcObject", videoRef.current.srcObject);
    console.log(
      "track 0 settings",
      videoRef.current.srcObject.getTracks()[0].getSettings()
    );
    let tracks = videoRef.current.srcObject.getTracks();
    console.log("tracks", tracks);
    tracks.forEach((track) => track.stop());
    mediaRecorder.stop();
  };
  return (
    <div className="App">
      <PlayBar
        start={startSharedScreen}
        stop={stopSharedScreen}
        isRecording={isRecording}
      />
      <video autoPlay className="sharedScreen" ref={videoRef}></video>
    </div>
  );
}

export default App;
