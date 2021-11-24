import React, { useEffect, useState } from 'react'
import { app } from '../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import ModalTransaction from './ModalTransactionInfo'
import { useHistory } from 'react-router-dom'
import ModalDriverDetail from './ModalDriverDetail'

export default function DriverItem({driver, index, handle}) {
    const [dataModal, setDataModal] = useState(null);
    const [vehicle, setVehicle] = useState(null);

  
    useEffect(() => {
        const vehicle_db = app.database().ref().child(`/vehicles/${driver.vehicleId}`)
        vehicle_db.once('value', (snap) => {
            if (snap.val()) {
                setVehicle(snap.val())
            }
        })
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
                        textAlign: 'center',
                        color: '#476282',
                    }}
                >
                    {index}
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
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
                        textAlign: 'center',
                        color: '#476282',
                    }}
                >
                     {driver.name}
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        textAlign: 'center',
                        color: '#476282',
                    }}
                >
                    4 tấn
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        textAlign: 'center',
                        color: '#476282',
                    }}
                >
                    2.5m
                </Box>
                <Box
                    py={'5px'}
                    sx={{
                        display: 'table-cell',
                        textAlign: 'center',
                        color: '#476282',
                    }}
                >
                    <Button
                    className='bg-primary'
                        sx={{
                            background: 'cornflowerblue',
                        }}
                        onClick={() => {
                            setDataModal(driver)
                        }}
                    >
                        <i class="fa fa-eye" aria-hidden="true"></i> Lịch trình
                    </Button>
                    <Button
                    className='bg-primary ml-2'
                        sx={{
                            background: 'cornflowerblue',
                        }}
                        onClick={() => {
                            handle(driver,vehicle)
                        }}
                    >
                        <i class="fa fa-thumb-tack" aria-hidden="true"></i> Chọn
                    </Button>
                </Box>
            </Box>
            {dataModal && <ModalDriverDetail transaction={dataModal} onClose={()=>{setDataModal(null)}}/>}

        </>
    )
}
