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
    iconUrl: '/png/destination.png',
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
    iconUrl: '/png/userLocation.png',
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
})

const ModalDriverDetail = ({ vehicle, driver, onClose, transaction }) => {
    const [center, setCenter] = useState([16.060392, 108.211847])
    const [timelineData, setTimeLineData] = useState(null)
    const [open, setOpen] = useState(false)
    const [suggestRoutes, setSuggestRoutes] = useState(null)

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
    const handleShowHide = (time) => {
        const newTimeLine = timelineData.map((timeline) => {
            if (timeline.time === time) {
                return { ...timeline, isShow: !timeline.isShow }
            }
            return timeline
        })

        setTimeLineData(newTimeLine)
    }
    useEffect(() => {
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
                    if (item.arrivalTime) {
                        return {
                            ...item,
                            time: item.deliveryTime || item.arrivalTime,
                            location: item.shippingInfo.receiver,
                        }
                    }
                    return {
                        ...item,
                        time: item.deliveryTime || item.arrivalTime,
                        location: item.shippingInfo.sender,
                    }
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
                    let payload = 0
                    let width = 0
                    let length = 0
                    let height = 0

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
                    if (refresh[i - 1] && refresh[i].arrivalTime) {
                        width = calDistance[i - 1].width + refresh[i].shippingInfo.productInfo.width
                        length =
                            calDistance[i - 1].length + refresh[i].shippingInfo.productInfo.length
                        height =
                            calDistance[i - 1].height + refresh[i].shippingInfo.productInfo.height
                        payload =
                            calDistance[i - 1].payload + refresh[i].shippingInfo.productInfo.weight
                    }
                    if (refresh[i - 1] && refresh[i].deliveryTime) {
                        width = calDistance[i - 1].width - refresh[i].shippingInfo.productInfo.width
                        length =
                            calDistance[i - 1].length - refresh[i].shippingInfo.productInfo.length
                        height =
                            calDistance[i - 1].height - refresh[i].shippingInfo.productInfo.height
                        payload =
                            calDistance[i - 1].payload - refresh[i].shippingInfo.productInfo.weight
                    }

                    if (i === 0) {
                        beforeLat = driver.vehicleStatus.lat
                        beforeLong = driver.vehicleStatus.long
                        width = refresh[i].shippingInfo.productInfo.width
                        length = refresh[i].shippingInfo.productInfo.length
                        height = refresh[i].shippingInfo.productInfo.height
                        payload = refresh[i].shippingInfo.productInfo.weight
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
                        width,
                        length,
                        height,
                        payload,
                        currentVersusBefore: Math.round(currentVersusBefore * 10) / 10,
                        currentVersusBeforeTime: `${currentVersusBefore / 60}`,
                        currentVersusArrival: Math.round(currentVersusArrival * 10) / 10,
                        currentVersusArrivalTime: `${currentVersusArrival / 60}`,
                        currentVersusDelivery: Math.round(currentVersusDelivery * 10) / 10,
                        currentVersusDeliveryTime: `${currentVersusDelivery / 60}`,
                        isShow: false,
                    }
                    calDistance.push(refreshItem)
                }
                setTimeLineData(calDistance)
            }
        })
    }, [])

    const handleSendRequest = async () => {}
    useEffect(() => {
        findAppropriate()
    }, [])
    const findAppropriate = () => {
        if (!driver) return

        const db_Transactions = app
            .database()
            .ref()
            .child(`/transactions`)
            .orderByChild('driverId')
            .equalTo(driver.driverId)
        db_Transactions.once('value', (snap) => {
            let transactionInProgressList = []
            if (snap.val()) {
                transactionInProgressList = Object.values(snap.val()).filter(
                    (item) => item.status === 'inProgress'
                )
                transactionInProgressList.push(transaction)
                const distanceReturn = totalDistance(transactionInProgressList, driver)
                const distance = distanceReturn[1]
                const path = 'Driver' + distanceReturn[0]
                const transferPath = []
                const b = path.split('---')
                console.log(b)
                for (let i = 0; i < b.length; i += 2) {
                    if (i === 0) continue
                    transferPath.push({ distance: b[i - 1], point: b[i] })
                }
                const transferDistance = []
                for (let i = 0; i < transferPath.length; i++) {
                    if (transferPath[i + 1]) {
                        const distance =
                            Number(transferPath[i].distance) - Number(transferPath[i + 1].distance)
                        transferDistance.push({ distance, point: transferPath[i].point })
                    } else {
                        transferDistance.push({
                            distance: Number(transferPath[i].distance),
                            point: transferPath[i].point,
                        })
                    }
                }
                const transferPoint = transferDistance.map((item) => {
                    if (item.point) {
                        return { ...item, point: JSON.parse(item.point) }
                    }
                })
                setSuggestRoutes(transferPoint)
                console.log('transferPoint')
                console.log(transferPoint)
            }
        })
    }

    const totalDistance = (transactionInProgressList, driver) => {
        const separateeTwoPoint = []
        for (const transaction of transactionInProgressList) {
            const senderLocation = {
                transportCode: transaction.transportCode,
                location: transaction.shippingInfo.sender,
                locationStatus: false,
                transactionPoint: `${transaction.transportCode}-1`,
            }
            const receiverLocation = {
                transportCode: transaction.transportCode,
                location: transaction.shippingInfo.receiver,
                locationStatus: true,
                transactionPoint: `${transaction.transportCode}-2`,
            }
            separateeTwoPoint.push(senderLocation, receiverLocation)
        }
        const initialLocation = { location: driver.vehicleStatus }
        const pointsCanToGo = []
        const pointsCanNotToGo = []
        separateeTwoPoint.forEach((point) => {
            if (point.locationStatus) {
                pointsCanNotToGo.push(point)
            }
            if (!point.locationStatus) {
                pointsCanToGo.push(point)
            }
        })
        return findTheShortestPath([initialLocation], pointsCanToGo, pointsCanNotToGo)
    }

    const findTheShortestPath = (pointsGone, pointsCanToGo, pointsCannotToGo) => {
        if (pointsCanToGo.length === 1) {
            const lat1 = Number(pointsGone[pointsGone.length - 1].location.lat)
            const long1 = Number(pointsGone[pointsGone.length - 1].location.long)
            const lat2 = Number(pointsCanToGo[0].location.lat)
            const long2 = Number(pointsCanToGo[0].location.long)
            if (!pointsCanToGo[0].locationStatus) {
                const newPointsGone = [...pointsGone]
                newPointsGone.push(pointsCanToGo[0])
                const shortestPathReturn = findTheShortestPath(newPointsGone, pointsCannotToGo, [])
                const distance =
                    cacurlatorDistance(lat1, long1, lat2, long2) + shortestPathReturn[1]
                const path = `${JSON.stringify(pointsCanToGo[0])}` + `${shortestPathReturn[0]}`

                return [`---${distance}---${path}`, distance]
            }
            const distance = cacurlatorDistance(lat1, long1, lat2, long2)
            return [`---${distance}---${JSON.stringify(pointsCanToGo[0])}`, distance]
        }
        const distance = {}
        const path = {}
        for (let i = 0; i < pointsCanToGo.length; i++) {
            const newPointsGone = [...pointsGone]
            newPointsGone.push(pointsCanToGo[i])
            const newPointsCanToGo = [...pointsCanToGo]
            let newPointsCannotToGo = [...pointsCannotToGo]
            if (pointsCanToGo[i].locationStatus === false) {
                const findMorePointCanGo = pointsCannotToGo.filter(
                    (point) => point.transportCode === pointsCanToGo[i].transportCode
                )
                newPointsCannotToGo = pointsCannotToGo.filter(
                    (point) => point.transportCode !== pointsCanToGo[i].transportCode
                )
                newPointsCanToGo.splice(i, 1, findMorePointCanGo[0])
            } else {
                newPointsCanToGo.splice(i, 1)
            }

            const shortestPathReturn = findTheShortestPath(
                newPointsGone,
                newPointsCanToGo,
                newPointsCannotToGo
            )
            const lat1 = Number(pointsGone[pointsGone.length - 1].location.lat)
            const long1 = Number(pointsGone[pointsGone.length - 1].location.long)
            const lat2 = Number(pointsCanToGo[i].location.lat)
            const long2 = Number(pointsCanToGo[i].location.long)
            distance[i] = cacurlatorDistance(lat1, long1, lat2, long2) + shortestPathReturn[1]
            path[i] = `${JSON.stringify(pointsCanToGo[i])}` + `${shortestPathReturn[0]}`
        }

        const myArr = Object.values(distance)
        const myArrStr = Object.values(path)
        let myMinNum = myArr[0]
        let myMinStr = myArrStr[0]
        for (let i = 0; i < myArr.length; i++) {
            if (myArr[i] < myMinNum) {
                myMinNum = myArr[i]
                myMinStr = myArrStr[i]
            }
        }

        return [`---${myMinNum}---${myMinStr}`, myMinNum]
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
                <Box sx={{ height: '350px', position: 'relative' }}>
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
                        {driver && (
                            <Marker
                                eventHandlers={{
                                    click: () => {
                                        // setShowTransactionInfo(true);
                                    },
                                }}
                                icon={DriverIcon}
                                position={[driver.vehicleStatus.lat, driver.vehicleStatus.long]}
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
                        )}
                        {timelineData &&
                            timelineData.map((timeline) => {
                                if (!timeline.isShow) {
                                    return null
                                }
                                return (
                                    <Marker
                                        eventHandlers={{
                                            click: () => {
                                                // setShowTransactionInfo(true);
                                            },
                                        }}
                                        icon={timeline.deliveryTime ? DestinationIcon : InitialIcon}
                                        position={[timeline.location.lat, timeline.location.long]}
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
                                )
                            })}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                    </MapContainer>
                    <Button
                        sx={{
                            position: 'absolute',
                            right: '15px',
                            top: '15px',
                            zIndex: 1,
                            backgroundColor: 'transparent',
                            fontSize: '25px',
                            outline: 'none !important',
                            border: 'none',
                        }}
                        onClick={() => {
                            setOpen(true)
                        }}
                    >
                        <i class="fa fa-bars" aria-hidden="true"></i>
                    </Button>
                    {open && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 15,
                                right: 15,
                                width: '200px',
                                height: '250px',
                                zIndex: 1,
                                background: 'white',
                                padding: '22px 18px',
                                borderRadius: '10px',
                                overflow: 'auto',
                                cursor: 'default',
                            }}
                        >
                            <Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setOpen(false)
                                }}
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    background: 'none',
                                    color: 'black',
                                    cursor: 'pointer',
                                }}
                            >
                                <i class="fa fa-times" aria-hidden="true"></i>
                            </Button>
                            {timelineData
                                ? timelineData.map((timeline) => {
                                      return (
                                          <Box
                                              py={2}
                                              sx={{
                                                  color: 'black',
                                                  borderBottom: '1px solid #8080804d',
                                                  fontSize: '14px',
                                                  display: 'flex',
                                                  justifyContent: 'space-between',
                                                  cursor: 'pointer',
                                              }}
                                              onClick={() => {
                                                  handleShowHide(timeline.time)
                                              }}
                                          >
                                              <span>
                                                  {timeline.transportCode}
                                                  {timeline.deliveryTime ? '(Giao)' : '(Lấy)'}
                                              </span>
                                              <span>
                                                  {timeline.isShow ? (
                                                      <i
                                                          class="fa fa-eye-slash"
                                                          aria-hidden="true"
                                                      ></i>
                                                  ) : (
                                                      <i
                                                          className="fa fa-eye"
                                                          aria-hidden="true"
                                                      ></i>
                                                  )}
                                              </span>
                                          </Box>
                                      )
                                  })
                                : 'Trống'}
                        </Box>
                    )}
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
                            <Box sx={{ display: 'flex' }}>
                                <Text
                                    as="p"
                                    sx={{
                                        minWidth: '320px',
                                        fontSize: '16px',
                                        color: '#000000',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Tải trọng xe tối đa: {vehicle?.payload} kg
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
                                    Kích thước thùng chứa (DxRxC): {vehicle?.length} x{' '}
                                    {vehicle?.width} x {vehicle?.height}{' '}
                                    m
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
                                    Thể tích thùng chứa tối đa:{' '}
                                    {`${
                                        driver?.vehicleStatus?.length *
                                        driver?.vehicleStatus?.width *
                                        driver?.vehicleStatus?.height
                                    } (m3)`}
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
                        {!timelineData && (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                }}
                            >
                                Lịch trình trống!
                            </Box>
                        )}
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
                                                            {timeline?.deliveryTime
                                                                ? 'Giao hàng'
                                                                : 'Lấy hàng'}
                                                        </Box>
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
                                                                Tải trọng: {timeline.payload} (kg)
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Còn lại:{' '}
                                                                {driver?.vehicleStatus.payload -
                                                                    timeline.payload}{' '}
                                                                (kg)
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
                                                                Thể tích:{' '}
                                                                {timeline.width *
                                                                    timeline.height *
                                                                    timeline.length}{' '}
                                                                (m3)
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Còn lại:{' '}
                                                                {driver?.vehicleStatus.height *
                                                                    driver?.vehicleStatus.width *
                                                                    driver?.vehicleStatus.length -
                                                                    timeline.width *
                                                                        timeline.height *
                                                                        timeline.length}{' '}
                                                                (m3)
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
                                                                Thùng chứa:{' '}
                                                                {`${timeline.length}x${timeline.width}x${timeline.height}`}{' '}
                                                                (m)
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                }}
                                                            >
                                                                Còn lại:{' '}
                                                                {`${
                                                                    driver?.vehicleStatus.length -
                                                                    timeline.length
                                                                }x${
                                                                    driver?.vehicleStatus.width -
                                                                    timeline.width
                                                                }x${
                                                                    driver?.vehicleStatus.height -
                                                                    timeline.height
                                                                }`}{' '}
                                                                (m)
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
                                                                    {index === 0
                                                                        ? '-Cách điểm vị trí xe hiện tại'
                                                                        : '-Cách điểm giao dịch gần nhất'}{' '}
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

                    <div className="container mt-2 mb-5">
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
                            Lịch trình gợi ý
                        </Text>
                        {suggestRoutes &&
                            suggestRoutes.map((anchor, index) => (
                                <div className="timelineHeight row " key={index}>
                                    <div class="col col-3 tlleft2 offset-md-0 ">
                                        <Box
                                            sx={{
                                                fontSize: '21px',
                                                fontWeight: 600,
                                                color: '#1b3a57',
                                                fontFamily: 'revert',
                                                position: 'absolute',
                                                right: '-10px',
                                                top: '65px'
                                            }}
                                        >
                                            <Box>{Math.round(anchor.distance * 10) / 10} Km</Box>
                                        </Box>
                                    </div>
                                    <div class="col col-7 offset-md-0 pl-0">
                                        <ul className="timeline2">
                                            <li className="timeline_li">
                                                <Box
                                                    sx={{
                                                        minHeight: '220px',
                                                        color: '#000000',
                                                        position: 'relative'
                                                    }}
                                                >{index === 0 &&   <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                    }}
                                                >
                                                     <Box
                                                        sx={{
                                                            color: ' #1b3a57',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                       <img
                                                                    width="20px"
                                                                    className="mr-1"
                                                                    alt="vt"
                                                                    src="/png/vehicle.png"
                                                                />  Vị trí hiện của xe
                                                    </Box>
                                                   
                                                    
                                                </Box>}
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            bottom: '-50px',
                                                            justifyContent: 'space-between',
                                                            
                                                        }}
                                                    >
                                                         <Box
                                                            sx={{
                                                                color: ' #1b3a57',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            Mã vận chuyển: {anchor.point.transportCode}
                                                        </Box>
                                                        <Box>
                                                            {anchor.point.locationStatus ? (
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
                                                            {anchor.point.location.address}{' '}{anchor.point.locationStatus ? '(Giao hàng)' : '(Lấy hàng)'}
                                                        </Box>
                                                        
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
