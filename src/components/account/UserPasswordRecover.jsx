import React from 'react';

function UserPasswordRecover() {

  return (
    <>
    <div>UserPasswordRecover</div>

    <button type="button" className="btn btn-danger btn-sm rounded-pill fw-semibold shadow" data-bs-toggle="modal" data-bs-target="#passwordRecoverModal">Logout</button>

    {/* --- Modal (Update / Reset Password) --- */}
    <div className="modal fade" id="deleteEmployeeModal" tabIndex="-1" aria-labelledby="deleteEmployeeModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteEmployeeModalLabel">Delete Employee</h1>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger btn-sm rounded-pill shadow">Logout</button>
              <button type="button" className="btn btn-secondary btn-sm rounded-pill shadow" id='button-modal-submit-delete-employee-close' data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default UserPasswordRecover;