import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import Modal from './ModalAddMember'
import { useHistory } from 'react-router-dom'

export default function VehicleItem({ data }) {
    const [modal, setModal] = useState(false)
    const [vehicle, setVehicle] = useState(null)
    const history = useHistory()
    
    const { name, phone, sex, joinDate, birthDay, vehicleId, status, image } = data
    useEffect(() => {
        const db_Vehicle = app.database().ref().child(`/vehicles/${vehicleId}`)
        db_Vehicle.once('value', (snap) => {
            if (snap.val()) {
                setVehicle(snap.val())
            }
        })
    }, [vehicleId])
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
                    }}
                >
                    <Image
                        sx={{ width: '60px', height: '70px' }}
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
                    }}
                >
                    0{phone}
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
                    {new Date().getFullYear() - Number(birthDay.substr(0,4))}
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
                    {sex ? "Nam" : "Nữ"}
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
                    {vehicle?.name}
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
                    {joinDate}
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
                    <Button
                        sx={{ background: 'linear-gradient(to left, #005bea 0%, #00c6fb 100%)' }}
                        onClick={() => {
                            // history.push(`/transaction/${transactionId}`)
                        }}
                    >
                        Chi tiết
                    </Button>
                </Box>
            </Box>
            {modal && <Modal />}
        </>
    )
}
