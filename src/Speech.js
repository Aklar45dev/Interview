import React from 'react';
import useSpeechToText from 'react-hook-speech-to-text';

const Speech = () => {

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

    console.log(results)

    if (error) return <p className="question-id">Web Speech API is not available in this browser 🤷‍</p>

    return (
        <div>
            <button className='startBtn' onClick={isRecording ? stopSpeechToText : startSpeechToText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <ul>
                {results.map((result) => (
                <li className="question-id" key={result.timestamp}>{result.transcript}</li>
                ))}
                {interimResult && <li className="question-id">{interimResult}</li>}
            </ul>
        </div>
    )
}

export default Speech