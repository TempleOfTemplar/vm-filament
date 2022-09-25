import React from 'react';
import appLogo from "../../public/logo.webp"


export default function ApplicationLogo({className}) {
    return (
        <a className={className} href={route("tasks")}>
            <img style={{height: '100%'}} src={appLogo} alt="Virtual Mistress"/>
        </a>
    );
}
