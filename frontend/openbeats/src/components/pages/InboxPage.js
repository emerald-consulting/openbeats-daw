import { useState } from "react";
import Chatbox from "../chatbox/Chatbox";
import ConversationList from "../conversationList/ConversationList";
import NewPostForm from "../newPostForm/NewPostForm";
import Playlist from "../playlist/Playlist";
import inboxClasses from "./InboxPage.module.css";
import classes from "./SocialHomePage.module.css";

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
        <div className={inboxClasses.middlepane} >
          <ConversationList onSelectConversationHandler={onSelectConversationHandler}/>
        </div>
        <div className={inboxClasses.rightpane} >
          <Chatbox details={selectedConversation?selectedConversation : null }/>
        </div>
    </div>
  );
};
export default InboxPage;
