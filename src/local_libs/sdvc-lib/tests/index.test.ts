import { issue, present, verify, verifyVC, VC, verifyVcSignature, VP } from '../src/index'
import { resolveIdentity, blind } from "../src/utils";

const signerPrivateKey = '9dc1ab93350ff9968cccad367c0398b6d0d4b5eef1a29b0cf1900cf40095a96b'
const signerPublicKey = '03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6'
// const signerDID = 'did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1'
const holderPrivateKey = '66baa629b38919bcb5634ea18dd224a53bb2f1f97b3f752fe39eb6d654286843'
const holderPublicKey = '03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850'
// const holderDID = 'did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE'

const resolve = {
    privateKey: "6d759ec18d325537f75ec9018352dcd79058bb0c1a5fa21e001e75fdc2abe623",
    publicKey: "03d45232282f5b9965ed885fdddcffb797824f9629f5c966f0fedc69bc1d2614d1",
    did: "did:ethr:0x52E84b72d337AD76e21529C7E76E3549440b544d"
};

describe(
    'issue', function () {
        it('issue', async function () {
            const claims = { name: 'John Doe', birthday: '1989/04/01' }
            const result = issue(claims, signerPrivateKey, holderPublicKey);
            const expectedResult = {
                type: 'VerifiableCredential',
                issuer: {
                    did: 'did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1',
                    publicKey: '03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6'
                },
                subject: {
                    did: 'did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE',
                    publicKey: '03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850'
                },
                claims: { name: 'John Doe', birthday: '1989/04/01' },
                mask: {},
                proof: 'eyJzaWduYXR1cmUiOnsiMCI6MTA4LCIxIjo0MCwiMiI6MjEwLCIzIjoyMTYsIjQiOjE0NSwiNSI6NjcsIjYiOjI0LCI3IjoxMSwiOCI6NDQsIjkiOjIyNSwiMTAiOjM3LCIxMSI6MjAxLCIxMiI6MTQwLCIxMyI6MjQsIjE0IjoxMjksIjE1IjoxMzEsIjE2IjoxOCwiMTciOjk5LCIxOCI6MjcsIjE5Ijo5NiwiMjAiOjE5NCwiMjEiOjEwMiwiMjIiOjEzMywiMjMiOjE5OSwiMjQiOjIxMSwiMjUiOjE2LCIyNiI6MjM3LCIyNyI6MzYsIjI4Ijo5NSwiMjkiOjE2MiwiMzAiOjIxNCwiMzEiOjEwNCwiMzIiOjczLCIzMyI6MTA0LCIzNCI6NjQsIjM1IjoxNDIsIjM2IjoxMzEsIjM3IjoxNjIsIjM4IjoyMSwiMzkiOjQ2LCI0MCI6MjQ3LCI0MSI6NDYsIjQyIjoxNywiNDMiOjEzOSwiNDQiOjE1LCI0NSI6MjUsIjQ2IjoxMzgsIjQ3IjoxNTAsIjQ4IjoxMTQsIjQ5IjoxODgsIjUwIjoxOTMsIjUxIjoxOTMsIjUyIjo3NiwiNTMiOjExOSwiNTQiOjU3LCI1NSI6MTM5LCI1NiI6MjM0LCI1NyI6ODQsIjU4IjoxNDgsIjU5IjoxODAsIjYwIjo4OCwiNjEiOjIwNSwiNjIiOjkxLCI2MyI6MTQzfSwicmVjaWQiOjF9'
            }
            expect(result).toEqual(expectedResult);
        })
    }
);

describe(
    'present', function () {
        it('present', async function () {
            const cred: Array<VC> = [
                {
                    issuer: {
                        did: 'did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1',
                        publicKey: '03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6'
                    },
                    subject: {
                        did: 'did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE',
                        publicKey: '03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850'
                    },
                    type: 'VerifiableCredential',
                    claims: { name: 'kauam', age: '23' },
                    proof: 'eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9'
                },
                {
                    issuer: {
                        did: 'did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1',
                        publicKey: '03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6'
                    },
                    subject: {
                        did: 'did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE',
                        publicKey: '03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850'
                    },
                    type: 'VerifiableCredential',
                    claims: { name: 'kauam', age: '23' },
                    proof: 'eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9'
                }
            ];
            const masks = [{ name: true, age: true }, { name: true, age: false }];
            const result: VP = await present(cred, masks, holderPrivateKey);
            expect(result).toBeTruthy();
        })
    }
);


