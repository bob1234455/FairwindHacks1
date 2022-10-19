import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Avatar,
    Center,
    Heading,
    Flex,
    FormControl,
    Text,
    Box,
    Select,
    FormErrorMessage,
    ModalHeader,
    Button,
} from '@chakra-ui/react';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';

import { getDoc, doc, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import bg from '../../assets/bg01.png';
import User from '../../assets/physicalHack.png';
import { useFirebase } from '../context/firebase';

interface ProfileMod {
    isOpen: boolean;
    onClose: () => void;
}

interface UserData {
    phno: string;
    email: string;
    district: string;
}

const districts = [
    { label: 'Thiruvananthapuram', value: 'Thiruvananthapuram' },
    { label: 'Kollam', value: 'Kollam' },
    { label: 'Pathanamthitta', value: 'Pathanamthitta' },
    { label: 'Kottayam', value: 'Kottayam' },
    { label: 'Alappuzha', value: 'Alappuzha' },
    { label: 'Idukki', value: 'Idukki' },
    { label: 'Ernakukam', value: 'Ernakukukam' },
    { label: 'Thrissur', value: 'Thrissur' },
    { label: 'Palakkad', value: 'Palakkad' },
    { label: 'Malappuram', value: 'Malappuram' },
    { label: 'Kozhikode', value: 'Kozhikode' },
    { label: 'Wayanad', value: 'Wayanad' },
    { label: 'Kannur', value: 'Kannur' },
    { label: 'Kozhikode', value: 'Kozhikode' },
    { label: 'Kannur', value: 'Kannur' },
    { label: 'Kasarkode', value: 'Kasarkode' },
    { label: 'other', value: 'other' },
];

export const ProfileModal = ({ isOpen, onClose }: ProfileMod) => {
    const { auth, db } = useFirebase();
    const [data, setData] = useState<UserData>({ phno: '', email: '', district: '' });
    const [user, setUser] = useState<DocumentSnapshot<DocumentData> | null>(null);

    const fetchCampus = async () => {
        const coll: [any] = [
            {
                label: 'Other',
                value: 'Other',
            },
        ];
        const req = await fetch(
            `https://us-central1-educational-institutions.cloudfunctions.net/getCollegeByDistrict?district=${data.district}`,
        );
        const res = await req.json();
        res.forEach((college: any) => {
            console.log(college.name);
            coll.push({ label: college.name, value: college.name });
        });
        return coll;
    };

    useEffect(() => {
        auth.onAuthStateChanged(async (authUser: any) => {
            if (!authUser) signInWithPopup(auth, new GithubAuthProvider());
            else {
                const snap = await getDoc(doc(db, `users/${authUser.uid}`));
                setUser(snap);
                setData({
                    phno: snap.get('phno'),
                    email: snap.get('email'),
                    district: snap.get('district') || '',
                });
                // setCampuses({ id: snap.get('campusID') || '', name: snap.get('campusName') || '' });
            }
        });
    }, [auth, db]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', lg: 'xl' }}>
            <ModalOverlay />
            <ModalContent
                borderRadius="10px"
                minWidth={{
                    base: 'full',
                    lg: 'container.md',
                }}
            >
                <ModalHeader
                    minHeight="200px"
                    borderTopRadius="10px"
                    backgroundImage={`
                    linear-gradient(180deg, rgba(12, 15, 23, 0) 67.85%, #0C0F17 100%),
                    linear-gradient(180deg, #0C0F17 0%, rgba(12, 15, 23, 0.8) 100%),
                    url(${bg}) `}
                >
                    <ModalCloseButton
                        padding="15px"
                        color="rgba(226, 76, 75, 1)"
                        border="2px solid rgba(226, 76, 75, 1)"
                        borderRadius="full"
                    />
                </ModalHeader>
                <ModalBody backgroundColor="#0C0F17" borderBottomRadius="10px">
                    <Center flexDirection="column" marginBlockStart="-120px">
                        <Avatar
                            src={User}
                            border="3px solid #DBF72C"
                            width="150px"
                            height="150px"
                        />
                        <Heading color="white" fontSize="40" fontFamily="Clash Display">
                            {user?.get('name')}
                        </Heading>
                        <Text
                            color="rgba(233, 229, 225, 1)"
                            fontFamily="Clash Display"
                            fontSize="18px"
                            opacity="0.5"
                        >
                            {user?.get('email')}
                        </Text>
                    </Center>
                    <Flex rowGap="30px" flexDirection="column" alignItems="stretch">
                        <Flex
                            flexDirection={{ base: 'column', lg: 'row' }}
                            columnGap="25px"
                            rowGap="25px"
                            justifyContent="space-between"
                            alignItems="center"
                            marginTop="25px"
                        >
                            <FormControl label="District" id="District">
                                <Select
                                    variant="filled"
                                    backgroundColor="rgba(255,255,255,0.15)"
                                    textColor="rgba(255,255,255,0.5)"
                                    iconColor="rgba(255,255,255,0.5)"
                                    height="45px"
                                    fontWeight="regular"
                                    transition="0.3s ease-in all"
                                    fontSize="16px"
                                    placeholder="Select District"
                                    fontFamily="Clash Display"
                                    _hover={{
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.15)',
                                    }}
                                    _focus={{
                                        border: '1px solid rgba(219, 247, 44, 0.15)',
                                    }}
                                >
                                    {districts.map((district) => (
                                        <option
                                            style={{
                                                padding: '10px',
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                                fontFamily: 'Clash Display',
                                                fontSize: '16px',
                                                fontWeight: 'regular',
                                            }}
                                            value={district.value}
                                        >
                                            {district.label}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>Please pick an District</FormErrorMessage>
                            </FormControl>
                            <FormControl label="Campus" id="campus">
                                <Select
                                    variant="filled"
                                    backgroundColor="rgba(255,255,255,0.15)"
                                    textColor="rgba(255,255,255,0.5)"
                                    iconColor="rgba(255,255,255,0.5)"
                                    height="45px"
                                    fontWeight="regular"
                                    transition="0.3s ease-in all"
                                    fontSize="16px"
                                    placeholder="Select Campus"
                                    fontFamily="Clash Display"
                                    _hover={{
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        boxShadow: '0px 2px 4px rgba(255, 255, 255, 0.15)',
                                    }}
                                    _focus={{
                                        border: '1px solid rgba(219, 247, 44, 0.15)',
                                    }}
                                >
                                    {districts.map((district) => (
                                        <option
                                            style={{
                                                padding: '10px',
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                                fontFamily: 'Clash Display',
                                                fontSize: '16px',
                                                fontWeight: 'regular',
                                            }}
                                            value={district.value}
                                        >
                                            {district.label}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>Please pick an District</FormErrorMessage>
                            </FormControl>
                        </Flex>

                        <Center paddingBlockEnd="30px">
                            <Button
                                width="250px"
                                backgroundColor="rgba(256, 256, 256, 0.15)"
                                fontSize="18px"
                                fontWeight="medium"
                                textColor="white"
                                height="45px"
                                transition=".5s all ease"
                                _hover={{
                                    boxShadow: '0px 8px 16px rgba(255, 255, 255, 0.15)',
                                    backgroundColor: '#DBF72C',
                                    textColor: '#0C0F17',
                                }}
                                _active={{
                                    textColor: '#DBF72C',
                                    background: 'rgba(219, 247, 44, 0.15)',
                                    boxShadow: '0px 8px 16px rgba(219, 247, 44, 0.15)',
                                    backdropFilter: 'blur(25px)',
                                }}
                            >
                                UPDATE PROFILE
                            </Button>
                        </Center>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
