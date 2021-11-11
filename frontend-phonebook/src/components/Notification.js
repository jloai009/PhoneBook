import React from "react";

const Notification = ({ message, isError }) => {
    if (message === null) {
        return null
    }

    const style = {
        color: 'blue',
        background: 'lightgray',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: 300,
    }

    if (isError) {
        style.color = 'red'
    }

    return (
        <div style={style} className="notification">
            {message}
        </div>
    )
}

export default Notification