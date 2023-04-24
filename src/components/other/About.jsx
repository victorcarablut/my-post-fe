
function About() {
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center">

        <div className="card bg-transparent border-0" style={{ maxWidth: 500 }}>
          <div className="card-body">
            <h5 className="card-title">About</h5>
            <p className="card-text">Web App developed for demonstration purposes only.</p>
            <p className="card-text">The idea was to create an simple app like social media with the ability to create posts and interact with each other, it is still under development...</p>
          </div>
          <div className="card-footer bg-transparent border-0">
            <a className="btn btn-light rounded-pill btn-sm shadow" href="https://code.victorcarablut.com" target="_blank" rel="noreferrer"><small>Read More</small></a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default About;