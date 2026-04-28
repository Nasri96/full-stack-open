import { useState, useImperativeHandle } from "react";

const Togglable = ({ buttonName, children, ref }) => {
    const [visible, setVisible] = useState(false);

    const showWhenVisible = { display: visible ? "" : "none" };
    const hideWhenVisible = { display: visible ? "none" : "" };

    const toggleVisibility = () => {
      setVisible(!visible);
    }

    useImperativeHandle(ref, () => {
        return { toggleVisibility };
    })

    return (
        <div>
        <button style={hideWhenVisible} onClick={toggleVisibility}>{buttonName}</button>
        <div style={showWhenVisible}>
          {children}
        </div>
        
        <button style={showWhenVisible} onClick={toggleVisibility}>cancel</button>
      </div>
    )
}

export default Togglable;