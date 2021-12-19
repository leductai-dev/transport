import React, { useRef, useState } from 'react'
// import "../../styles.css";
import { app } from '../../firebaseConfig'
import { Box, Button, Text, Image } from 'rebass'
import axios from 'axios'
import './css.css'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import convertDate from '../../Utils/ConvertDate'

const DestinationIcon = new L.Icon({
    iconUrl: '/images/destination.png',
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
})
const DriverIcon = new L.Icon({
    iconUrl: '/png/teamLocation.png',
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

const ModalDriverDetail = ({ vehicle, driver, onClose, transaction }) => {
    const [center, setCenter] = useState([16.060392, 108.211847])
    const [timelineData, setTimeLineData] = useState(null)

    // console.log(transaction);
    // const { initialTime, note, shippingInfo, transportCode } = transaction;
    // const { height, weight, width, length, imageUrl, productName } =
    //     shippingInfo.productInfo;
    // const { receiver, sender } = shippingInfo;

    // const fromAdress =[transaction.shippingInfo.sender.lat, transaction.shippingInfo.sender.long]
    // const toAddress =[transaction.shippingInfo.receiver.lat, transaction.shippingInfo.receiver.long]
    // const currentLocation =[transaction.shippingInfo.driver.lat, transaction.shippingInfo.driver.long]
    const history = useHistory()
    const toRad = (Value) => {
        return (Value * Math.PI) / 180
    }
    const cacurlatorDistance = (lat1, lng1, lat2, lng2) => {
        var R = 6371 // km
        var dLat = toRad(lat2 - lat1)
        var dLon = toRad(lng2 - lng1)
        var lat1 = toRad(lat1)
        var lat2 = toRad(lat2)

        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        var distance = R * c
        return distance
    }
    useEffect(() => {
        console.log(driver)
        console.log(vehicle)
        console.log(transaction)
        const db_Transactions = app
            .database()
            .ref()
            .child(`/transactions`)
            .orderByChild('driverId')
            .equalTo(driver.driverId)

        db_Transactions.once('value', (snap) => {
            if (snap.val()) {
                const values = Object.values(snap.val()).filter(
                    (item) => item.status === 'inProgress'
                )
                const separatee = []
                for (const item of values) {
                    const { deliveryTime, ...item1 } = item
                    const { arrivalTime, ...item2 } = item
                    separatee.push(item1, item2)
                }
                const refresh = separatee.map((item) => {
                    if (
                        item.arrivalTime &&
                        new Date(item.arrivalTime).getTime() < new Date().getTime()
                    ) {
                        return {
                            ...item,
                            time: item.deliveryTime || item.arrivalTime,
                            isOver: true,
                        }
                    }
                    return { ...item, time: item.deliveryTime || item.arrivalTime, isOver: false }
                })
                refresh.sort((a, b) => {
                    return a.time - b.time
                })
                const calDistance = []
                for (let i = 0; i < refresh.length; i++) {
                    let beforeLat
                    let beforeLong
                    let currentLat
                    let currentLong
                    const arrivalLat = transaction.shippingInfo.sender.lat
                    const arrivalLong = transaction.shippingInfo.sender.long
                    const deliveryLat = transaction.shippingInfo.receiver.lat
                    const deliveryLong = transaction.shippingInfo.receiver.long

                    if (refresh[i].arrivalTime) {
                        currentLat = refresh[i].shippingInfo.sender.lat
                        currentLong = refresh[i].shippingInfo.sender.long
                    }
                    if (refresh[i].deliveryTime) {
                        currentLat = refresh[i].shippingInfo.receiver.lat
                        currentLong = refresh[i].shippingInfo.receiver.long
                    }

                    if (refresh[i - 1] && refresh[i - 1].arrivalTime) {
                        beforeLat = refresh[i - 1].shippingInfo.sender.lat
                        beforeLong = refresh[i - 1].shippingInfo.sender.long
                    }
                    if (refresh[i - 1] && refresh[i - 1].deliveryTime) {
                        beforeLat = refresh[i - 1].shippingInfo.receiver.lat
                        beforeLong = refresh[i - 1].shippingInfo.receiver.long
                    }
                    if (i === 0) {
                        beforeLat = driver.vehicleStatus.lat
                        beforeLong = driver.vehicleStatus.long
                    }
                    const currentVersusBefore = cacurlatorDistance(
                        beforeLat,
                        beforeLong,
                        currentLat,
                        currentLong
                    )
                    const currentVersusArrival = cacurlatorDistance(
                        currentLat,
                        currentLong,
                        arrivalLat,
                        arrivalLong
                    )
                    const currentVersusDelivery = cacurlatorDistance(
                        currentLat,
                        currentLong,
                        deliveryLat,
                        deliveryLong
                    )
                    const refreshItem = {
                        ...refresh[i],
                        currentVersusBefore: Math.round(currentVersusBefore * 10) / 10,
                        currentVersusBeforeTime: `${currentVersusBefore / 60}`,
                        currentVersusArrival: Math.round(currentVersusArrival * 10) / 10,
                        currentVersusArrivalTime: `${currentVersusArrival / 60}`,
                        currentVersusDelivery: Math.round(currentVersusDelivery * 10) / 10,
                        currentVersusDeliveryTime: `${currentVersusDelivery / 60}`,
                    }
                    calDistance.push(refreshItem)
                }
                console.log(calDistance)
                setTimeLineData(calDistance)
            }
        })
    }, [])

    const handleSendRequest = async () => {}

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
                    <Image sx={{ width: '23px', marginRight: '5px' }} src="/png/userLocation.png" />
                    Thông tin lịch trình
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
                        {driver &&  <Marker
                            eventHandlers={{
                                click: () => {
                                    // setShowTransactionInfo(true);
                                },
                            }}
                            icon={DriverIcon}
                            position={[driver.vehicleStatus.lat,driver.vehicleStatus.long]}
                        >
                            <Tooltip
                                direction="top"
                                maxWidth={10}
                                offset={[0, -45]}
                                opacity={1}
                            >
                                "Tooltip"
                            </Tooltip>
                        </Marker>}
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
                                borderBottom: '2px solid #d4d9df',
                                display: 'block',
                                width: '100%',
                                paddingBottom: '8px',
                            }}
                        >
                            Thông tin xe/người vận chuyển
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
                                Người vận chuyển: {driver?.name}
                            </Text>
                            <Text
                                as="p"
                                sx={{
                                    fontSize: '16px',
                                    color: '#000000',
                                    marginBottom: '10px',
                                }}
                            >
                                Số điện thoại: {driver?.phone}
                            </Text>
                            <Text
                                as="p"
                                sx={{
                                    fontSize: '16px',
                                    color: '#000000',
                                    marginBottom: '10px',
                                }}
                            >
                                Xe vận chuyển: {vehicle?.name}
                            </Text>
                            <Box mb={1} sx={{ display: 'flex' }}>
                                <Text
                                    as="p"
                                    sx={{
                                        minWidth: '320px',
                                        fontSize: '16px',
                                        color: '#000000',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Tải trọng hiện tại: 999 (kg)
                                </Text>
                                <Text
                                    as="p"
                                    sx={{
                                        fontSize: '16px',
                                        color: '#000000',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Tối đa: 2020 (kg)
                                </Text>
                            </Box>
                            <Box mb={1} sx={{ display: 'flex' }}>
                                <Text
                                    as="p"
                                    sx={{
                                        minWidth: '320px',
                                        fontSize: '16px',
                                        color: '#000000',
                                        marginBottom: '3px',
                                    }}
                                >
                                    Thể tích thùng chứa hiện tại: 2020 (kg)
                                </Text>
                                <Text
                                    as="p"
                                    sx={{
                                        fontSize: '16px',
                                        color: '#000000',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Tối đa: 999 (kg)
                                </Text>
                            </Box>
                            <Box py={2}>
                                <Button
                                    onClick={() => {
                                        handleSendRequest()
                                    }}
                                    sx={{ background: '#1b3a57', color: 'white' }}
                                >
                                    Chi tiết
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <div className="container mt-5 mb-5">
                        <Text
                            as="p"
                            sx={{
                                zIndex: 1,
                                width: 'fit-content',
                                color: '#1b3a57',
                                pr: '10px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginBottom: '27px',
                                borderBottom: '2px solid #d4d9df',
                                display: 'block',
                                width: '100%',
                                paddingBottom: '3px',
                            }}
                        >
                            Lịch trình xe
                        </Text>
                        {!timelineData && <Box sx={{
                            textAlign: 'center'
                        }} >Chưa có đơn hàng nào!</Box> }
                        {timelineData &&
                            timelineData.map((timeline, index) => (
                                <div className="row" key={index}>
                                    <div class="col col-3 tlleft offset-md-0 ">
                                        <Box
                                            sx={{
                                                fontSize: '21px',
                                                fontWeight: 600,
                                                color: '#1b3a57',
                                                fontFamily: 'revert',
                                            }}
                                        >
                                            <Box>
                                                {timeline.time &&
                                                    `${new Date(
                                                        timeline.time
                                                    ).toLocaleString()}`.split(',')[1]}
                                            </Box>
                                            <Box>{convertDate(timeline.time)}</Box>
                                        </Box>
                                    </div>
                                    <div class="col col-7 offset-md-0 pl-0">
                                        <ul className="timeline">
                                            <li className="timeline_li">
                                                <Box
                                                    sx={{
                                                        color: '#000000',
                                                        borderBottom: '2px solid #d4d9df',
                                                        paddingBottom: '20px',
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                color: ' #1b3a57',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Mã vận chuyển: {timeline.transportCode}
                                                        </Box>
                                                        {timeline.deliveryTime &&
                                                        timeline.isOver ? (
                                                            <Box
                                                                sx={{
                                                                    color: ' #fff',
                                                                    fontWeight: 400,
                                                                    fontSize: '12px',
                                                                    borderRadius: '5px',
                                                                    backgroundColor: '#154b7ccc',
                                                                    fontSize: '12px',
                                                                    padding: '0px 10px',
                                                                    lineHeight: '23px',
                                                                    fontFamily: 'monospace',
                                                                }}
                                                            >
                                                                Đã lấy hàng
                                                            </Box>
                                                        ) : timeline.deliveryTime ? (
                                                            <Box
                                                                sx={{
                                                                    color: ' #fff',
                                                                    fontWeight: 400,
                                                                    fontSize: '12px',
                                                                    borderRadius: '5px',
                                                                    backgroundColor: '#154b7ccc',
                                                                    fontSize: '12px',
                                                                    padding: '0px 10px',
                                                                    lineHeight: '23px',
                                                                    fontFamily: 'monospace',
                                                                }}
                                                            >
                                                                Đang giao...
                                                            </Box>
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    color: ' #fff',
                                                                    fontWeight: 400,
                                                                    fontSize: '12px',
                                                                    borderRadius: '5px',
                                                                    backgroundColor: '#154b7ccc',
                                                                    fontSize: '12px',
                                                                    padding: '0px 10px',
                                                                    lineHeight: '23px',
                                                                    fontFamily: 'monospace',
                                                                }}
                                                            >
                                                                Đang lấy...
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    <Box>
                                                        <Box>
                                                            {timeline.deliveryTime ? (
                                                                <img
                                                                    width="20px"
                                                                    className="mr-1"
                                                                    alt="vt"
                                                                    src="/png/destination.png"
                                                                />
                                                            ) : (
                                                                <img
                                                                    width="20px"
                                                                    className="mr-1"
                                                                    alt="vt"
                                                                    src="/png/userLocation.png"
                                                                />
                                                            )}
                                                            Vị trí:{' '}
                                                            {timeline.deliveryTime
                                                                ? timeline.shippingInfo.receiver
                                                                      .address
                                                                : timeline.shippingInfo.sender
                                                                      .address}
                                                        </Box>
                                                        <Box mt={2} mb={1} sx={{ display: 'flex' }}>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    minWidth: '220px',
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Tải trọng: 999 (kg)
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Còn lại: 2020 (kg)
                                                            </Text>
                                                        </Box>

                                                        <Box mb={1} sx={{ display: 'flex' }}>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    minWidth: '220px',
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Thể tích: 999 (kg)
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Còn lại: 2020 (kg)
                                                            </Text>
                                                        </Box>
                                                        <Box mb={1} sx={{ display: 'flex' }}>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    minWidth: '220px',
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Thùng chứa: 4.2 x 1.5 x 3 (m)
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Còn lại: 2020 (kg)
                                                            </Text>
                                                        </Box>
                                                        {timeline.currentVersusBeforeTime.indexOf(
                                                            '.'
                                                        ) && (
                                                            <Box
                                                                mb={1}
                                                                mt={2}
                                                                sx={{ display: 'flex' }}
                                                            >
                                                                <Text
                                                                    as="p"
                                                                    sx={{
                                                                        fontSize: '16px',
                                                                    }}
                                                                >
                                                                    -Cách điểm giao dịch gần nhất{' '}
                                                                    <Box
                                                                        as="span"
                                                                        sx={{
                                                                            color: '#1b3a57',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            timeline.currentVersusBefore
                                                                        }{' '}
                                                                        km
                                                                    </Box>{' '}
                                                                    xấp xỉ{' '}
                                                                    <Box
                                                                        as="span"
                                                                        sx={{
                                                                            color: '#1b3a57',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            timeline.currentVersusBeforeTime.split(
                                                                                '.'
                                                                            )[0]
                                                                        }{' '}
                                                                        giờ{' '}
                                                                        {Math.ceil(
                                                                            Number(
                                                                                `0.${
                                                                                    timeline.currentVersusBeforeTime.split(
                                                                                        '.'
                                                                                    )[1]
                                                                                }`
                                                                            ) * 60
                                                                        )}{' '}
                                                                        phút
                                                                    </Box>
                                                                </Text>
                                                            </Box>
                                                        )}
                                                        {timeline.currentVersusArrivalTime.indexOf(
                                                            '.'
                                                        ) && (
                                                            <Box mb={1} sx={{ display: 'flex' }}>
                                                                <Text
                                                                    as="p"
                                                                    sx={{
                                                                        fontSize: '16px',
                                                                    }}
                                                                >
                                                                    -Cách điểm lấy hàng hiện tại{' '}
                                                                    <Box
                                                                        as="span"
                                                                        sx={{
                                                                            color: '#1b3a57',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            timeline.currentVersusArrival
                                                                        }{' '}
                                                                        km
                                                                    </Box>{' '}
                                                                    xấp xỉ{' '}
                                                                    <Box
                                                                        as="span"
                                                                        sx={{
                                                                            color: '#1b3a57',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            timeline.currentVersusArrivalTime.split(
                                                                                '.'
                                                                            )[0]
                                                                        }{' '}
                                                                        giờ{' '}
                                                                        {Math.ceil(
                                                                            Number(
                                                                                `0.${
                                                                                    timeline.currentVersusArrivalTime.split(
                                                                                        '.'
                                                                                    )[1]
                                                                                }`
                                                                            ) * 60
                                                                        )}{' '}
                                                                        phút
                                                                    </Box>
                                                                </Text>
                                                            </Box>
                                                        )}
                                                        {timeline.currentVersusDeliveryTime.indexOf(
                                                            '.'
                                                        ) && (
                                                            <Box mb={1} sx={{ display: 'flex' }}>
                                                                <Text
                                                                    as="p"
                                                                    sx={{
                                                                        fontSize: '16px',
                                                                    }}
                                                                >
                                                                    -Cách điểm giao hàng hiện tại{' '}
                                                                    <Box
                                                                        as="span"
                                                                        sx={{
                                                                            color: '#1b3a57',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            timeline.currentVersusDelivery
                                                                        }{' '}
                                                                        km
                                                                    </Box>{' '}
                                                                    xấp xỉ{' '}
                                                                    <Box
                                                                        as="span"
                                                                        sx={{
                                                                            color: '#1b3a57',
                                                                            fontWeight: 600,
                                                                        }}
                                                                    >
                                                                        {
                                                                            timeline.currentVersusDeliveryTime.split(
                                                                                '.'
                                                                            )[0]
                                                                        }{' '}
                                                                        giờ{' '}
                                                                        {Math.ceil(
                                                                            Number(
                                                                                `0.${
                                                                                    timeline.currentVersusDeliveryTime.split(
                                                                                        '.'
                                                                                    )[1]
                                                                                }`
                                                                            ) * 60
                                                                        )}{' '}
                                                                        phút
                                                                    </Box>
                                                                </Text>
                                                            </Box>
                                                        )}

                                                        <Button
                                                            onClick={() => {
                                                                // handleSendRequest()
                                                            }}
                                                            sx={{
                                                                background: '#1b3a57',
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                padding: '1px 15px',
                                                                fontSize: '13px',
                                                                lineHeight: '26px',
                                                                fontFamily: 'monospace',
                                                                marginTop: '15px',
                                                            }}
                                                        >
                                                            Chi tiết
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <Box sx={{ color: '#1b3a57', display: 'flex', marginTop: '50px' }}>
                        <Box sx={{ color: '#1b3a57', fontWeight: 'bold', marginRight: '10px' }}>
                            *Ghi chú:
                        </Box>
                        <Box>
                            <Box
                                sx={{
                                    padding: 0,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}
                                pb={3}
                            >
                                <img
                                    width="20px"
                                    className="mr-1"
                                    alt="vt"
                                    src="/png/userLocation.png"
                                />
                                <Box sx={{ color: 'black', fontSize: '14px' }}>Vị trí kho hàng</Box>
                            </Box>
                            <Box
                                sx={{
                                    padding: 0,
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}
                                pb={3}
                            >
                                <img
                                    width="20px"
                                    className="mr-1"
                                    alt="vt"
                                    src="/png/destination.png"
                                />
                                <Box sx={{ color: 'black', fontSize: '14px' }}>
                                    Vị trí giao hàng
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                        py={3}
                    >
                        <Button
                            onClick={() => {
                                onClose()
                            }}
                            sx={{ background: '#1b3a57', color: 'white' }}
                        >
                            Quay lại
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
export default ModalDriverDetail
