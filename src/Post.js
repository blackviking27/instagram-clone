import React, { useEffect, useState } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imageUrl}){

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() =>{
        let unsubscribe;
        if (postId){
            unsubscribe = db.collection("posts")
                            .doc(postId)
                            .collection("comments")
                            .orderBy("timestamp", "desc")
                            .onSnapshot((snapshot) => {
                                setComments(snapshot.docs.map ( (doc) => doc.data() ) );
                            });
        }
    }, [postId]);

    const postComment = (event) => {
        event.preventDefault();
        
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }

    return(
        <div className="post">
            {/* Header -> Avatar */}
            <div className="post_header">
                <Avatar 
                    className="post_avatar"
                    alt="User"
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>

            {/*Image*/}

            <img className="post_image" src={imageUrl} alt=""></img>

            {/*Username + caption*/}
        
            <h4 className="post_text"><strong>{username}:</strong> {caption}</h4>

            {/* Comments on a Post */}

            <div className="post_comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong>: {comment.text}
                    </p>
                ))}
            </div>


            {/* Post Comment */}

            {user &&(
                <form className="post_commentBox">
                <input 
                    className="post_input"
                    type="text"
                    placeholder="Add a comment ..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    className="post_button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                >
                Post
                </button>
            </form>
            )}

        </div>
    )
};

export default Post