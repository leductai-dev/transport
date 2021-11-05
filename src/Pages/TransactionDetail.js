import React, { useEffect, useState } from 'react'
import TransactionList from '../Components/TransactionList'
import TransactionItem from '../Components/TransactionItem'
import { app } from '../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import { useHistory } from 'react-router'
export default function TransactionDetail() {
    useEffect(() => {}, [])
    const history = useHistory()
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
                        display:'flex',
                        alignItems: 'center'
                    }}
                    as="h1"
                >
                 <Text sx={{
                     cursor: 'pointer',
                     marginRight: '20px',
                     fontSize: '18px'
                 }} onClick={()=>{history.goBack()}} as='span'> <i class="fa fa-arrow-left" aria-hidden="true"></i> </Text> Thông tin chi tiết
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
                                        src="http://orthok.vn/wp-content/uploads/2018/10/avatar-NAM.png"
                                    ></Image>
                                </Box>
                                <Box sx={{ width: '70%', pt: '10px' }}>
                                    <Text
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '30px',
                                        }}
                                    >
                                        John Doe
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
                                            Phone: 0926772712
                                        </Text>
                                        <Text>
                                            <i class="fa fa-envelope mr-2" aria-hidden="true"></i>
                                            Email: useremail99@gmail.com
                                        </Text>
                                        <Text>
                                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                                            Join Day: 12-02-2022
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
                                    <Text
                                        as="p"
                                        sx={{
                                            zIndex: 1,
                                            width: 'fit-content',
                                            color: '#1b3a57',
                                            pr: '10px',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Thông tin vận chuyển
                                    </Text>
                                    <Box>
                                        <Box sx={{ display: 'flex' }}>
                                            <Text></Text>
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
                                    <Box
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
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHLS5JQrUrZ-34pgIuaWnjyF3iV5Qv3V_nQ&usqp=CAU"
                                        ></Image>
                                    </Box>
                                    <Box
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
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHLS5JQrUrZ-34pgIuaWnjyF3iV5Qv3V_nQ&usqp=CAU"
                                        ></Image>
                                    </Box>
                                    <Box
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
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHLS5JQrUrZ-34pgIuaWnjyF3iV5Qv3V_nQ&usqp=CAU"
                                        ></Image>
                                    </Box>
                                    <Box
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
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHLS5JQrUrZ-34pgIuaWnjyF3iV5Qv3V_nQ&usqp=CAU"
                                        ></Image>
                                    </Box>
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
                                        zoom={13}
                                        scrollWheelZoom={true}
                                    >
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
