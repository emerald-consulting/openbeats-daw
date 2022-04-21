import classes from "./MessageListItem.module.css";

const MessageListItem = ({ messageDetails, isUserSender }) => {
  const convertISOStringToViewableDay = () => {
    const tempDate = new Date(messageDetails.createdAt).toString().split(" ");
    const formattedDate = `${tempDate[1]} ${+tempDate[2]} ${
      tempDate[3]
    } at ${tempDate[4].slice(0, 5)}`;
    return formattedDate;
  };
  const createdAt = convertISOStringToViewableDay();
  return (
    <div
      className={`${classes.messageBody}`}
      style={{
        backgroundColor: isUserSender ? "#bbf7d0" : "#e5e7eb",
        marginLeft: isUserSender ? "auto" : null,
        wordWrap: "break-word"
      }}
    >
      <div>
        <span>{messageDetails.content}</span>
      </div>
      <small style={{fontSize:"10px", color:"grey"}} className="text-muted">{createdAt}</small>
    </div>
  );
};
export default MessageListItem;
