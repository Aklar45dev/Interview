import $ from 'jquery'

const Button = (props) => {
    return (
        <button className="idBtn" onClick={() => props.setQuestion(props.id)}>{props.id+1}</button>
    )
}

export default Button
