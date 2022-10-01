import React from 'react';
import appLogo from "../../public/logo.webp"
import {Link} from "react-router-dom";


export default function ApplicationLogo({className}) {
    return (
        <Link className={className} to='tasks'>
            <img style={{height: '100%'}} src={appLogo} alt="Virtual Mistress"/>
        </Link>
    );
}
