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
        $("#pop").css({'display':'none'})
        $("#delete").css({'border': '2.5px solid rgb(255, 0, 0)', 'color': 'rgba(255, 0, 0, 1)'})
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

    const ShowPopUp = (show) => {
        $("#pop").css({'display':`${show === true ? 'grid' : 'none'}`})

    }

    const Delete = () => {
        $("#pop").css({'display':'none'})
        //fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${}`, { method: 'DELETE' })
        fetch("https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/nonte", { method: 'DELETE' })
            //.then(() => window.location.reload(false))
    }

    
    return (
        <div className='no-scroll'>
            <div id="pop" className="popUp">
                <div className="popUp-text">Supprimer l'entretien?</div>
                <div className="popUp-btns">
                    <button className='record-btn' onClick={() => Delete()}>Ok</button>
                    <button className='record-btn' onClick={() => ShowPopUp(false)}>Annuler</button>
                </div>
            </div>
            <div className='page-title-video'>Administrateur</div>
            <div className='page-title-video'>
                <select className="dropMenu" onChange={() => updateUser()} name="users" id="users">
                    {users && users.map(user => <Option key={user.id} name={user.name} />)}
                </select>
            </div>
            <div id="question-selector" className="video-selector">
                <button className="select-btn" onClick={() => setQuestionId(-1)}>-</button>
                <p className='question-id'>{`${interviewId% 2 === 0 ? "Question" : "Réponse"} ${Math.ceil(((interviewId+1)/2)-1)+1}`}</p>
                <button className="select-btn" onClick={() => setQuestionId(1)}>+</button>
            </div>
            <div className='replay-container' id="replay-ui">
                <button className='startBtn' onClick={() => reload()}>Retour</button>
            </div>
            <div id="player" className='video-container no-scroll'>
                <VideoPlayer id="mainVideo" src={urls[interviewId]} end={endPlay} title={`Question ${Math.ceil(((interviewId+1)/2)-1)+1}`} />
            </div>
            <div className='btns-recording'>
                <button className='record-btn' id="delete" onClick={() => ShowPopUp(true)}>Supprimer</button>
            </div>
        </div>
    )
}

export default Admin
