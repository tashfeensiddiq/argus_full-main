import React from 'react';
import { Link } from 'react-router-dom';
import Alert from "react-bootstrap/Alert";

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;

    return (
        <div alignItem="flex-end">
           <Alert variant="success"> My Profile </Alert>
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <p style={{ color:"white"}}>
                
                <strong>Name: </strong> {user.title} {user.firstName} {user.lastName}<br />
                <strong>Email: </strong> {user.email}
            </p>
            <p><Link to={`${path}/update`}><b>Update Profile</b></Link></p>
        </div>
    );
}

export { Details };