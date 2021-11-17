import React, { useEffect, useState } from 'react'
import HistoryItem from '../historyItem'
import { app } from '../../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import Modal from "./ModalAddVehicle"

export default function VehicleList({ children }) {
    const [modal, setModal] = useState(false);

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
                    <Text sx={{ fontWeight: '600', color: '#476282',padding: '3px 10px'}}>Phân loại xe:</Text>
                    <select style={{width: '150px'}}>
                        <option>Loại 1</option>
                        <option>Loại 1</option>
                        <option>Loại 1</option>
                    </select>
                </Box>
                
                <Box sx={{display:'flex', alignItems: 'center'}} mr={3}>
                <Text sx={{ fontWeight: '600', color: '#476282'}}>Tìm kiếm</Text>
                <input
                    placeholder="Nhập tên hoặc số thoại, biển số xe..."
                    type="text"
                    style={{
                        borderRadius: '50px',
                        padding: '5px 10px',
                        outline: 'none',
                        border: '1px solid #476282',
                        width: '400px',
                    }}
                />
                </Box>
                <Button onClick={()=>{setModal(true)}} sx={{
                    background: '#476282',
                    color: 'white'
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
                        Loại xe
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Kích thước
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Trọng tải
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Số lượng
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{ display: 'table-cell',textAlign:'center', fontWeight: '600', color: '#476282' }}
                    >
                        Đang sử dụng
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
        {modal &&  <Modal close={()=>{setModal(false)}}/>}

        </Box>
    )
}
