import React from 'react';
import { Typography, Link } from '@material-ui/core'
import logo from '../images/did_siop_logo.png'

export default function Home() {

    return (
        <div style={{ textAlign: 'center'}}>

            <img width={250} src={logo} alt="logo" />

            <Typography>Essential tools to start using Self Issued OpenID Connect Provider
                with Decentralised Identities (SIOP DID).
            
            <br />
                Visit <Link href="http://didsiop.org">didsiop.org</Link> for more information and resources.
                </Typography > 
            <br />
            
            <Typography>
                <b>Privacy Guaranteed</b><br/>When you are on this website,
                none of the info you see or generate does not leave your browser,
                meaning it is perfectly secure and safe to use these services.
            </Typography >

            <div style={{ display: "flex", minHeight: (window.innerHeight - 400), flexDirection: "column" }}></div>
            
            <Typography>
                <Link href="https://github.com/RadicalLedger/siop-tools-web">GitHub</Link>
                <br />
                <Link href="http://didsiop.org">www.didsiop.org</Link>
            </Typography>
            

        </div>
    )
}