export default function Button(props) {
    return (
        <button>{props.title} - {props.children}</button>

    );
}