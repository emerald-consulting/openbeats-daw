import soundImg from "../../sound.jpeg";
import CancelIcon from "@material-ui/icons/Cancel";
import { useContext } from "react";
import PlaylistContext from "../../../model/playlist-store/playlist-context";

const PlaylistItem = ({ details }) => {
  const playlistCntxt = useContext(PlaylistContext);

  const removeFromPlaylist = () => {
    playlistCntxt.removeItem(details);
  };
  return (
    <>
      <div style={{ borderBottom: "1px grey solid" }}>
        <div style={{ display: "inline-flex" }}>
          <img
            src={details.pictureFileName || soundImg}
            style={{ maxHeight: "120px", width: "30%" }}
          ></img>
          <strong className="mt-2 ml-2 font-weight-bold">
            <h2>{details.title}</h2>
          </strong>
        </div>
        <button
          style={{
            border: "1px solid grey",
            borderRadius: "1em",
            background: "grey",
            color: "#ffff",
          }}
          className="float-right px-2 mt-3"
          onClick={removeFromPlaylist}
        >
          &#x2715;
        </button>
      </div>
    </>
  );
};

export default PlaylistItem;
