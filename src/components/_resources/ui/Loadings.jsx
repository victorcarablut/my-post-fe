import React, { Component } from 'react';


export class LoadingFullScreen extends Component {
    render() {
        return (
            <div className="full-screen-loading">
                <div className="h-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }
}


export class LoadingSmall extends Component {
    render() {
        return (
            <p className="fs-6 text-center animate__animated animate__fadeIn animate__delay-1s animate__infinite" style={{ color: "#747d8c", letterSpacing: "1px" }}><small><i className="bi bi-info-circle" style={{ marginRight: "5px" }}></i>Loading...</small></p>
        )
    }
}







