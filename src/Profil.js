import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import firebase from './firebase'
import videoUrls from './videoUrls'
import VideoPlayer from './components/VideoPlayer'

const Profil = () => {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [urls, setUrls] = useState([])
    const [interviewId, setInterviewId] = useState(0)
    const interviewVideos = videoUrls.interviewVideos

    useEffect(() => {
        UpdateState()
    },[])

    const UpdateState = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setEmail(user.email)
                fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${user.email}`)
                .then(response => response.json())
                .then(data => {
                setName(data.name)
                let index = -1
                let allUrls = []
                interviewVideos.forEach(loop => {
                    index++
                    allUrls.push(interviewVideos[index])
                    allUrls.push(data.urls[index])
                });
                setUrls(allUrls)
                })
            }
        })
    }

    const reload = () => {
        window.location.reload(false);
    }

    const endPlay = () => {
        setInterviewId(interviewId+1)
        if(urls[interviewId+1] === undefined){
            $("#replay-ui").css({'display':'flex'})
        }
    }
    
    return (
        <div className='no-scroll'>
            <div className='replay-container' id="replay-ui">
                <button className='record-btn' onClick={() => reload()}>Revoir</button>
            </div>
            <div id="player" className='video-container no-scroll'>
                <VideoPlayer id="mainVideo" src={urls[interviewId]} end={endPlay} title={Math.ceil(((interviewId+1)/2)-1)} />
            </div>
        </div>
    )
}

export default Profil
