import React, { Component } from 'react';


// Full width Loading
export class FullWidthLoading extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-1s animate__infinite" style={{ color: "#747d8c", letterSpacing: "1px" }}><small><i className="bi bi-info-circle" style={{ marginRight: "5px" }}></i>Loading...</small></p>
        )
    }
}


export class SmallLoading extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-1s animate__infinite" style={{ color: "#747d8c", letterSpacing: "1px" }}><small><i className="bi bi-info-circle" style={{ marginRight: "5px" }}></i>Loading...</small></p>
        )
    }
}







