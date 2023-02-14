import React, { Component } from 'react';

import {
    text_error_LoadData,
    text_info_Loading,
} from "./AlertText";


// Loading
export class Loading extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-1s animate__infinite" style={{ color: "#95afc0", letterSpacing: "1px" }}><small><i className="bi bi-info-circle" style={{ marginRight: "5px" }}></i>{text_info_Loading}</small></p>
        )
    }
}

// Success

//..........

// Errors
export class Error extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-2s" style={{ color: "#ff7979", letterSpacing: "1px" }}><small><i className="bi bi-exclamation-triangle" style={{ marginRight: "5px" }}></i>{text_error_LoadData}</small></p>
        )
    }
}



