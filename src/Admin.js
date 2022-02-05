import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import videoUrls from './videoUrls'
import VideoPlayer from './components/VideoPlayer'
import Option from './Option'

const Admin = () => {

    const [users, setUsers] = useState([])
    const [urls, setUrls] = useState([])
    const [interviewId, setInterviewId] = useState(0)
    const interviewVideos = videoUrls.interviewVideos

    useEffect(() => {
        UpdateState()
    },[])

    const updateUser = () => {
        users.forEach(user => {
            if(user.name === $("#users :selected").text()){
                let index = -1
                let allUrls = []
                interviewVideos.forEach(loop => {
                    index++
                    allUrls.push(interviewVideos[index])
                    allUrls.push(user.urls[index])
                });
                setUrls(allUrls)
            }
        })
    }

    const UpdateState = async () => {
        let index = -1
        let index2 = -1
        let allUrls = []
        await fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews`)
            .then(response => response.json())
            .then(data => {
                
                data.Items.forEach(user => {
                    if(index === -1){
                    interviewVideos.forEach(loop => {
                        index2++
                        allUrls.push(interviewVideos[index2])
                        allUrls.push(user.urls[index2])
                    })
                }
                index++
            })
            setUrls(allUrls)
            setUsers(data.Items)
        })
    }
            
        
        
    

    const reload = () => {
        $("#question-selector").css({'display':'flex'})
        $("#replay-ui").css({'display':'none'})
        setInterviewId(0)
        //window.location.reload(false)
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
            if(num == -1){
                setInterviewId(interviewId+num)
                return
            }
        }
        if(interviewId+num <= urls.length-1){
            if(num == 1){
                setInterviewId(interviewId+num)
            }
            return
        }
    }

    
    return (
        <div className='no-scroll'>
            <div className='page-title-video'>
                <select className="dropMenu" onChange={() => updateUser()} name="users" id="users">
                    {users && users.map(user => <Option key={user.id} name={user.name} />)}
                </select>
            </div>
            <div id="question-selector" className="video-selector">
                <button className="select-btn" onClick={() => setQuestionId(-1)}>-</button>
                <p className='question-id'>{interviewId+1}</p>
                <button className="select-btn" onClick={() => setQuestionId(1)}>+</button>
            </div>
            <div className='replay-container' id="replay-ui">
                <button className='startBtn' onClick={() => reload()}>Retour</button>
            </div>
            <div id="player" className='video-container no-scroll'>
                <VideoPlayer id="mainVideo" src={urls[interviewId]} end={endPlay} title={`Question ${Math.ceil(((interviewId+1)/2)-1)+1}`} />
            </div>
        </div>
    )
}

export default Admin
