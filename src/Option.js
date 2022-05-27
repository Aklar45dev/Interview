import $ from 'jquery'

const Option = (props) => {
        return (
            <option  className="dropMenu" value={props.name}>{props.name}</option>
        )
}

export default Option
