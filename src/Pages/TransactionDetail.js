import React, { useEffect, useState, useCallback } from 'react'
import { app } from '../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { useHistory, useParams } from 'react-router'
import convertDate from '../Utils/ConvertDate'
import DriverItem from '../Components/ManageTransaction/DriversItem'
import ImageViewer from 'react-simple-image-viewer'
import { Input, Label, Select, Checkbox } from '@rebass/forms'

const DestinationIcon = new L.Icon({
    iconUrl: '/png/destination.png',
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

export default function TransactionDetail() {
    const history = useHistory()
    const param = useParams()
    const [transaction, setTransaction] = useState(null)
    const [customer, setCustomer] = useState(null)
    const [drivers, setDrivers] = useState(null)
    const [driverInProgress, setDriverInProgress] = useState(null)
    const [driversView, setDriversView] = useState(null)
    const [chosenDriver, setChosenDriver] = useState(null)
    const [chosenVehicle, setChosenVehicle] = useState(null)
    const [currentImage, setCurrentImage] = useState(0)
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [sugggestDriverList, setSuggestDriverList] = useState(null)
    const [loading, setLoading] = useState(false)

    const openImageViewer = useCallback((index) => {
        setCurrentImage(index)
        setIsViewerOpen(true)
    }, [])

    const closeImageViewer = () => {
        setCurrentImage(0)
        setIsViewerOpen(false)
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }
    function calculateDistance(lat1, lon1, lat2, lon2) {
        var R = 6371 // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1) // deg2rad below
        var dLon = deg2rad(lon2 - lon1)
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2)
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        var d = R * c // Distance in km
        return d
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        if (param.id) {
            const transaction_db = app.database().ref().child(`/transactions/${param.id}`)
            const drivers = app.database().ref().child('/drivers')

            transaction_db.once('value', (snap) => {
                if (snap.val()) {
                    const customer_db = app
                        .database()
                        .ref()
                        .child(`/customers/${snap.val().customerId}`)
                    customer_db.once('value', (_snap) => {
                        setCustomer(_snap.val())
                        setTransaction(snap.val())
                    })
                    if (snap.val().driverId) {
                        const driver_db = app
                            .database()
                            .ref()
                            .child(`/drivers/${snap.val().driverId}`)
                        driver_db.once('value', (_snap2) => {
                            setDriverInProgress(_snap2.val())
                        })
                    }
                } else {
                    alert('Không tìm thấy giao dịch!')
                    return
                }
            })
            drivers.once('value', (snap) => {
                if (snap.val()) {
                    setDrivers(Object.values(snap.val()))
                    setDriversView(Object.values(snap.val()))
                }
            })
        }
    }, [param.id])

    const handleChangeView = (e) => {
        console.log(drivers)
        switch (e.target.value) {
            case '1':
                setDriversView(drivers)
                break
            case '2':
                if (sugggestDriverList) {
                    setDriversView(sugggestDriverList)
                    return
                }
                setLoading(true)
                findAppropriate()
                break

            default:
                break
        }
    }

    const findAppropriate = () => {
        if (!drivers) return
        const newDrivers = drivers
            .map((driver, index) => {
                const db_Transactions = app
                    .database()
                    .ref()
                    .child(`/transactions`)
                    .orderByChild('driverId')
                    .equalTo(driver.driverId)
                let diffrenceDistance = 0
                db_Transactions.once('value', (snap) => {
                    let transactionInProgressList = []
                    let oldDistance = 0
                    if (snap.val()) {
                        transactionInProgressList = Object.values(snap.val()).filter(
                            (item) => item.status === 'inProgress'
                        )
                        oldDistance = totalDistance(transactionInProgressList, driver)[1]
                    }
                    transactionInProgressList.push(transaction)
                    const newDistance = totalDistance(transactionInProgressList, driver)[1]
                    diffrenceDistance = newDistance - oldDistance
                })
                return { ...driver, diffrenceDistance }
            })
            .sort((a, b) => a.diffrenceDistance - b.diffrenceDistance)
        setDriversView(newDrivers)
        setSuggestDriverList(newDrivers)
        setLoading(false)
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
            const key = `${lat1 + long1 + lat2 + long2}`
            if (!pointsCanToGo[0].locationStatus) {
                const newPointsGone = [...pointsGone]
                newPointsGone.push(pointsCanToGo[0])
                const shortestPathReturn = findTheShortestPath(newPointsGone, pointsCannotToGo, [])
                const distance = calculateDistance(lat1, long1, lat2, long2) + shortestPathReturn[1]
                const path = `${pointsCanToGo[0].transactionPoint}` + `${shortestPathReturn[0]}`

                return [`---${distance}---${path}`, distance]
            }
            const distance = calculateDistance(lat1, long1, lat2, long2)
            return [`---${distance}---${pointsCanToGo[0].transactionPoint}`, distance]
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
            const key = `${lat1 + long1 + lat2 + long2}`
            distance[i] = calculateDistance(lat1, long1, lat2, long2) + shortestPathReturn[1]
            path[i] = `${pointsCanToGo[i].transactionPoint}` + `${shortestPathReturn[0]}`
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

    const handleChosenDriver = (driver, vehicle) => {
        setChosenDriver(driver)
        setChosenVehicle(vehicle)
    }
    const handleCancelCustomer = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Xác nhận hủy?')) {
            const transaction_db = app
                .database()
                .ref()
                .child(`/transactions/${transaction.transactionId}`)
            const data = { ...transaction, status: 'canceled' }
            transaction_db.update(data)
            history.push('/transactions')
            alert('Hủy thành yêu cầu chuyển hàng thành công!')
        }
    }
    const handleCancelDriver = () => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Xác nhận hủy?')) {
            const transaction_db = app
                .database()
                .ref()
                .child(`/transactions/${transaction.transactionId}`)
            const data = { ...transaction, status: 'pending' }
            transaction_db.update(data)
            history.push('/transactions')
            alert('Hủy yêu cầu thành công!')
        }
    }

    const handleCompleteOrder = () => {
        if (!chosenDriver) {
            alert('Chọn một xe để thực hiện giao hàng!')
            return
        }
        // eslint-disable-next-line no-restricted-globals
        if (!confirm('Xác nhận chuyển giao')) return
        const transaction_db = app
            .database()
            .ref()
            .child(`/transactions/${transaction.transactionId}`)
        const data = { ...transaction, driverId: chosenDriver.driverId, status: 'driverPending' }
        transaction_db.update(data)

        const EXPO_SERVER_URL = 'https://exp.host/--/api/v2/push/send'
        const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send'
        let data2 = {
            to: chosenDriver.tokenId,
            title: 'Yêu cầu vận chuyển hàng mới',
            body: '',
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
            body: JSON.stringify(data2),
        }).catch((err) => console.log(err))
        history.push('/transactions')
        alert('Xử lý yêu cầu thành công!')
    }

    if (customer && transaction) {
        const { initialTime, note, shippingInfo, transportCode } = transaction
        const { height, weight, width, length, imageUrl, productName } = shippingInfo.productInfo
        const { receiver, sender } = shippingInfo
        const { customerId, email, joinDate, name, phone } = customer
        const images = imageUrl.split(',')

        return (
            <div className="flex-grow-1 map">
                <Box
                    sx={{
                        p: '15px',
                    }}
                >
                    <Text
                        sx={{
                            fontSize: '30px',
                            fontWeight: 'bold',
                            color: '#1b3a57',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        as="h1"
                    >
                        <Text
                            sx={{
                                cursor: 'pointer',
                                marginRight: '20px',
                                fontSize: '18px',
                            }}
                            onClick={() => {
                                history.push('/transactions')
                            }}
                            as="span"
                        >
                            {' '}
                            <i class="fa fa-arrow-left" aria-hidden="true"></i>{' '}
                        </Text>{' '}
                        Thông tin chi tiết
                    </Text>
                    <hr style={{ marginTop: '5px', marginBottom: '0px' }} />
                    <Box>
                        <Box sx={{ paddingTop: '20px' }}>
                            <Box
                                sx={{
                                    p: '30px 25px 40px 25px',
                                    overflowY: 'auto',
                                    flexGrow: 1,
                                    backgroundColor: '#F7FAFC',
                                }}
                            >
                                <Text
                                    as="p"
                                    sx={{
                                        zIndex: 1,
                                        width: 'fit-content',
                                        color: '#1b3a57',
                                        pr: '10px',
                                        fontSize: '20px',
                                        fontWeight: 'bold',
                                        paddingLeft: '25px',
                                        paddingBottom: '25px',
                                    }}
                                >
                                    Thông tin khách hàng
                                </Text>
                                <Box sx={{ display: 'flex' }}>
                                    <Box sx={{ width: '30%', textAlign: 'center' }}>
                                        <Image
                                            sx={{
                                                width: '200px',
                                            }}
                                            src="/png/customer.jpg"
                                        ></Image>
                                    </Box>
                                    <Box sx={{ width: '70%', pt: '10px' }}>
                                        <Text
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '30px',
                                                borderBottom: '1px solid #80808030',
                                                pb: '8px',
                                                color: '#1b3a57',
                                            }}
                                        >
                                            {customer.name}
                                        </Text>

                                        <Box
                                            sx={{
                                                pt: '10px',
                                                lineHeight: '30px',
                                            }}
                                        >
                                            <Text sx={{ color: '#363636' }}>
                                                <i class="fa fa-phone mr-2 " aria-hidden="true"></i>{' '}
                                                Phone: {customer.phone}
                                            </Text>
                                            <Text sx={{ color: '#363636' }}>
                                                <i
                                                    class="fa fa-envelope mr-2"
                                                    aria-hidden="true"
                                                ></i>
                                                Email: {customer.email}
                                            </Text>
                                            <Text sx={{ color: '#363636' }}>
                                                <i
                                                    class="fa fa-calendar mr-2"
                                                    aria-hidden="true"
                                                ></i>
                                                Join Day: {convertDate(joinDate)}
                                            </Text>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        p: '25px',
                                        pt: '30px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '25px',
                                            position: 'relative',
                                            '&:after': {
                                                position: 'absolute',
                                                top: '50%',
                                                left: 0,
                                                transform: 'translateY(-50%)',
                                                width: '100%',
                                                height: '1px',
                                                backgroundColor: '#363636',
                                                fontWeight: '500',
                                                zIndex: -1,
                                                content: "''",
                                            },
                                        }}
                                    >
                                        <Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    paddingTop: '20px',
                                                }}
                                            >
                                                <Box sx={{ width: '45%', paddingRight: '20px' }}>
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
                                                        Thông tin gửi hàng
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Tên người gửi: {sender.name}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Số điện thoại: {sender.phone}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Địa chỉ lấy hàng: {sender.address}
                                                    </Text>
                                                </Box>
                                                <Box sx={{ width: '50%', paddingRight: '20px' }}>
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
                                                        Thông tin nhận hàng
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Tên người gửi: {receiver.name}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Số điện thoại: {receiver.phone}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Địa chỉ lấy hàng: {receiver.address}
                                                    </Text>
                                                </Box>
                                                <Box
                                                    mt={2}
                                                    sx={{ width: '45%', paddingRight: '10px' }}
                                                >
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
                                                        Thông tin sản phẩm
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Tên mặc hàng: {productName}
                                                    </Text>
                                                    <Box sx={{ display: 'flex' }}>
                                                        {' '}
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                fontSize: '16px',
                                                                color: '#363636',
                                                                fontWeight: '500',
                                                                marginBottom: '10px',
                                                                width: '50%',
                                                            }}
                                                        >
                                                            Chiều dài: {length} (m)
                                                        </Text>
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                width: '40%',
                                                                fontSize: '16px',
                                                                color: '#363636',
                                                                fontWeight: '500',
                                                                marginBottom: '10px',
                                                            }}
                                                        >
                                                            Chiều rộng(m): {width} (m)
                                                        </Text>
                                                    </Box>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                fontSize: '16px',
                                                                color: '#363636',
                                                                fontWeight: '500',
                                                                marginBottom: '10px',
                                                                width: '50%',
                                                            }}
                                                        >
                                                            Chiều cao: {height} (m)
                                                        </Text>
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                fontSize: '16px',
                                                                color: '#363636',
                                                                fontWeight: '500',
                                                                marginBottom: '10px',
                                                                width: '40%',
                                                            }}
                                                        >
                                                            Khối lượng: {weight} (kg)
                                                        </Text>
                                                    </Box>

                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: '#363636',
                                                            fontWeight: '500',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Ghi chú: {note}
                                                    </Text>
                                                </Box>
                                                {driverInProgress &&
                                                    transaction?.status === 'inProgress' && (
                                                        <Box
                                                            mt={2}
                                                            sx={{
                                                                width: '50%',
                                                                paddingRight: '10px',
                                                            }}
                                                        >
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
                                                                Thông tin vận chuyển
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                    color: '#363636',
                                                                    fontWeight: '500',
                                                                    marginBottom: '10px',
                                                                }}
                                                            >
                                                                Người vận chuyển:{' '}
                                                                {driverInProgress.name}
                                                            </Text>
                                                            <Text
                                                                as="p"
                                                                sx={{
                                                                    fontSize: '16px',
                                                                    color: '#363636',
                                                                    fontWeight: '500',
                                                                    marginBottom: '10px',
                                                                }}
                                                            >
                                                                Số điện thoại:{' '}
                                                                {driverInProgress.phone}
                                                            </Text>
                                                            {transaction?.arrivalTime && (
                                                                <Text
                                                                    as="p"
                                                                    sx={{
                                                                        fontSize: '16px',
                                                                        color: '#363636',
                                                                        fontWeight: '500',
                                                                        marginBottom: '10px',
                                                                    }}
                                                                >
                                                                    Thời gian lấy hàng dự kiến:{' '}
                                                                    {new Date(
                                                                        transaction.arrivalTime
                                                                    ).toLocaleTimeString()}{' '}
                                                                    {'-'}{' '}
                                                                    {convertDate(
                                                                        transaction.arrivalTime
                                                                    )}
                                                                </Text>
                                                            )}

                                                            {transaction?.deliveryTime && (
                                                                <Text
                                                                    as="p"
                                                                    sx={{
                                                                        fontSize: '16px',
                                                                        color: '#363636',
                                                                        fontWeight: '500',
                                                                        marginBottom: '10px',
                                                                    }}
                                                                >
                                                                    Thời gian giao hàng dự kiến:{' '}
                                                                    {new Date(
                                                                        transaction.deliveryTime
                                                                    ).toLocaleTimeString()}{' '}
                                                                    {'-'}{' '}
                                                                    {convertDate(
                                                                        transaction.deliveryTime
                                                                    )}
                                                                </Text>
                                                            )}
                                                        </Box>
                                                    )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{
                                        p: '5px 25px 0 25px',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '25px',
                                            position: 'relative',
                                            '&:after': {
                                                position: 'absolute',
                                                top: '50%',
                                                left: 0,
                                                transform: 'translateY(-50%)',
                                                width: '100%',
                                                height: '1px',
                                                backgroundColor: '#363636',
                                                fontWeight: '500',
                                                zIndex: -1,
                                                content: "''",
                                            },
                                        }}
                                    >
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
                                            Hình ảnh sản phẩm
                                        </Text>
                                    </Box>

                                    <Box
                                        sx={{
                                            columnCount: 2,
                                            lineHeight: '40px',
                                            display: 'flex',
                                            flexWrap: 'nowrap',
                                            pt: '10px',
                                            overflowX: 'scroll',
                                        }}
                                    >
                                        {imageUrl.length > 0 &&
                                            imageUrl.split(',').map((url, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        width: '300px',
                                                        height: '170px',
                                                        padding: '0px 5px',
                                                    }}
                                                >
                                                    <Image
                                                        onClick={() => openImageViewer(index)}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                        src={url}
                                                    ></Image>
                                                </Box>
                                            ))}
                                    </Box>
                                    <Text
                                        as="p"
                                        mt={'50px'}
                                        sx={{
                                            zIndex: 1,
                                            width: 'fit-content',
                                            color: '#1b3a57',
                                            pr: '10px',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Vị trí trên bản đồ
                                    </Text>
                                    <Box>
                                        <MapContainer
                                            style={{
                                                width: '100%',
                                                minHeight: '450px',
                                                position: 'relative',
                                                zIndex: '0',
                                            }}
                                            /*  center={location?location:center} */
                                            center={[16.060392, 108.211847]}
                                            zoom={5}
                                            scrollWheelZoom={true}
                                        >
                                            <Marker
                                                eventHandlers={{
                                                    click: () => {},
                                                }}
                                                icon={InitialIcon}
                                                position={[sender.lat, sender.long]}
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
                                                eventHandlers={{
                                                    click: () => {},
                                                }}
                                                icon={DestinationIcon}
                                                position={[receiver.lat, receiver.long]}
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
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                        </MapContainer>
                                    </Box>

                                    {transaction.status === 'pending' ? (
                                        <Box>
                                            <Text
                                                as="p"
                                                sx={{
                                                    zIndex: 1,
                                                    width: 'fit-content',
                                                    color: '#1b3a57',
                                                    pr: '10px',
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    marginTop: '50px',
                                                }}
                                                mb={3}
                                            >
                                                Danh sách xe gợi ý
                                            </Text>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    borderBottom: '1px solid gray',
                                                    paddingBottom: '10px',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Text
                                                        sx={{
                                                            fontWeight: '600',
                                                            color: '#476282',
                                                            padding: '3px 10px',
                                                        }}
                                                    >
                                                        Hiển thị
                                                    </Text>
                                                    <Select
                                                        sx={{
                                                            border: '1px solid #e3e3e3',
                                                            background: '#cdcdcd14',
                                                            padding: '4px',
                                                            outline: 'none',
                                                            width: '160px',
                                                        }}
                                                        id="location"
                                                        name="vehicleId"
                                                        onChange={(e) => {
                                                            handleChangeView(e)
                                                        }}
                                                    >
                                                        <option value="1">Tất cả</option>
                                                        <option value="2">Xe phù hợp</option>
                                                    </Select>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        marginLeft: '20px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Text
                                                        sx={{
                                                            fontWeight: '600',
                                                            color: '#476282',
                                                            padding: '3px 10px',
                                                        }}
                                                    >
                                                        Loại xe
                                                    </Text>
                                                    <Select
                                                        sx={{
                                                            border: '1px solid #e3e3e3',
                                                            background: '#cdcdcd14',
                                                            padding: '4px',
                                                            outline: 'none',
                                                            width: '160px',
                                                        }}
                                                        id="location"
                                                        name="vehicleId"
                                                    >
                                                        <option value="1">Trên 1 tấn</option>
                                                        <option value="2">Trên 5 tấn</option>
                                                        <option value="2">Trên 10 tấn</option>
                                                        <option value="2">Trên 15 tấn</option>
                                                    </Select>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        marginLeft: 'auto',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Label
                                                        mr={2}
                                                        sx={{
                                                            fontWeight: '600',
                                                            color: '#476282',
                                                            width: 'auto',
                                                            minWidth: 'fit-content',
                                                        }}
                                                        htmlFor="name"
                                                    >
                                                        Tìm kiếm
                                                    </Label>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            outline: 'none',
                                                            border: '1px solid #e3e3e3',
                                                            background: '#cdcdcd14',
                                                            paddingRight: '5px',
                                                            fontSize: '18px',
                                                        }}
                                                    >
                                                        <Input
                                                            sx={{
                                                                width: '400px',
                                                                outline: 'none',
                                                                border: 'none',
                                                                fontSize: '15px',
                                                            }}
                                                            name="name"
                                                            onChange={(e) => {
                                                                // handleFilter(e.target.value)
                                                            }}
                                                            type="text"
                                                            placeholder="Tìm kiếm đơn vận chuyển..."
                                                        />
                                                        <i
                                                            class="fa fa-search"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'table',
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderCollapse: 'collapse',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'table-row',
                                                        paddingTop: '10px',
                                                        paddingBottom: '10px',
                                                        mb: '5px',
                                                    }}
                                                >
                                                    <Box
                                                        py={'10px'}
                                                        sx={{
                                                            display: 'table-cell',
                                                            fontWeight: '600',
                                                            color: '#1b3a57',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        STT
                                                    </Box>
                                                    <Box
                                                        py={'10px'}
                                                        sx={{
                                                            display: 'table-cell',
                                                            fontWeight: '600',
                                                            color: '#1b3a57',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        Loại xe
                                                    </Box>
                                                    <Box
                                                        py={'10px'}
                                                        sx={{
                                                            display: 'table-cell',
                                                            fontWeight: '600',
                                                            color: '#1b3a57',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        Tài xế
                                                    </Box>
                                                    <Box
                                                        py={'10px'}
                                                        sx={{
                                                            display: 'table-cell',
                                                            fontWeight: '600',
                                                            color: '#1b3a57',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        Trọng tải
                                                    </Box>
                                                    <Box
                                                        py={'10px'}
                                                        sx={{
                                                            display: 'table-cell',
                                                            fontWeight: '600',
                                                            color: '#1b3a57',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        Kích thước thùng
                                                    </Box>
                                                    <Box
                                                        py={'10px'}
                                                        sx={{
                                                            display: 'table-cell',
                                                            fontWeight: '600',
                                                            color: '#1b3a57',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        Hành động
                                                    </Box>
                                                </Box>
                                                {loading && (
                                                    <Box>
                                                        <Image src="/png/Pulse-1s-200px.gif" />
                                                    </Box>
                                                )}
                                                {!loading &&
                                                    driversView &&
                                                    driversView.map((driver, index) => (
                                                        <DriverItem
                                                            transaction={transaction}
                                                            driver={driver}
                                                            handle={handleChosenDriver}
                                                            key={index}
                                                            index={index + 1}
                                                        />
                                                    ))}
                                            </Box>
                                        </Box>
                                    ) : null}
                                    <Text
                                        as="p"
                                        sx={{
                                            zIndex: 1,
                                            color: '#1b3a57',
                                            pr: '10px',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            marginTop: '50px',
                                            paddingBottom: '10px',
                                            borderBottom: '1px solid gray',
                                            display: 'block',
                                            width: 'revert',
                                        }}
                                    >
                                        Hành động
                                    </Text>
                                    {transaction.status === 'pending' && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                marginTop: '10px',
                                                paddingBottom: '200px',
                                            }}
                                        >
                                            {chosenDriver && (
                                                <Text
                                                    as="span"
                                                    sx={{
                                                        zIndex: 1,
                                                        color: '#1b3a57',
                                                        pr: '10px',
                                                        fontSize: '15px',
                                                        marginTop: '10px',
                                                        justifySelf: 'flex-start',
                                                        marginRight: 'auto',
                                                    }}
                                                >
                                                    *Gửi yêu cầu vận chuyển cho{' '}
                                                    <Text
                                                        as="span"
                                                        sx={{
                                                            zIndex: 1,
                                                            color: '#1b3a57',
                                                            pr: '10px',
                                                            fontSize: '15px',
                                                            marginTop: '10px',
                                                            justifySelf: 'flex-start',
                                                            marginRight: 'auto',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {chosenVehicle.name}
                                                    </Text>
                                                    do tài xế{' '}
                                                    <Text
                                                        as="span"
                                                        sx={{
                                                            zIndex: 1,
                                                            color: '#1b3a57',
                                                            pr: '10px',
                                                            fontSize: '15px',
                                                            marginTop: '10px',
                                                            justifySelf: 'flex-start',
                                                            marginRight: 'auto',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {chosenDriver.name}
                                                    </Text>
                                                    {'điều khiển.'}
                                                </Text>
                                            )}
                                            <Button
                                                className="bg-warning ml-auto"
                                                mr={2}
                                                sx={{ background: 'blue', padding: '10px 20px' }}
                                                onClick={() => {
                                                    handleCancelCustomer()
                                                }}
                                            >
                                                <i
                                                    class="fa fa-minus-circle"
                                                    aria-hidden="true"
                                                ></i>{' '}
                                                Hủy yêu cầu
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    handleCompleteOrder()
                                                }}
                                                className="bg-success"
                                                sx={{ background: 'blue', padding: '10px 35px' }}
                                            >
                                                <i class="fa fa-check" aria-hidden="true"></i> Hoàn
                                                tất
                                            </Button>
                                        </Box>
                                    )}
                                    {transaction.status === 'driverPending' && driverInProgress && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'flex-start',
                                                marginTop: '10px',
                                                paddingBottom: '200px',
                                            }}
                                        >
                                            <Text
                                                as="span"
                                                sx={{
                                                    zIndex: 1,
                                                    color: '#1b3a57',
                                                    pr: '10px',
                                                    fontSize: '15px',
                                                    marginTop: '10px',
                                                    justifySelf: 'flex-start',
                                                    marginRight: 'auto',
                                                }}
                                            >
                                                *Đã gửi yêu cầu vận chuyển cho tài xế{' '}
                                                <Text
                                                    as="span"
                                                    sx={{
                                                        zIndex: 1,
                                                        color: '#1b3a57',
                                                        pr: '10px',
                                                        fontSize: '15px',
                                                        marginTop: '10px',
                                                        justifySelf: 'flex-start',
                                                        marginRight: 'auto',
                                                        fontWeight: '600',
                                                    }}
                                                >
                                                    {driverInProgress.name}
                                                </Text>
                                            </Text>
                                            <Button
                                                className="bg-warning ml-auto"
                                                mr={2}
                                                sx={{ background: 'blue', padding: '10px 20px' }}
                                                onClick={() => {
                                                    handleCancelDriver()
                                                }}
                                            >
                                                <i
                                                    class="fa fa-minus-circle"
                                                    aria-hidden="true"
                                                ></i>{' '}
                                                Hủy chuyển giao yêu cầu
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {isViewerOpen && (
                    <ImageViewer
                        src={images}
                        currentIndex={currentImage}
                        onClose={closeImageViewer}
                        backgroundStyle={{
                            backgroundColor: 'rgba(0,0,0,0.9)',
                        }}
                    />
                )}
            </div>
        )
    }
    return null
}