describe(
    'verify', function () {
        it('valid presentation verification', async function () {
            const presentation:VP = {
                subject: {
                    did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                    publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                },
                type: "VerifiablePresentation",
                credentials: [
                    {
                        issuer: {
                            did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                            publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                        },
                        subject: {
                            did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                            publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                        },
                        type: "VerifiableCredential",
                        claims: {
                            "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d",
                            "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": "e507e6e7dd4e28f9b6703de721f598d3fd7bb8a9efbb388c3eb7e7aa04c861ae"
                        },
                        proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                        mask: {
                            "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true,
                            "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": true
                        }
                    },
                    {
                        issuer: {
                            did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                            publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                        },
                        subject: {
                            did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                            publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                        },
                        type: "VerifiableCredential",
                        claims: {
                            "age": "23",
                            "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d"
                        },
                        proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                        mask: {
                            "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true
                        }
                    }
                ],
                proof: "eyJzaWduYXR1cmUiOnsiMCI6MjM2LCIxIjoxOTQsIjIiOjE1NSwiMyI6MTQwLCI0IjoyMDQsIjUiOjc4LCI2IjoyMjMsIjciOjc0LCI4IjoxMDUsIjkiOjE5OSwiMTAiOjI1MSwiMTEiOjM5LCIxMiI6MTMwLCIxMyI6NDksIjE0IjozMCwiMTUiOjIxMCwiMTYiOjMxLCIxNyI6MjA4LCIxOCI6NzEsIjE5Ijo3MCwiMjAiOjIyMSwiMjEiOjUzLCIyMiI6MTM3LCIyMyI6OTksIjI0Ijo4OSwiMjUiOjE0OSwiMjYiOjE0MywiMjciOjgyLCIyOCI6MTcxLCIyOSI6NTQsIjMwIjoxODIsIjMxIjoxNzcsIjMyIjoxMDUsIjMzIjoxODEsIjM0Ijo1NiwiMzUiOjE4NSwiMzYiOjg5LCIzNyI6MjA1LCIzOCI6NTksIjM5IjoxMjcsIjQwIjozNCwiNDEiOjIyNiwiNDIiOjE1MiwiNDMiOjE2NywiNDQiOjI1MywiNDUiOjE2OCwiNDYiOjE1OSwiNDciOjg4LCI0OCI6MjM0LCI0OSI6MTY0LCI1MCI6NjcsIjUxIjo0LCI1MiI6MTM3LCI1MyI6MTUwLCI1NCI6MjEwLCI1NSI6MTA0LCI1NiI6MjUsIjU3Ijo5MiwiNTgiOjU1LCI1OSI6MTcwLCI2MCI6OTMsIjYxIjoxNjAsIjYyIjoyNiwiNjMiOjEyNX0sInJlY2lkIjowfQ"
            }

            let result

            try {
                result = await verify(presentation, [signerPublicKey], holderPublicKey);
            } catch (error) {
                //
            } finally {
                expect(result).toBe(true)
            }
        }),

            it('presentation with invalid presentation proof verification', async function () {
                const presentation:VP = {
                    subject: {
                        did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                        publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                    },
                    type: "VerifiablePresentation",
                    credentials: [
                        {
                            issuer: {
                                did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                                publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                            },
                            subject: {
                                did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                                publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                            },
                            type: "VerifiableCredential",
                            claims: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d",
                                "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": "e507e6e7dd4e28f9b6703de721f598d3fd7bb8a9efbb388c3eb7e7aa04c861ae"
                            },
                            proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                            mask: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true,
                                "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": true
                            }
                        },
                        {
                            issuer: {
                                did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                                publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                            },
                            subject: {
                                did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                                publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                            },
                            type: "VerifiableCredential",
                            claims: {
                                "age": "23",
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d"
                            },
                            proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                            mask: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true
                            }
                        }
                    ],
                    proof: "eyJzaWduYXR1cmUiOnsiMCI6MjM2LCIyIjoxOTQsIjIiOjE1NSwiMyI6MTQwLCI0IjoyMDQsIjUiOjc4LCI2IjoyMjMsIjciOjc0LCI4IjoxMDUsIjkiOjE5OSwiMTAiOjI1MSwiMTEiOjM5LCIxMiI6MTMwLCIxMyI6NDksIjE0IjozMCwiMTUiOjIxMCwiMTYiOjMxLCIxNyI6MjA4LCIxOCI6NzEsIjE5Ijo3MCwiMjAiOjIyMSwiMjEiOjUzLCIyMiI6MTM3LCIyMyI6OTksIjI0Ijo4OSwiMjUiOjE0OSwiMjYiOjE0MywiMjciOjgyLCIyOCI6MTcxLCIyOSI6NTQsIjMwIjoxODIsIjMxIjoxNzcsIjMyIjoxMDUsIjMzIjoxODEsIjM0Ijo1NiwiMzUiOjE4NSwiMzYiOjg5LCIzNyI6MjA1LCIzOCI6NTksIjM5IjoxMjcsIjQwIjozNCwiNDEiOjIyNiwiNDIiOjE1MiwiNDMiOjE2NywiNDQiOjI1MywiNDUiOjE2OCwiNDYiOjE1OSwiNDciOjg4LCI0OCI6MjM0LCI0OSI6MTY0LCI1MCI6NjcsIjUxIjo0LCI1MiI6MTM3LCI1MyI6MTUwLCI1NCI6MjEwLCI1NSI6MTA0LCI1NiI6MjUsIjU3Ijo5MiwiNTgiOjU1LCI1OSI6MTcwLCI2MCI6OTMsIjYxIjoxNjAsIjYyIjoyNiwiNjMiOjEyNX0sInJlY2lkIjowfQ"
                }

                let result

                try {
                    result = await verify(presentation, [signerPublicKey], holderPublicKey);
                } catch (error) {
                    //
                } finally {
                    expect(result).not.toBe(true)
                }
            }),

            it('presentation with invalid credential proof verification', async function () {
                const presentation:VP = {
                    subject: {
                        did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                        publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                    },
                    type: "VerifiablePresentation",
                    credentials: [
                        {
                            issuer: {
                                did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                                publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                            },
                            subject: {
                                did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                                publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                            },
                            type: "VerifiableCredential",
                            claims: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d",
                                "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": "e507e6e7dd4e28f9b6703de721f598d3fd7bb8a9efbb388c3eb7e7aa04c861ae"
                            },
                            proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLC1xIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                            mask: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true,
                                "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": true
                            }
                        },
                        {
                            issuer: {
                                did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                                publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                            },
                            subject: {
                                did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                                publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                            },
                            type: "VerifiableCredential",
                            claims: {
                                "age": "23",
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d"
                            },
                            proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                            mask: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true
                            }
                        }
                    ],
                    proof: "eyJzaWduYXR1cmUiOnsiMCI6MjM2LCIxIjoxOTQsIjIiOjE1NSwiMyI6MTQwLCI0IjoyMDQsIjUiOjc4LCI2IjoyMjMsIjciOjc0LCI4IjoxMDUsIjkiOjE5OSwiMTAiOjI1MSwiMTEiOjM5LCIxMiI6MTMwLCIxMyI6NDksIjE0IjozMCwiMTUiOjIxMCwiMTYiOjMxLCIxNyI6MjA4LCIxOCI6NzEsIjE5Ijo3MCwiMjAiOjIyMSwiMjEiOjUzLCIyMiI6MTM3LCIyMyI6OTksIjI0Ijo4OSwiMjUiOjE0OSwiMjYiOjE0MywiMjciOjgyLCIyOCI6MTcxLCIyOSI6NTQsIjMwIjoxODIsIjMxIjoxNzcsIjMyIjoxMDUsIjMzIjoxODEsIjM0Ijo1NiwiMzUiOjE4NSwiMzYiOjg5LCIzNyI6MjA1LCIzOCI6NTksIjM5IjoxMjcsIjQwIjozNCwiNDEiOjIyNiwiNDIiOjE1MiwiNDMiOjE2NywiNDQiOjI1MywiNDUiOjE2OCwiNDYiOjE1OSwiNDciOjg4LCI0OCI6MjM0LCI0OSI6MTY0LCI1MCI6NjcsIjUxIjo0LCI1MiI6MTM3LCI1MyI6MTUwLCI1NCI6MjEwLCI1NSI6MTA0LCI1NiI6MjUsIjU3Ijo5MiwiNTgiOjU1LCI1OSI6MTcwLCI2MCI6OTMsIjYxIjoxNjAsIjYyIjoyNiwiNjMiOjEyNX0sInJlY2lkIjowfQ"
                }

                let result

                try {
                    result = await verify(presentation, [signerPublicKey], holderPublicKey);
                } catch (error) {
                    //
                } finally {
                    expect(result).not.toBe(true)
                }
            }),
            it('invalid public key presentation verification', async function () {
                const presentation:VP = {
                    subject: {
                        did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                        publicKey: "03aa8d88beaedd8df8930724552e995af3763a58d3d8e975215ea71313b0fa1850"
                    },
                    type: "VerifiablePresentation",
                    credentials: [
                        {
                            issuer: {
                                did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                                publicKey: "03471e2ccf5b4d56a07bc94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                            },
                            subject: {
                                did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                                publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                            },
                            type: "VerifiableCredential",
                            claims: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d",
                                "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": "e507e6e7dd4e28f9b6703de721f598d3fd7bb8a9efbb388c3eb7e7aa04c861ae"
                            },
                            proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                            mask: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true,
                                "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": true
                            }
                        },
                        {
                            issuer: {
                                did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                                publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                            },
                            subject: {
                                did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                                publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                            },
                            type: "VerifiableCredential",
                            claims: {
                                "age": "23",
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d"
                            },
                            proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                            mask: {
                                "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true
                            }
                        }
                    ],
                    proof: "eyJzaWduYXR1cmUiOnsiMCI6MjM2LCIxIjoxOTQsIjIiOjE1NSwiMyI6MTQwLCI0IjoyMDQsIjUiOjc4LCI2IjoyMjMsIjciOjc0LCI4IjoxMDUsIjkiOjE5OSwiMTAiOjI1MSwiMTEiOjM5LCIxMiI6MTMwLCIxMyI6NDksIjE0IjozMCwiMTUiOjIxMCwiMTYiOjMxLCIxNyI6MjA4LCIxOCI6NzEsIjE5Ijo3MCwiMjAiOjIyMSwiMjEiOjUzLCIyMiI6MTM3LCIyMyI6OTksIjI0Ijo4OSwiMjUiOjE0OSwiMjYiOjE0MywiMjciOjgyLCIyOCI6MTcxLCIyOSI6NTQsIjMwIjoxODIsIjMxIjoxNzcsIjMyIjoxMDUsIjMzIjoxODEsIjM0Ijo1NiwiMzUiOjE4NSwiMzYiOjg5LCIzNyI6MjA1LCIzOCI6NTksIjM5IjoxMjcsIjQwIjozNCwiNDEiOjIyNiwiNDIiOjE1MiwiNDMiOjE2NywiNDQiOjI1MywiNDUiOjE2OCwiNDYiOjE1OSwiNDciOjg4LCI0OCI6MjM0LCI0OSI6MTY0LCI1MCI6NjcsIjUxIjo0LCI1MiI6MTM3LCI1MyI6MTUwLCI1NCI6MjEwLCI1NSI6MTA0LCI1NiI6MjUsIjU3Ijo5MiwiNTgiOjU1LCI1OSI6MTcwLCI2MCI6OTMsIjYxIjoxNjAsIjYyIjoyNiwiNjMiOjEyNX0sInJlY2lkIjowfQ"
                }
    
                let result
    
                try {
                    result = await verify(presentation, [signerPublicKey], holderPublicKey);
                } catch (error) {
                    //
                } finally {
                    expect(result).not.toBe(true)
                }
            })
    }
);

