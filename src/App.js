import { useEffect, useRef } from "react";
import "./App.css";
import PlayBar from "./components/PlayBar";

function App() {
  const videoRef = useRef();

  useEffect(() => {
    if (!navigator.mediaDevices)
      return <p>Compartir pantalla no es compatible en celulares</p>;
    console.log(
      "is mp4 supported: ",
      MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    );
    console.log(
      "getSupportedConstrains",
      navigator.mediaDevices.getSupportedConstraints()
    );
  }, []);

  let mediaRecorder = null;
  let recordedChunks = [];
  const startSharedScreen = () => {
    console.log("start...");
    const prom = navigator.mediaDevices.getDisplayMedia({
      video: {
        // width: 1080,
        // height: 720,
        //constraints properties👇
        //shared screen (cursor,displaySurface,logicalSurface) aun no compatible
      },
    }); //grabando
    prom
      .then((mediaStream) => {
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
        };
        mediaRecorder.start();
        // console.log(mediaRecorder.state);
      })
      .catch((err) => console.log("catch", err));
  };
  const download = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const $a = document.createElement("a");
    $a.download = "video.webm";
    $a.href = url;
    $a.click();
    URL.revokeObjectURL(url);
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
    mediaRecorder = null;
    recordedChunks = [];
  };
  return (
    <div className="App">
      <PlayBar start={startSharedScreen} stop={stopSharedScreen} />
      <video autoPlay className="sharedScreen" ref={videoRef}></video>
    </div>
  );
}

export default App;
