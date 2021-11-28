import React, { useEffect, useState } from 'react'
import { Box, Text, Image, Button } from 'rebass'
import Modal from "./ModalAddMember"
import { Input, Label, Select, Checkbox } from '@rebass/forms'

export default function VehicleList({ children, vehicles }) {
    const [modal, setModal] = useState(false);
    const handleChange = () =>{

    }

    return (
        <Box sx={{
            padding: '10px 20px',

        }}>
            <Box
                sx={{
                    padding: '20px 0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #476282'
                }}
            >
                <Box sx={{display:'flex'}}>
                    <Text sx={{lineHeight: '28px', fontWeight: '600', color: '#476282',padding: '3px 10px'}}>Loại phương tiện</Text>
                    <Select
                        sx={{ border: '1px solid #e3e3e3', background: '#cdcdcd14',padding: '4px', outline: 'none', width: '160px' }}
                        id="location"
                        name="vehicleId"
                        onChange={handleChange}
                    >
                        <option value="">Tất cả</option>
                        {vehicles ? (
                            vehicles.map((vehicle, index) => (
                                <option key={index} value={vehicle.vehicleId}>
                                    {vehicle.name}
                                </option>
                            ))
                        ) : (
                            <option value="">Chưa có xe nào</option>
                        )}
                    </Select>
                </Box>
                
                <Box mr={4} sx={{  display: 'flex', alignItems: 'center' }}>
                    <Label mr={2} sx={{  fontWeight: '600',
                            color: '#476282', width: 'auto', minWidth: 'fit-content' }} htmlFor="name">
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
                            fontSize: '18px'
                        }}
                    >
                        <Input
                            sx={{
                                width: '400px',
                                outline: 'none',
                                border: 'none',
                            fontSize: '15px'
                            }}
                            name="name"
                            onChange={(e) => {
                                // handleFilter(e.target.value)
                            }}
                            type="text"
                            placeholder="Tìm kiếm đơn vận chuyển..."
                        />
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </Box>
                </Box>
                <Button onClick={()=>{setModal(true)}} sx={{
                    background: '#476282',
                    color: 'white',
                    transition: 'all 0.3s',
                    '&:hover':{
                        transform: 'scale(1.1)'
                    }
                }}>
                    <Image sx={{width: '18px', verticalAlign:"sub"}} mr={1} src="/png/plus.png"/>
                    <Text as="span">Thêm mới</Text></Button>
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
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Hình ảnh
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Họ và tên
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Số điện thoại
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Tuổi
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Giới tính
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Loại phương tiện
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Ngày tham gia
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Hành động
                    </Box>
                </Box>
                {children}
            </Box>
        {modal &&  <Modal vehicles={vehicles} close={()=>{setModal(false)}}/>}

        </Box>
    )
}
