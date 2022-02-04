import React from 'react'

const Button = ({src, text, fct, textFinal}) => {

    const updateSrc = () => {
        fct(src, textFinal)
    }
    
    return (
        <button onClick={() => updateSrc(src)} className='validateQuestionBtn'>{text}</button>
    )
}

export default Button
