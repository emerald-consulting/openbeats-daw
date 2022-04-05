import soundImg from "../../sound.jpeg";
import { useContext } from "react";
import PlaylistContext from "../../../model/playlist-store/playlist-context";
import classes from './PlaylistItem.module.css';

const PlaylistItem = ({ details }) => {
  const playlistCntxt = useContext(PlaylistContext);

  const removeFromPlaylist = () => {
    playlistCntxt.removeItem(details);
  };
  return (
    <>
      <div style={{paddingBottom: "5px" }}>
      <div style={{display: "flex", alignItems: "center"}}>
          <img
            src={details.pictureFileName || soundImg}
            className={classes.image}
            style={{ height: "40px", width: "40px", borderRadius: "10px" }}
          ></img>
        <span className={classes.songDetails}>
        <strong>{details.title}</strong><br/>
          <a>{`${details.firstName} ${details.lastName}`}</a><br/>
        </span>
        <button
          style={{
            borderRadius: "1em",
            background: "grey",
            color: "#ffff",
            marginLeft: "auto",
            height: "25px",
            width: "30px",
          }}
          className="px-2"
          onClick={removeFromPlaylist}
        >
          &#x2715;
        </button>
        </div>
      </div>
    </>
  );
};

export default PlaylistItem;
