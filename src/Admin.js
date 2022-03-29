import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import videoUrls from './videoUrls'
import VideoPlayer from './components/VideoPlayer'
import Option from './Option'
import Button from './Button'
import _ from 'lodash'  

const Admin = () => {

    const [users, setUsers] = useState([])
    const [urls, setUrls] = useState([])
    const [scripts, setScripts] = useState([])
    const [occurence, setOccurence] = useState([])
    const [user, setUser] = useState({ id: 'user' , name: "name", urls: 'urls' })
    const [interviewId, setInterviewId] = useState(0)
    const interviewVideos = videoUrls.interviewVideos

    useEffect(() => {
        $("#pop").css({'display':'none'})
        $("#delete").css({'border': '2.5px solid rgb(255, 0, 0)', 'color': 'rgba(255, 0, 0, 1)'})
        $("#ok").css({'border': '2.5px solid rgb(255, 0, 0)', 'color': 'rgba(255, 0, 0, 1)'})
        UpdateState()
    },[])

    useEffect(() => {
        filterText(scripts[Math.ceil(((interviewId+1)/2)-1)])
    }, [user])

    const updateUser = () => {
        users.forEach(user => {
            if(user.name === $("#users :selected").text()){
                let index = -1
                let allUrls = []
                let allScripts = []
                interviewVideos.forEach(loop => {
                    index++
                    allUrls.push(interviewVideos[index])
                    allUrls.push(user.urls[index])
                    allScripts.push(user.script[index])
                })
                setUser(user)
                setUrls(allUrls)
                setScripts(allScripts)
                filterText()
            }
        })
    }

    const UpdateState = async () => {
        let index = -1
        let index2 = -1
        let allUrls = []
        let allScripts = []
        await fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews`)
            .then(response => response.json())
            .then(data => {
                data.Items.forEach(user => {
                    if(index === -1){
                    interviewVideos.forEach(loop => {
                        index2++
                        allUrls.push(interviewVideos[index2])
                        allUrls.push(user.urls[index2])
                        allScripts.push(user.script[index2])
                    })
                    setUser(user)
                }
                index++
            })
            setUrls(allUrls)
            setScripts(allScripts)
            setUsers(data.Items)
        })
    }
            
    const reload = () => {
        $("#question-selector").css({'display':'flex'})
        $("#replay-ui").css({'display':'none'})
        setInterviewId(0)
    }

    const endPlay = () => {
        filterText(scripts[Math.ceil(((interviewId+1)/2)-1)])
        setInterviewId(interviewId+1)
        if(urls[interviewId+1] === undefined){
            $("#replay-ui").css({'display':'flex'})
            $("#question-selector").css({'display':'none'})
        }
    }

    const setQuestion = (num) => {
        setInterviewId(num*2)
    }

    const setQuestionId = (num) => {
        if(interviewId+num >= 0){
            if(num === -1){
                filterText(scripts[Math.ceil(((interviewId+1)/2)-2)])
                setInterviewId(interviewId+num)
                return
            }
        }
        if(interviewId+num <= urls.length-1){
            if(num === 1){
                filterText(scripts[Math.ceil(((interviewId+1)/2)-1)])
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
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ id: user.id , name: user.name, urls: [], script: [] })
        }
        fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${user.id}`, requestOptions )
            .then(response => console.log(response.json))
            .then(window.location.reload(false))
    }

    const filterText = text => {

        if (text !== undefined){
            const myArray = text.split(" ")
            const dict = {}
            const noComaArray = []
            const objArr = []
            myArray.forEach(el => {
                let arr = el.split(`'`)
                if(el.length > 3){
                    noComaArray.push(arr[arr.length-1])
                }
            })
            noComaArray.forEach(e => {
                let value = dict[e] === undefined ? 0 : dict[e]
                dict[e] = value+1
            })
        
            let unsorted = dict,
            sorted = _(unsorted)
                .toPairs()
                .orderBy(1, 'desc')
                .fromPairs()
                .value()
            
            for (const [key, value] of Object.entries(sorted)) {
                if(isNaN(parseInt(key))){
                    if(objArr.length < 10) {
                        objArr.push({key: key, num: value})
                    }
                }
            }
            setOccurence(objArr)
        }

    }


    
    return (
        <div className='no-scroll'>
            <div id="pop" className="popUp">
                <div className="popUp-text">Supprimer l'entretien de {user.name}?</div>
                <div className="popUp-btns">
                    <button id="ok" className='record-btn' onClick={() => Delete()}>Oui</button>
                    <button className='record-btn' onClick={() => ShowPopUp(false)}>Non</button>
                </div>
            </div>
            <div className='page-title-video'>Administrateur</div>
            <div id="question-selector" className="video-selector">
                <button className="select-btn" onClick={() => setQuestionId(-1)}>-</button>
                <p className='question-id'>{`${interviewId% 2 === 0 ? "Question" : "Réponse"} ${Math.ceil(((interviewId+1)/2)-1)+1}`}</p>
                <button className="select-btn" onClick={() => setQuestionId(1)}>+</button>
            </div>
            <div className='page-title-video'>
                <select className="dropMenu" onChange={() => updateUser()} name="users" id="users">
                    {users && users.map(user => <Option key={user.id} name={user.name} />)}
                </select>
            </div>
            <div className='btns-recording'>
                <button className='record-btn' id="delete" onClick={() => ShowPopUp(true)}>Supprimer l'entretien</button>
            </div>
            <div className="btn-wrapper">
                {interviewVideos.map((url, i) => <Button key={i} id={i} setQuestion={setQuestion} />) }
            </div>
            <div className='replay-container' id="replay-ui">
                <button className='startBtn' onClick={() => reload()}>Revoir</button>
            </div>
            <div id="player" className='video-container'>
                <VideoPlayer id="mainVideo" src={urls[interviewId]} end={endPlay} title={`Question ${Math.ceil(((interviewId+1)/2)-1)+1}`} />
            </div>
            {interviewId% 2 === 0 ? <div/> : 
            <div className="script-container">
                <div className="script-title">Transcription : </div>
                <div className="script-text">{scripts[Math.ceil(((interviewId+1)/2)-1)]}</div>
                <div className="script-title">Fréquence : </div>
                {occurence && occurence.map(occur => <li className="script-text" key={occur.key}><span className="bold">{occur.key}</span>{`: ${occur.num}`}</li>)}
            </div>}
        </div>
    )
}

export default Admin
