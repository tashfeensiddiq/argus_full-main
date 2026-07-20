import React from 'react';
import { Link } from 'react-router-dom';
import Alert from "react-bootstrap/Alert";

function Overview({ match }) {
    const { path } = match;
    return (
        <div>
             <Alert variant="success">Admin </Alert>
            <p style={{ color:"white"}}>This section can only be accessed by administrators.</p>
            <p><Link to={`${path}/users`}><b>Manage Users</b></Link></p>
        </div>
    );
}

export { Overview };