import React, { Component } from 'react';




// Success

export class Success extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-2s" style={{ color: "#2ed573", letterSpacing: "1px" }}><small><i className="bi bi-exclamation-triangle" style={{ marginRight: "5px" }}></i>Executed successfully</small></p>
        )
    }
}

// Errors
export class Error extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-2s" style={{ color: "#ff4757", letterSpacing: "1px" }}><small><i className="bi bi-exclamation-triangle" style={{ marginRight: "5px" }}></i>Error</small></p>
        )
    }
}



