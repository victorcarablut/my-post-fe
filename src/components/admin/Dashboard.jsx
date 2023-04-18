import Post from "../Post";

function Dashboard() {
    return (
        
        <div className="container-fluid d-flex justify-content-center">
            <div className="row row-cols-1 row-cols-md-2 g-3">
                <div className="col" style={{maxWidth: 400}}>
                    <div className="card">

                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div>
                <div className="col" style={{maxWidth: 400}}>
                    <div className="card">

                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div>
                <div className="col" style={{maxWidth: 400}}>
                    <div className="card">

                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Post filter="admin"/>
        </div>

        
    )
}

export default Dashboard;