describe(
    'blind', function () {
        it('issue', async function () {
            const r1 = blind('name', '03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850');
            const r2 = blind('age', '03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850');
            expect(r1).not.toEqual(r2)
        })
    }
);

describe(
    'resolve', function () {
        it('resolve', async function () {
            let response
            try {
                response = await resolveIdentity(resolve.did, resolve.publicKey)
            } catch (error) {
                //
            } finally {
                expect(response).toBeTruthy()
            }
        })
    }
);

describe(
    'verifySignature', function () {
        it('verifySignatureTruthy', async function () {
            let result;
            try {
                const vc: VC = await issue({ name: 'jayampathi', age: '24' }, signerPrivateKey, holderPublicKey);
                result = await verifyVcSignature({ name: 'jayampathi', age: '24' }, {}, vc.proof, signerPublicKey, holderPublicKey);

            } catch (error) {
                //
            } finally {
                expect(result).toBeTruthy()
            }

        });
        it('verifySignatureFalsy', async function () {
            let result;
            try {
                const vc: VC = await issue({ name: 'jayampathi', age: '24' }, signerPrivateKey, holderPublicKey);
                result = await verifyVcSignature({ name: 'jayampathi', age: '25' }, {}, vc.proof, signerPublicKey, holderPublicKey);
            } catch (error) {
                //
            } finally {
                expect(result).not.toBe(true)
            }
        });
        it('verifySignatureFalsy2', async function () {

            let result;
            try {
                const vc: VC = await issue({ name: 'jayampathi', age: '24' }, signerPrivateKey, holderPublicKey);
                result = await verifyVcSignature({ name: 'jayampathi', age: '24' }, {}, vc.proof, holderPublicKey, signerPublicKey);
            } catch (error) {
                //
            } finally {
                expect(result).not.toBe(true)
            }
        })
    }
);

