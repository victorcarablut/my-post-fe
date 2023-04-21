import React, { Component } from 'react';


// Empty
export class Empty extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-2s" style={{ color: "#535c68", letterSpacing: "1px" }}><small>Empty</small></p>
        )
    }
}

// Success
export class Success extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-2s" style={{ color: "#2ed573", letterSpacing: "1px" }}><small>Executed successfully</small></p>
        )
    }
}

// Errors
export class Error extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-2s" style={{ color: "#ff4757", letterSpacing: "1px" }}><small>Error</small></p>
        )
    }
}



