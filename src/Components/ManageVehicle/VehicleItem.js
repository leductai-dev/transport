import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import Modal from './ModalAddVehicle'
import { useHistory } from 'react-router-dom'

export default function VehicleItem({data}) {
    const [modal, setModal] = useState(false)
    const [user, setUser] = useState({})
    const history = useHistory()
    const { image,name,vehicleId, weight, height,length,width, payload, using, totalCount } = data
    console.log(data)
    useEffect(() => {
        // console.log(customerId)
        // const customer_db = app.database().ref().child(`/Customers/${customerId}`)
        // customer_db.once('value', (snap) => {
        //     if (snap.val()) {
        //         setUser(snap.val())
        //     }
        // })
    }, [])
    return (
        <>
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
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: '#476282',
                        width: '120px'
                    }}
                >
                    <Image
                        sx={{height: '70px',objectFit:'cover' }}
                        src={image}
                    />
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: '#476282',
                    }}
                >
                   {name}
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: '#476282',
                        width: '120px'
                    }}
                >
                    {length} x {width} x {height}(m)
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: '#476282',
                        width: '120px'

                    }}
                >
                    {payload}kg
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: '#476282',
                        width: '120px'
                    }}
                >
                   {totalCount}
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: '#476282',
                        width: '120px'

                    }}
                >
                    {using}
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        color: '#476282',
                        width: '160px'
                    }}
                >
                    <Button
                        mr={2}
                        sx={{ background: 'linear-gradient(to left, #005bea 0%, #00c6fb 100%)' }}
                        onClick={() => {
                            // history.push(`/transaction/${transactionId}`)
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        sx={{ background: 'linear-gradient(to left, #005bea 0%, #00c6fb 100%)' }}
                        onClick={() => {
                            // history.push(`/transaction/${transactionId}`)
                        }}
                    >
                        Xóa
                    </Button>
                </Box>
            </Box>
            {modal && <Modal />}
        </>
    )
}
