import React, { useEffect, useState } from 'react';
import { CircularProgress, Text, VStack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { httpsCallable } from 'firebase/functions';
import { GithubAuthProvider, onAuthStateChanged, signInWithPopup, User } from 'firebase/auth';
import { useFirebase } from '../context/firebase';
import { getParams } from '../utils';

const Join = () => {
    const { eventID, teamID } = getParams(useLocation().search);
    const { auth, functions } = useFirebase();
    const [user, setUser] = useState<User | null | undefined>(null);
    const [status, setStatus] = useState({ state: 0, message: '' });
    useEffect(() => onAuthStateChanged(auth, setUser), [auth]);
    useEffect(() => {
        if (!eventID || !teamID)
            setStatus({ state: -1, message: 'TeamID and EventID are required.' });
        else if (status.state === 0 && user !== undefined) {
            if (user)
                httpsCallable(
                    functions,
                    'joinTeam',
                )({ teamID, eventID })
                    .then(() => setStatus({ state: 1, message: 'Done' }))
                    .catch((error) => setStatus({ state: -1, message: error.message }));
            else signInWithPopup(auth, new GithubAuthProvider());
        }
    }, [user, eventID, teamID, functions, status.state, auth]);
    return (
        <VStack
            justifyContent="center"
            alignItems="center"
            height="100vh"
            width="100vw"
            backgroundColor="#0C0F17"
        >
            {status.state === 0 && (
                <Text textAlign="center" fontFamily="Clash Display" fontSize="40px" color="white">
                    <CircularProgress isIndeterminate /> <br />
                    Joining Team
                </Text>
            )}
            {status.state === 1 && (
                <Text textAlign="center" fontFamily="Clash Display" fontSize="40px" color="white">
                    Team Joined <br />
                    <CheckCircleIcon />
                </Text>
            )}
            {status.state === -1 && (
                <Text textAlign="center" fontFamily="Clash Display" fontSize="40px" color="white">
                    {status.message} <br />
                    <CloseIcon />
                </Text>
            )}
        </VStack>
    );
};
export default Join;
