import React, { useRef, useState } from 'react'
// import "../../styles.css";
import { app } from '../../firebaseConfig'
import { Box, Button, Text, Image } from 'rebass'
import axios from 'axios'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { Expo } from 'expo-server-sdk'

const DestinationIcon = new L.Icon({
    iconUrl: '/images/destination.png',
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
})
const DriverIcon = new L.Icon({
    iconUrl: '/images/teamLocation.png',
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
})
const InitialIcon = new L.Icon({
    iconUrl: '/images/userLocation.png',
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
})

const ModalDriverDetail = ({ transaction, onClose }) => {
    const [center, setCenter] = useState([16.060392, 108.211847])
    // console.log(transaction);
    // const { initialTime, note, shippingInfo, transportCode } = transaction;
    // const { height, weight, width, length, imageUrl, productName } =
    //     shippingInfo.productInfo;
    // const { receiver, sender } = shippingInfo;

    // const fromAdress =[transaction.shippingInfo.sender.lat, transaction.shippingInfo.sender.long]
    // const toAddress =[transaction.shippingInfo.receiver.lat, transaction.shippingInfo.receiver.long]
    // const currentLocation =[transaction.shippingInfo.driver.lat, transaction.shippingInfo.driver.long]
    useEffect(() => {
       
            const db_Transactions2 = app.database().ref().child(`/system/transactions/pending`).orderByChild('/initialTime').startAt(2).endAt(10000000000)
            db_Transactions2.on('value', (snap) => {
                console.log(snap.key)
                console.log(snap.val())
                
            })
                console.log("Done")
            
     
    }, [])

    const handleSendRequest = async () => {
        const EXPO_SERVER_URL = 'https://exp.host/--/api/v2/push/send'
        console.log('dsdqqqs11d')

        const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send'
        let data = {
            to: transaction.tokenId,
            title: 'title',
            body: 'message',
            sound: 'default',
            priority: 'high',
        }

        fetch(PUSH_ENDPOINT, {
            mode: 'no-cors',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).catch((err) => console.log(err))
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                boxShadow: '1px 1px 1px 1px black',
                width: '80%',
                height: '95vh',
                zIndex: 1000000,
                backgroundColor: '#fff',
                boxShadow: '1px 1px 6px 1px #00000085',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    padding: '5px 12px',
                    fontSize: '20px',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#eff0f3',
                }}
            >
                <Text
                    sx={{
                        marginRight: 'auto',
                        fontWeight: 700,
                        fontSize: '17px',
                    }}
                >
                    <Image
                        sx={{ width: '23px', marginRight: '5px' }}
                        src="/images/userLocation.png"
                    />
                    Mã giao dịch:
                </Text>
                <Text
                    sx={{
                        marginRight: '5px',
                        fontSize: '14px',
                        color: 'black',
                        fontWeight: 'bold',
                    }}
                >
                    Ngày khởi tạo:
                </Text>
                <Text sx={{ marginRight: '50px', fontSize: '15px' }}>15-10-2021</Text>
                <Button
                    sx={{
                        backgroundColor: 'transparent',
                        fontSize: '20px',
                        outline: 'none !important',
                        border: 'none',
                        color: 'black',
                        padding: 0,
                    }}
                    onClick={() => {
                        onClose()
                    }}
                >
                    X
                </Button>
            </Box>
            <Box
                sx={{
                    overflowY: 'auto',
                    flexGrow: 1,
                    backgroundColor: '#F7FAFC',
                    height: '100%',
                }}
            >
                <Box sx={{ height: '350px' }}>
                    <MapContainer
                        style={{
                            height: '100%',
                            width: '100%',
                            position: 'relative',
                            zIndex: '0',
                        }}
                        /*  center={location?location:center} */
                        center={center}
                        zoom={5}
                        scrollWheelZoom={true}
                    >
                        {/* <Marker
                            eventHandlers={{
                                click: () => {
                                    // setShowTransactionInfo(true);
                                },
                            }}
                            icon={InitialIcon}
                            position={fromAdress}
                        >
                            <Tooltip
                                direction="top"
                                maxWidth={10}
                                offset={[0, -45]}
                                opacity={1}
                            >
                                "Tooltip"
                            </Tooltip>
                        </Marker>
                        <Marker
                            onClick={() => {
                                // setShowTransactionInfo(true);
                            }}
                            icon={DestinationIcon}
                            position={toAddress}
                        >
                            <Tooltip
                                direction="top"
                                maxWidth={10}
                                offset={[0, -45]}
                                opacity={1}
                            >
                                "Tooltip"
                            </Tooltip>
                        </Marker>
                      */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </MapContainer>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        padding: '30px 30px 30px',
                    }}
                >
                    <Box sx={{ width: '100%', paddingRight: '10px' }}>
                        <Text
                            as="p"
                            sx={{
                                zIndex: 1,
                                width: 'fit-content',
                                color: '#1b3a57',
                                pr: '10px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginBottom: '15px',
                            }}
                        >
                            Thông tin các chuyến hàng
                        </Text>
                        <Box>
                            <Text
                                as="p"
                                sx={{
                                    fontSize: '16px',
                                    color: '#000000',
                                    marginBottom: '10px',
                                }}
                            >
                                Người vận chuyển:
                            </Text>
                            <Text
                                as="p"
                                sx={{
                                    fontSize: '16px',
                                    color: '#000000',
                                    marginBottom: '10px',
                                }}
                            >
                                Số điện thoại:
                            </Text>
                            <Text
                                as="p"
                                sx={{
                                    fontSize: '16px',
                                    color: '#000000',
                                    marginBottom: '10px',
                                }}
                            >
                                Thời gian lấy hàng dự kiến: 8 giờ 30. Ngày 22/12/2021
                            </Text>
                            <Text
                                as="p"
                                sx={{
                                    fontSize: '16px',
                                    color: '#000000',
                                    marginBottom: '10px',
                                }}
                            >
                                Thời gian nhận hàng dự kiến: 8 giờ 30. Ngày 22/12/2021
                            </Text>
                        </Box>
                    </Box>
                    <Box py={2}>
                        <Button
                            onClick={() => {
                                handleSendRequest()
                            }}
                            sx={{ background: 'blue', color: 'white' }}
                        >
                            Gửi yêu cầu
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
export default ModalDriverDetail
