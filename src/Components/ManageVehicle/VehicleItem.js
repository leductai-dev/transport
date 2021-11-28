import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import Modal from './ModalAddVehicle'
import { useHistory } from 'react-router-dom'

export default function VehicleItem({ data }) {
    const [modal, setModal] = useState(false)
    const [modalData, setModalData] = useState(null)

    const [user, setUser] = useState({})
    const history = useHistory()
    const { image, name, vehicleId, weight, height, length, width, payload, using, totalCount } =
        data
    console.log(data)

    const handleRemove = () => {
        const db_Vehicle = app.database().ref().child(`/vehicles/${data.vehicleId}`)
        if (using > 0) {
            alert(
                `Xóa thất bại! Xe này đang được sử dụng. Vui lòng chọn xe khác cho tài xế vận chuyển trước trước khi xóa.`
            )
            return
        }
        if (window.confirm('Xác nhận xóa?')) {
            db_Vehicle.remove()
        }
    }

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
                        width: '120px',
                    }}
                >
                    <Image sx={{ height: '70px', objectFit: 'cover' }} src={image} />
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
                        width: '120px',
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
                        width: '120px',
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
                        width: '120px',
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
                        width: '120px',
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
                        width: '160px',
                    }}
                >
                    <Button
                        mr={2}
                        sx={{ background: '#476282', color: 'white' }}
                        onClick={() => {
                            setModalData(data)
                            setModal(true)
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        sx={{ background: '#476282', color: 'white' }}
                        onClick={() => {
                            handleRemove()
                        }}
                    >
                        Xóa
                    </Button>
                </Box>
            </Box>
            {modal && (
                <Modal
                    close={() => {
                        setModal(false)
                        setModalData(null)
                    }}
                    data={modalData}
                />
            )}
        </>
    )
}
