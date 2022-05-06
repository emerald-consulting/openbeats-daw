import { Fragment, useContext } from "react";
import PlaylistContext from "../../model/playlist-store/playlist-context";
import PlaylistItem from "./playlistItem/playlistItem";
import classes from "../pages/SocialHomePage.module.css";

const Playlist = (props) =>{
  const playlistCntxt = useContext(PlaylistContext);
  const {items} = playlistCntxt;


return(
  <>
    <div>
    <h2 className="mb-1" style={{color: "#000"}}>Queue</h2>
    </div>
    <div className={classes.heading}>
    {
        items.map(item=> <PlaylistItem key={item.postId} details={item}/>)
    }
    </div>
    
  </>

)
}

export default Playlist;