describe(
    'verifyVC', function () {
        it('verifyVC', async function () {
            const vc:VC = {
                issuer: {
                    did: "did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1",
                    publicKey: "03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6"
                },
                subject: {
                    did: "did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE",
                    publicKey: "03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850"
                },
                type: "VerifiableCredential",
                claims: {
                    "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": "47c58d2ac733076928af528f99deb1298d6605075d4975e57bcf34391cb9ea9d",
                    "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": "e507e6e7dd4e28f9b6703de721f598d3fd7bb8a9efbb388c3eb7e7aa04c861ae"
                },
                proof: "eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsIjIiOjMzLCIzIjoxNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9",
                mask: {
                    "0ad591ac30e9cbe9b14342d04b952c1d1802303d7b8a6125ca4159ff16224858": true,
                    "b525b94765750d0bf71160375cc403d9d5b192ca3aec7804fb7bf47712e3dffd": true
                }
            }

            let result

            try {
                result = await verifyVC(vc, signerPublicKey, holderPublicKey);
            } catch (error) {
                //
            } finally {
                expect(result).toBe(true)
            }
        });

        it('verifyVCFalse', async function () {
            const vc:VC = {
                issuer: {
                    did: 'did:ethr:0x9311696ae51f30B9526675f8a4cb5D619fA0A7E1',
                    publicKey: '03471e2ccf5b4d56a07bb94bf5d26d410a1a283d3b366b30d4b9f8fbcf84b633e6'
                },
                subject: {
                    did: 'did:ethr:0x558c6058B6C86f31558Ffbf8A0EF5be778D904DE',
                    publicKey: '03aa8d88beaedd8df8930734552e995af3763a58d3d8e975215ea71313b0fa1850'
                },
                type: 'VerifiableCredential',
                claims: { name: 'kauam', age: '23' },
                proof: 'eyJzaWduYXR1cmUiOnsiMCI6MjUxLCIxIjoyNDcsljIiOjMzLCIzIj0xNTUsIjQiOjEyOCwiNSI6MjI3LCI2Ijo1NSwiNyI6MTMyLCI4IjoyNDMsIjkiOjE4MSwiMTAiOjE0NCwiMTEiOjIsIjEyIjozNSwiMTMiOjIxMSwiMTQiOjI1MSwiMTUiOjE3NiwiMTYiOjU5LCIxNyI6MTM1LCIxOCI6ODgsIjE5IjoxMjEsIjIwIjoyMTksIjIxIjoxODEsIjIyIjoxODQsIjIzIjoyMzYsIjI0Ijo5MCwiMjUiOjE3MywiMjYiOjE2MSwiMjciOjI4LCIyOCI6NSwiMjkiOjExOSwiMzAiOjEyMCwiMzEiOjIzNywiMzIiOjEyNywiMzMiOjIwMSwiMzQiOjIyMCwiMzUiOjExLCIzNiI6MjM4LCIzNyI6MTQwLCIzOCI6MjAsIjM5Ijo1NywiNDAiOjg5LCI0MSI6MjIxLCI0MiI6MTA1LCI0MyI6MjAsIjQ0IjozMCwiNDUiOjkyLCI0NiI6NDMsIjQ3Ijo4LCI0OCI6NjcsIjQ5IjoxMTgsIjUwIjoxODYsIjUxIjoxNzUsIjUyIjoxODksIjUzIjo3NywiNTQiOjE1NiwiNTUiOjI1MiwiNTYiOjEwLCI1NyI6MjE4LCI1OCI6NTcsIjU5IjozMCwiNjAiOjI1MCwiNjEiOjEyNCwiNjIiOjQ2LCI2MyI6MjQ1fSwicmVjaWQiOjB9'
            }

            let result

            try {
                result = await verifyVC(vc, signerPublicKey, holderPublicKey);
            } catch (error) {
                //
            } finally {
                expect(result).not.toBe(true)
            }
        });
    }
);
