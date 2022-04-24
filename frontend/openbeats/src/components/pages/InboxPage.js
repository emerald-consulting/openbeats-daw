import { useState } from "react";
import Chatbox from "../chatbox/Chatbox";
import ConversationList from "../conversationList/ConversationList";
import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import classes from "./InboxPage.module.css";

const InboxPage = () => {

  const [refresh, setRefresh] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const refreshPosts = () => {
    setRefresh((prev) => prev + 1);
  };

  const onSelectConversationHandler = (conversationData) => {
    setSelectedConversation(conversationData);
    console.log(conversationData);
  };

  return (
    <div className={classes.container}>
        <div className={classes.leftpane}>
          <div className={classes.splitScreen}>
            <div className={classes.topPane}>
              <NewPostForm refreshPosts={refreshPosts} />
            </div>
            <div className={classes.bottomPane}>
              <Playlist />
            </div>
          </div>
        </div>
        <div className={classes.middlepane}>
          <ConversationList onSelectConversationHandler={onSelectConversationHandler}/>
        </div>
        <div className={classes.rightpane}>
          <Chatbox details={selectedConversation?selectedConversation : null }/>
        </div>
    </div>
  );
};
export default InboxPage;
