import { useReducer } from "react";
import PlaylistContext from "./playlist-context";

const defaultState = { items: [] };

const playlistReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedItems = state.items.concat(action.value);
    return { items: updatedItems };
  }
  if (action.type === "ADD_FIRST") {
    const updatedItems = [action.value].concat(state.items);
    return { items: updatedItems };
  }
  if (action.type === "REMOVE") {
    const updatedItems = state.items.filter(item => item !== action.value);
    return { items: updatedItems};
  }
  return defaultState;
};

const PlaylistProvider = (props) => {
  const [playlistState, playlistDispatch] = useReducer(playlistReducer, defaultState);

  const addItemToPlaylistHandler = (item) => {
    playlistDispatch({ type: "ADD", value: item });
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
  };

  return (
    <PlaylistContext.Provider value={playlistContext}>
      {props.children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistProvider;
