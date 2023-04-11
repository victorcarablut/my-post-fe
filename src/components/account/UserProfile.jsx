import { useEffect } from "react";
import { useParams } from "react-router-dom";


function UserProfile() {

    const {username} = useParams();

    useEffect(()=> {
        console.log(username);
     }, []);

  return (

    <div className="container-fluid">

                <div className="row">

                    <div className="col-xl-6" style={{ paddingBottom: 20 }}>

                        <div className="d-flex justify-content-center mb-3">
                            <div className="card container-fluid shadow" style={{ maxWidth: 500 }}>
                                <div className="card-body">
                                    <h6>Create Post</h6>
                                    

                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <div className="card container-fluid shadow" style={{ maxWidth: 500 }}>
                                <div className="card-body">
                                    This is some text within a card body.

                                </div>
                            </div>
                        </div>

                    </div>



                    <div className="col-xl-6" style={{ paddingBottom: 20 }}>

                        <div>



                            <div className="d-flex justify-content-center">
                                <div className="card container-fluid shadow" style={{ maxWidth: 600 }}>
                                    <div className="card-body">
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                                            <span className="badge text-bg-primary">Primary</span>
                                            <span className="badge text-bg-success">Success</span>
                                            <span className="badge text-bg-danger">Danger</span>
                                            <span className="badge text-bg-warning">Warning</span>
                                            <span className="badge text-bg-info">Info</span>
                                            <span className="badge text-bg-light">Light</span>
                                            <span className="badge text-bg-dark">Dar</span>
                                        </div>




                                        {/* {
                                            responseStatusGetAllPosts === "loading" ? <small>Loading...</small>
                                                :
                                                responseStatusGetAllPosts === "error" ? <small>Error</small>
                                                    :
                                                    responseStatusGetAllPosts === "success" ? <small>OK</small>
                                                        :
                                                        <></>
                                        } */}
                                    </div>
                                </div>
                            </div>



                                <div id="scrollbar-small" className="d-flex justify-content-center" style={{ overflow: "scroll", maxHeight: "800px", width: "auto", maxWidth: "auto", overflowX: "auto" }}>



                                    <table id="table" className="container-fluid">

                                        <tbody>

                                           



                                        </tbody>

                                    </table>
                                </div>


                            




                        </div>

                    </div>

                </div>

            </div>
  )
}

export default UserProfile;