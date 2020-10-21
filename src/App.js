import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { auth } from './firebase';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [user, setUser] = useState(null);


  useEffect(() => {
    //gives persistence login
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //when logged in...
        console.log(authUser);
        setUser(authUser);
      }else{
        //when logged out...
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    }

  }, [user, username]);


  //useEffect --> Runs a peice of code on specific conditions
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //Everytime there is a change in db it is reflected in the web page
      setPosts(snapshot.docs.map( doc => ({
      id: doc.id,
      post: doc.data() 
      }) ))
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

     return auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message));
      setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    
    setOpenSignIn(false);
  }

  return (
    <div className="app">

      {/*Modal*/}
      {/*Sign In Modal*/}
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        
        <form className="app_signup">
            <center>
              <img className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="" />
            </center>
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value) }
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={ (e) => setPassword(e.target.value) }
              />
              <Button type="submit" onClick={signIn} >Sign In</Button>

        </form>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        
        <form className="app_signup">
            <center>
              <img className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="" />
            </center>
              
              <Input
                placeholder="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value) }
              />
              <Input
                placeholder="Email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value) }
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={ (e) => setPassword(e.target.value) }
              />

              <Button type="submit" onClick={signUp} >Sign Up</Button>

        </form>
        </div>
      </Modal>

     {/*Header*/}
      <div className="app_header">
        <img className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="" />

          { user ? 
              (<Button onClick={() => auth.signOut()}>Log Out</Button>)
              : (
                  <div className="app_loginContainer">
                    <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                    <Button onClick={() => setOpen(true)}>Sign Up</Button>
                  </div>
                )
          }
      </div>

      {/*Posts*/}
      <div className="app_posts">
          <div className="app_postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>  
            ))
          }
          </div>
          <div className="app_postsRight">
                <InstagramEmbed
                  url='https://www.instagram.com/p/B8LEVlHJNsd/'
                  maxWidth={320}
                  hideCaption={false}
                  containerTagName='div'
                  protocol=''
                  injectScript
                  onLoading={() => {}}
                  onSuccess={() => {}}
                  onAfterRender={() => {}}
                  onFailure={() => {}}
                />
          </div>
      </div>
      {/*Posts*/}

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):
      (
        <h3 className="login_to_upload">Login To upload</h3>
      )}

    </div>
  );
}

export default App;
