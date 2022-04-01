import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const FooterPlayer = (props) => {
  const addedClasses = props.className;
  // const audio = new Audio()

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
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onPlay={(e) => console.log("onPlay")}
        style={{
          width: "100%",
          backgroundColor: "#effcf5",
          height: "100%",
          display: "flex",
        }}
        customAdditionalControls={[]}
        layout="horizontal-reverse"
        customControlsSection={[
          <div className="flex flex-row">
            <img
              src="https://www.ajournalofmusicalthings.com/wp-content/uploads/2020/10/ACDC-logo-generator-1024x1024.jpg"
              style={{ height: "100%", width: "60px" }}
            />
              <strong className="mt-2 ml-2 font-weight-bold"><h2>The Gambler</h2>AC/DC</strong>

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
