import React from "react";

const PlaylistContext = React.createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  addItemAtFirst: (item) => {},
});

export default PlaylistContext;