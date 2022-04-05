import { useContext, useEffect, useState } from "react";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import PlaylistContext from "../../model/playlist-store/playlist-context";
import soundImg from "../sound.jpeg";
import classes from "./FooterPlayer.module.css";

const FooterPlayer = (props) => {
  const addedClasses = props.className;
  const playlistCntxt = useContext(PlaylistContext);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const { items } = playlistCntxt;
  const currentlyPlayingSong =
    items.length > 0 ? items[currentPlayingIndex] : null;

  useEffect(() => {
    let playlist = JSON.parse(localStorage.getItem("playlist") || "[]");
    if (!items.length && playlist.length) {
      playlistCntxt.addMultipleItem(playlist);
    }
  }, []);

  const songEndHandler = () => {
    console.log("end Handler");
    if (items.length > currentPlayingIndex + 1) {
      setCurrentPlayingIndex(() => currentPlayingIndex + 1);
    }
  };

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
        src={currentlyPlayingSong ? currentlyPlayingSong.trackFileName : ""}
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
        customControlsSection={[
          currentlyPlayingSong && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={currentlyPlayingSong.pictureFileName || soundImg}
                className={classes.image}
                style={{ height: "60px", width: "60px", borderRadius: "10px" }}
              ></img>
              <span className={classes.songDetails}>
                <strong>{currentlyPlayingSong.title}</strong>
                <br />
                <a>{`${currentlyPlayingSong.firstName} ${currentlyPlayingSong.lastName}`}</a>
                <br />
              </span>
            </div>
          ),
          RHAP_UI.ADDITIONAL_CONTROLS,
          RHAP_UI.MAIN_CONTROLS,
          RHAP_UI.VOLUME_CONTROLS,
        ]}
        customProgressBarSection={[RHAP_UI.PROGRESS_BAR, RHAP_UI.CURRENT_TIME]}
        // other props here
      />
    </div>
  );
};
export default FooterPlayer;
