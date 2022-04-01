import { useContext, useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import PlaylistContext from "../../model/playlist-store/playlist-context";
import soundImg from '../sound.jpeg';

const FooterPlayer = (props) => {
  const addedClasses = props.className;
  const playlistCntxt = useContext(PlaylistContext);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const {items} = playlistCntxt;
  const currentlyPlayingSong = items.length>0 ? items[currentPlayingIndex]: null;

  const songEndHandler = ()=>{
    console.log("end Handler")
    if(items.length > currentPlayingIndex + 1){
      setCurrentPlayingIndex(()=>currentPlayingIndex + 1);
    }
  }

  return (
    <div
      className={addedClasses}
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "5em",
        backgroundColor: "#effcf5",
      }}
    >
      <AudioPlayer
        src={currentlyPlayingSong? currentlyPlayingSong.trackFileName : ''}
        onPlay={(e) => console.log("onPlay")}
        onEnded={songEndHandler}
        autoPlayAfterSrcChange
        onSr
        style={{
          width: "100%",
          backgroundColor: "#effcf5",
          height: "100%",
          display: "flex",
        }}
        customAdditionalControls={[]}
        layout="horizontal-reverse"
        customControlsSection={ [
          currentlyPlayingSong && <div className="flex flex-row">
            <img
              src={currentlyPlayingSong.pictureFileName || soundImg}
              style={{ height: "100%", width: "60px" }}
            />
              <strong className="mt-2 ml-2 font-weight-bold"><h2>{currentlyPlayingSong.title}</h2>
              {currentlyPlayingSong.username}</strong>

          </div>,
          RHAP_UI.ADDITIONAL_CONTROLS,
          RHAP_UI.MAIN_CONTROLS,
          RHAP_UI.VOLUME_CONTROLS,
        ]}
        customProgressBarSection={
          [
            RHAP_UI.PROGRESS_BAR,
            RHAP_UI.CURRENT_TIME,
          ]
        }
        // other props here
      />
    </div>
  );
};
export default FooterPlayer;
