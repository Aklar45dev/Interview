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
        $("#question-selector").css({'display':'flex'})
        $("#replay-ui").css({'display':'none'})
        setInterviewId(0)
        //window.location.reload(false);
    }

    const endPlay = () => {
        setInterviewId(interviewId+1)
        if(urls[interviewId+1] === undefined){
            $("#replay-ui").css({'display':'flex'})
            $("#question-selector").css({'display':'none'})
        }
    }

    const setQuestionId = (num) => {
        console.log()
        if(interviewId+num >= 0){
            if(num === -1){
                setInterviewId(interviewId+num)
                return
            }
        }
        if(interviewId+num <= urls.length-1){
            if(num === 1){
                setInterviewId(interviewId+num)
            }
            return
        }
    }

    
    return (
        <div className='no-scroll'>
            <div className='page-title-video'>Entretien</div>
            <div id="question-selector" className="video-selector">
                <button className="select-btn" onClick={() => setQuestionId(-1)}>-</button>
                <p className='question-id'>{`${interviewId% 2 === 0 ? "Question" : "Réponse"} ${Math.ceil(((interviewId+1)/2)-1)+1}`}</p>
                <button className="select-btn" onClick={() => setQuestionId(1)}>+</button>
            </div>
            <div className='replay-container' id="replay-ui">
                <button className='startBtn' onClick={() => reload()}>Revoir</button>
            </div>
            <div id="player" className='video-container no-scroll'>
                <VideoPlayer id="mainVideo" src={urls[interviewId]} end={endPlay} title={`Question ${Math.ceil(((interviewId+1)/2)-1)+1}`} />
            </div>
        </div>
    )
}

export default Profil
