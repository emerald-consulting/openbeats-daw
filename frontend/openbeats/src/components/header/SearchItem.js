import { Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import './MainHeader.module.css'

const SearchItem = ({ details, searchText, onSelectItem }) => {

    const postDetails = JSON.parse(details.key);
    const history = useHistory();
    const dispatch = useDispatch();

    const selectItem = () => {
        if (postDetails.username === '-1') {
            if (postDetails.userid === '-2') {
                return;
            }
            dispatch({ type: 'SHOW_ALL_SEARCH' })
        }
        else {
            if (postDetails.username) {
                console.log('prof ',postDetails)
                dispatch({ type: 'SELECT_PROFILE', value: postDetails.userid })
                history.push(`profile/${postDetails.userid}`);
            }
            else {
                dispatch({ type: 'SELECT_POST', value: postDetails })
            }
        }
        onSelectItem()
    }

    return (
        <div className="mb-5">
            <div style={{ display: "flex", alignItems: "flex-start", flexDirection: 'column', justifyContent: 'center', cursor: 'pointer', paddingLeft: '10px', border: '1px solid lightgray',background:`${(postDetails.username && postDetails.username !== '-1') ? 'lightgray':'white'}` }} onClick={selectItem} >
                {
                    postDetails.username === '-1' ? (
                        <Typography color='primary'>{postDetails.userid === '-2' ? 'No Results found' : `Show all for ${searchText}`} </Typography>
                    ) : (
                        <>
                            {
                                postDetails.username ? (
                                    <>
                                        <Typography>{postDetails.username}</Typography>
                                        <p style={{ opacity: '0.7', fontSize: '11px' }}>User</p>
                                    </>
                                ) : (
                                    <>
                                        <Typography><span style={{ opacity: '0.7', fontSize: '11px' }}>Title:</span> {postDetails.title}</Typography>
                                        <Typography><span style={{ opacity: '0.7', fontSize: '11px' }}>Description:</span> {postDetails.description}</Typography>
                                        <Typography><span style={{ opacity: '0.7', fontSize: '11px' }}>Genre:</span> {postDetails.genre}</Typography>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default SearchItem;
