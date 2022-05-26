import React, { useState, useEffect } from 'react'
import { storage } from './firebase'
import $ from 'jquery'
import { useRecordWebcam } from 'react-record-webcam'
import firebase from './firebase'
import videoUrls from './videoUrls'
import VideoPlayer from './components/VideoPlayer'
import useSpeechToText from 'react-hook-speech-to-text'

const Interview = () => {

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [urls, setUrls] = useState([])
    const [scripts, setScripts] = useState([])
    const [interviewId, setInterviewId] = useState(0)
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(true)
    const interviewVideos = videoUrls.interviewVideos 
        
    useEffect(() => {
        UpdateState()
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#start").css({'display':'none'})
        $("#stop").css({'display':'none'})
        $("#play").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#retake").css({'display':'none'})
        $("#end-ui").css({'display':'none'})
        $("#rec").css({'display':'none'})
        $("#recording").css({'display':'none'})
        $("#currentAnswer").css({'display':'none'})
        $("#start").css({'border': '2.5px solid rgb(0, 255, 0)', 'color': 'rgba(0, 255, 0, 1)'})
        $("#stop").css({'border': '2.5px solid rgb(255, 0, 0)', 'color': 'rgba(255, 0, 0, 1)'})
        $("#retake").css({'border': '2.5px solid rgb(255, 80, 0)', 'color': 'rgba(255, 80, 0, 1)'})
        $("#open").css({'border': '2.5px solid rgb(255, 80, 0)', 'color': 'rgba(255, 80, 0, 1)'})
        $("#upload").css({'border': '2.5px solid rgb(23, 169, 255)', 'color': 'rgba(23, 169, 255, 1)'})
    },[])

    const recordWebcam = useRecordWebcam()

    const CreateFile = async () => {
        $("#previous").css({'display':'inline'})
        $("#state").html('Preview')
        setPreview(false)
        $("#retake").css({'display':'inline'})
        $("#stop").css({'display':'none'})
        $("#burger-container").css({'display':'none'})
        $("#next").css({'display':'none'})
        $("#upload").css({'display':'inline'})
        $("#play").css({'display':'inline'})
        $("#next").css({'display':'inline'})
        $("#rec").css({'display':'none'})
        await recordWebcam.stop()
        const blob = await recordWebcam.getRecording()
        let filename = Math.floor(Math.random() * 1000000)
        const myFile = new File([blob], filename, {
            type: "video/mp4",
          })
        setFile(myFile)
        $("#recording").css({'display':'none'})
        $("#preview").css({'display':'block'})
        stopSpeechToText()
    }

    const UpdateState = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                //GET USER
                setEmail(user.email)
                fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${user.email}`)
                .then(response => response.json())
                .then(data => {
                setName(data.name)
                setUrls(data.urls)
                setScripts(data.script)
                })
            }
        })
    }

    const playPreview = () => {
        if(preview){
            document.getElementById("currentAnswer").play()
        }
        if(!preview){
            document.getElementById("preview").play()
        }
    }

    const stopPreview = () => {
        document.getElementById("preview").pause()
        document.getElementById("currentAnswer").pause()
    }

    const startCamera = () => {
        startSpeechToText()
        recordWebcam.start()
        $("#state").html('Enregistre')
        $("#previous").css({'display':'none'})
        $("#play").css({'display':'none'})
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#start").css({'display':'none'})
        $("#next").css({'display':'none'})
        $("#stop").css({'display':'inline'})
        $("#rec").css({'display':'inline'})
        $("#currentAnswer").css({'display':'none'})
    }

    const openCamera = () => {
        $("#state").html('Caméra')
        recordWebcam.open()
        $("#previous").css({'display':'none'})
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#start").css({'display':'inline'})
        $("#open").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#next").css({'display':'none'})
        $("#currentAnswer").css({'display':'none'})
        $("#play").css({'display':'none'})
        stopPreview()
    }

    const closeCamera = () => {
        recordWebcam.close()
        $("#previous").css({'display':'none'})
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#start").css({'display':'none'})
        $("#stop").css({'display':'none'})
        $("#play").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#retake").css({'display':'none'})
        $("#next").css({'display':'inline'})
        $("#open").css({'display':'inline'})
    }

    const retakeRecord = () => {
        $("#previous").css({'display':'none'})
        $("#state").html('Caméra')
        recordWebcam.retake()
        stopPreview()
        $("#recording").css({'display':'block'})
        $("#preview").css({'display':'none'})
        $("#retake").css({'display':'none'})
        $("#start").css({'display':'inline'})
        $("#play").css({'display':'none'})
        $("#upload").css({'display':'none'})
        $("#next").css({'display':'none'})
        $("#burger-container").css({'display':'flex'})
    }

    const endPlay = () => {
        if(urls[interviewId] !== undefined){
            setPreview(true)
            $("#previous").css({'display':'inline'})
            $("#play").css({'display':'inline'})
            $("#currentAnswer").css({'display':'flex'})
            $("#video-wrapper").css({'display':'none'})
            $("#recorder-container").css({'display':'block'})
            $("#question-selector").css({'display':'none'})
            document.getElementById("currentAnswer").play()
            $("#state").html('Replay')
        }
        if(urls[interviewId] === undefined){
            $("#video-wrapper").css({'display':'none'})
            $("#question-selector").css({'display':'none'})
            $("#recorder-container").css({'display':'block'})
            openCamera()
        }
    }

    const nextQuestion = (num) => {
        if(num === 0){
            document.getElementById("mainVideo").play()
        }
        closeCamera()
        setInterviewId(interviewId+num)
        document.getElementById("currentAnswer").pause()
        $("#currentAnswer").css({'display':'none'})
        $("#previous").css({'display':'none'})
        $("#question-selector").css({'display':'flex'})
        $("#video-wrapper").css({'display':'flex'})
        $("#recorder-container").css({'display':'none'})
        $("#recording").css({'display':'none'})
        $("#burger-container").css({'display':'flex'})
        if(interviewVideos[interviewId+num] === undefined){
            $("#end-ui").css({'display':'flex'})
            $("#video-wrapper").css({'display':'none'})
            $("#question-selector").css({'display':'none'})
        }
    }

    const handleUpload = () => {
            $("#state").html('Chargement...')
            $("#retake").css({'display':'none'})
            $("#play").css({'display':'none'})
            $("#next").css({'display':'none'})
            $("#upload").css({'display':'none'})
            $("#preview").css({'display':'none'})
            $("#currentAnswer").css({'display':'none'})
            $("#previous").css({'display':'none'})
            document.getElementById("currentAnswer").pause()
            const uploadTask = storage.ref(`uploads/${file.name}`).put(file)
            uploadTask.on(
                "state_changed",
                snapshot => {
                    let progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    )
                },
                error => {
                    console.log(error)
                },
                () => {
                    storage
                        .ref('uploads')
                        .child(file.name)
                        .getDownloadURL()
                        .then(url => {
                            let newUrls = urls
                            let newScripts = scripts
                            if(results[(results.length)-1] != undefined){
                                newScripts[interviewId] = results[(results.length)-1].transcript
                            } 
                            if (newUrls !== undefined){
                                newUrls[interviewId] = url
                            }
                            if (newUrls === undefined){
                                newUrls = [url]
                            }
                            //POST    
                            const requestOptions = {
                                method: 'POST',
                                body: JSON.stringify({ id: email, name: name, urls: newUrls, script: newScripts })
                            }
                            fetch(`https://tbtnq4ncg5.execute-api.us-east-2.amazonaws.com/Prod/interviews/${email}`, requestOptions)
                            $("#next").css({'display':'inline'})
                            nextQuestion(1)
                        })
                }
            )
    }

    const setQuestionId = (num) => {
        if(interviewId+num >= 0){
            if(num === -1){
                setInterviewId(interviewId+num)
                return
            }
        }
        if(interviewId+num <= interviewVideos.length-1){
            if(num === 1){
                setInterviewId(interviewId+num)
                return
            }
        }
    }

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        speechRecognitionProperties: {
            lang: 'fr-CA',
            interimResults: true
          },
        continuous: true,
        useLegacyResults: false
    })

    return (
        <div className='no-scroll'>
            <div className='page-title-video'>Enregistrement</div>
            <div id="question-selector" className="video-selector">
                <button className="select-btn" onClick={() => setQuestionId(-1)}>{`<`}</button>
                <p className='question-id'>{`Question ${interviewId+1}`}</p>
                <button className="select-btn" onClick={() => setQuestionId(1)}>{`>`}</button>
            </div>
            <VideoPlayer id="mainVideo" src={interviewVideos[interviewId]} end={endPlay} title={`Question ${interviewId+1}`} />
            <div id="recorder-container">
                <div className="script-response">{`Réponse ${interviewId+1}`}</div>
                <div className='btns-recording'>
                    <button className='switch-btn' id="previous" onClick={() => nextQuestion(0)}>{`<`}</button>
                    <button className='record-btn' id="play" onClick={() => playPreview()}>Jouer</button>
                    <button className='record-btn' id="open" onClick={() => openCamera()}>Caméra</button>
                    <button className='record-btn' id="start" onClick={() => startCamera()}>Enregistrer</button>
                    <button className='record-btn' id="upload" onClick={() => handleUpload()}>Save</button>
                    <button className='record-btn' id="retake" onClick={() => retakeRecord()}>Recommencer</button>
                    <button className='record-btn' id="stop" onClick={() => CreateFile()}>Arrêter</button>
                    <button className='switch-btn' id="next" onClick={() => nextQuestion(1)}>{`>`}</button>
                    <button id="rec" className="Rec button-rec">Recording</button>
                </div>
                <div id="state" className="state-label">Replay</div>
                <video id="recording" className="record-video-canvas" ref={recordWebcam.webcamRef} autoPlay muted/>
                <video id="preview" className="record-video-canvas" ref={recordWebcam.previewRef} autoPlay />
                <video id="currentAnswer" className="record-video-canvas" src={urls[interviewId]} />
            </div>
            <div className='replay-container' id="end-ui">
                <a className='startBtn' href='./interview'>Voir replay</a>
            </div>
        </div>
    )
}

export default Interview