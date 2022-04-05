import { useReducer } from "react";
import PlaylistContext from "./playlist-context";

const defaultState = { items: [] };

const playlistReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items.concat(action.value);
    localStorage.setItem("playlist", JSON.stringify(updatedItems))
    return { items: updatedItems };
  }
  if (action.type === "ADD_FIRST") {
    const updatedItems = [action.value].concat(state.items);
    localStorage.setItem("playlist",JSON.stringify(updatedItems))
    return { items: updatedItems };
  }
  if (action.type === "ADD_MULTIPLE") {
    const updatedItems = state.items.concat(...action.value);
    localStorage.setItem("playlist",JSON.stringify(updatedItems));
    return { items: updatedItems };
  }
  if (action.type === "REMOVE") {
    const updatedItems = state.items.filter(item => item !== action.value);
    localStorage.setItem("playlist",JSON.stringify(updatedItems))
    return { items: updatedItems};
  }
  return defaultState;
};

const PlaylistProvider = (props) => {
  const [playlistState, playlistDispatch] = useReducer(playlistReducer, defaultState);

  const addItemToPlaylistHandler = (item) => {
    playlistDispatch({ type: "ADD", value: item });
  };

  const addItemsToPlaylistHandler = (item) => {
    playlistDispatch({ type: "ADD_MULTIPLE", value: item });
  };

  const addItemAtFirstPlaylistHandler = (item) => {
    playlistDispatch({ type: "ADD_FIRST", value: item });
  };

  const removeTtemfromPlaylistHandler = (id) => {
    playlistDispatch({ type: "REMOVE", value: id });
  };

  const playlistContext = {
    items: playlistState.items,
    addItem: addItemToPlaylistHandler,
    removeItem: removeTtemfromPlaylistHandler,
    addItemAtFirst: addItemAtFirstPlaylistHandler,
    addMultipleItem: addItemsToPlaylistHandler,
  };

  return (
    <PlaylistContext.Provider value={playlistContext}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistProvider;
