import React from 'react';
import { Typography, Link } from '@material-ui/core'

export default function Home() {

    return (
        <div style={{ textAlign: 'center' }}>
            <Typography>Essential tools to start using Self Issued OpenID Connect Provider
                with Decentralised Identities (SIOP DID).
            
            <br />
                Visit <Link href="http://didsiop.org">didsiop.org</Link> for more information and resources.
                </Typography > 
            <br />
            
            <Typography>
                <b>Privacy Guaranteed</b> : When you are on this website,
                none of the info you see or generate does not leave your browser,
                meaning it is perfectly secure and safe to use these services.
            </Typography >

            <div style={{ display: "flex", minHeight: (window.innerHeight - 290), flexDirection: "column" }}></div>

            <Typography>
                <Link href="https://github.com/RadicalLedger/siop-tools-web">GitHub</Link>
                <br />
                <Link href="http://didsiop.org">www.didsiop.org</Link>
            </Typography>

        </div>
    )
}