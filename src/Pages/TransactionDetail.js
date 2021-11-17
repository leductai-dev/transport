import React, { useEffect, useState } from 'react'
import { app } from '../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { useHistory, useParams } from 'react-router'
import convertDate from '../Utils/ConvertDate'

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

    useEffect(() => {
        if (param.id) {
            const transaction_db = app
                .database()
                .ref()
                .child(`/system/transactions/pending/${param.id}`)
            transaction_db.once('value', (snap) => {
                if (snap.val()) {
                    console.log('1 done')
                    // setTransaction(snap.val())
                    const customer_db = app
                        .database()
                        .ref()
                        .child(`/Customers/${snap.val().customerId}`)
                    customer_db.once('value', (_snap) => {
                        console.log(snap.val())
                        setCustomer(_snap.val())
                        setTransaction(snap.val())
                    })
                } else {
                    alert('Không tìm thấy giao dịch!')
                }
            })
        }
    }, [])
    if (customer && transaction) {
        const { initialTime, note, shippingInfo, transportCode } = transaction
        const { height, weight, width, length, imageUrl, productName } = shippingInfo.productInfo
        const { receiver, sender } = shippingInfo
        const { customerId, email, joinDate, name, phone } = customer
        console.log(receiver)
        console.log(sender)
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
                                            }}
                                        >
                                            {customer.name}
                                        </Text>
                                        <Text
                                            sx={{
                                                borderBottom: '1px solid #80808030',
                                                pb: '8px',
                                            }}
                                        >
                                            Customer
                                        </Text>
                                        <Box
                                            sx={{
                                                pt: '10px',
                                                lineHeight: '30px',
                                            }}
                                        >
                                            <Text>
                                                <i class="fa fa-phone mr-2 " aria-hidden="true"></i>{' '}
                                                Phone: {customer.phone}
                                            </Text>
                                            <Text>
                                                <i
                                                    class="fa fa-envelope mr-2"
                                                    aria-hidden="true"
                                                ></i>
                                                Email: {customer.email}
                                            </Text>
                                            <Text>
                                                <i
                                                    class="fa fa-calendar mr-2"
                                                    aria-hidden="true"
                                                ></i>
                                                Join Day: {convertDate(joinDate)}
                                            </Text>
                                            <Text></Text>
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
                                                backgroundColor: 'gray',
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
                                                <Box  sx={{ width: '50%', paddingRight: '20px' }}>
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
                                                            color: 'gray',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Tên người gửi: {sender.name}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: 'gray',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Số điện thoại: {sender.phone}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: 'gray',
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
                                                            color: 'gray',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Tên người gửi: {receiver.name}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: 'gray',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Số điện thoại: {receiver.phone}
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: 'gray',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Địa chỉ lấy hàng: {receiver.address}
                                                    </Text>
                                                </Box>
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
                                                        Thông tin sản phẩm
                                                    </Text>
                                                    <Text
                                                        as="p"
                                                        sx={{
                                                            fontSize: '16px',
                                                            color: 'gray',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Tên sản phẩm: {productName}
                                                    </Text>
                                                    <Box sx={{ display: 'flex' }}>
                                                        {' '}
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                fontSize: '16px',
                                                                color: 'gray',
                                                                marginBottom: '10px',
                                                                width: '30%',
                                                            }}
                                                        >
                                                            Chiều dài: {length} (m)
                                                        </Text>
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                width: '40%',
                                                                fontSize: '16px',
                                                                color: 'gray',
                                                                marginBottom: '10px',
                                                            }}
                                                        >
                                                            Chiều rộng(m): {width} (m)
                                                        </Text>
                                                    </Box>
                                                    <Box sx={{ display: 'flex' }}>
                                                        {' '}
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                fontSize: '16px',
                                                                color: 'gray',
                                                                marginBottom: '10px',
                                                                width: '30%',
                                                            }}
                                                        >
                                                            Chiều cao: {height} (m)
                                                        </Text>
                                                        <Text
                                                            as="p"
                                                            sx={{
                                                                fontSize: '16px',
                                                                color: 'gray',
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
                                                            color: 'gray',
                                                            marginBottom: '10px',
                                                        }}
                                                    >
                                                        Ghi chú: {note}
                                                    </Text>
                                                </Box>
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
                                                backgroundColor: 'gray',
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
                                        {imageUrl.split(',').map((url, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    width: '300px',
                                                    height: '170px',
                                                    padding: '0px 5px',
                                                }}
                                            >
                                                <Image
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
                                        mt={'20px'}
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
                                    <Text
                                        as="p"
                                        sx={{
                                            zIndex: 1,
                                            width: 'fit-content',
                                            color: '#1b3a57',
                                            pr: '10px',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            marginTop: '20px',
                                        }}
                                    >
                                        Danh sách xe gợi ý
                                    </Text>
                                    <Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                borderBottom: '1px solid gray',
                                                paddingBottom: '10px',
                                            }}
                                        >
                                            <Box>
                                                <label for="birthday">Birthday:</label>
                                                <input type="date" id="birthday" name="birthday" />
                                            </Box>
                                            <Box>
                                                <label for="birthday">Birthday:</label>
                                                <input type="date" id="birthday" name="birthday" />
                                            </Box>
                                            <Box sx={{ marginLeft: 'auto' }}>
                                                <label for="birthday">Search</label>
                                                <input
                                                    placeholder="Tìm kiếm đơn vận chuyển..."
                                                    type="text"
                                                    id="birthday"
                                                    name="birthday"
                                                />
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
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Ngày khởi tạo
                                                </Box>
                                                <Box
                                                    py={'10px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        fontWeight: '600',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Mã vận chuyển
                                                </Box>
                                                <Box
                                                    py={'10px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        fontWeight: '600',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Tên khách hàng
                                                </Box>
                                                <Box
                                                    py={'10px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        fontWeight: '600',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Số điện thoại
                                                </Box>
                                                <Box
                                                    py={'10px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        fontWeight: '600',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Trạng thái
                                                </Box>
                                                <Box
                                                    py={'10px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        fontWeight: '600',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Thao tác
                                                </Box>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'table-row',
                                                    borderBottom: '1px solid #9391915c',
                                                    marginBottom: '10px',
                                                }}
                                            >
                                                <Box
                                                    py={'5px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    15-12-2021
                                                </Box>
                                                <Box
                                                    py={'5px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    TP-202-150
                                                </Box>
                                                <Box
                                                    py={'5px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Lê Đức Tài
                                                </Box>
                                                <Box
                                                    py={'5px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    0926772712
                                                </Box>
                                                <Box
                                                    py={'5px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    Pending
                                                </Box>
                                                <Box
                                                    py={'5px'}
                                                    sx={{
                                                        display: 'table-cell',
                                                        color: '#476282',
                                                    }}
                                                >
                                                    <Button
                                                        sx={{
                                                            background: 'cornflowerblue',
                                                        }}
                                                    >
                                                        Chi tiết
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Text
                                        as="p"
                                        sx={{
                                            zIndex: 1,
                                            width: 'fit-content',
                                            color: '#1b3a57',
                                            pr: '10px',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            marginTop: '20px',
                                        }}
                                    >
                                        Hành động
                                    </Text>
                                    <Box>
                                        <Button>Hủy yêu cầu</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div>
        )
    }
    return null
}
