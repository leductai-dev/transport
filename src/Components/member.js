import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'
import { Box, Text, Image, Button } from 'rebass'


export default function Member(props) {

    
        return (
          <div className="col p-2 h-100  mb-4">
                    <Box sx={{border: '1px solid #e5e4e4', width: '100%'}}>
                        <Image sx={{
                            width: '100%',
                            height: '170px',
                            objectFit: 'cover'
                        }} src="https://i.pinimg.com/564x/e0/0f/6b/e00f6b154d737c690f6ceba8e13b6e97.jpg"></Image>
                        <Box sx={{
                            padding: '5px'
                        }}>
                            <Box sx={{
                                fontSize: '15px',
                                color: 'gray',
                                fontWeight: 'normal'
                            }}>
                                <Text sx={{fontWeight:'bold', marginRight: '7px'}} as="span">Họ và tên:</Text>
                                <Text as="span">Lê Đức Tài</Text>
                            </Box>
                            <Box sx={{
                                fontSize: '15px',
                                color: 'gray',
                                fontWeight: 'normal'
                            }}>
                                <Text sx={{fontWeight:'bold', marginRight: '7px'}} as="span">Điện thoại:</Text>
                                <Text as="span">0926772712</Text>
                            </Box>
                            <Box sx={{
                                fontSize: '15px',
                                color: 'gray',
                                fontWeight: 'normal'
                            }}>
                                <Text sx={{fontWeight:'bold', marginRight: '7px'}} as="span">Loại xe:</Text>
                                <Text as="span">Xe tải X50 10 tấn</Text>
                            </Box>
                        </Box>
                        <Box sx={{display: 'flex'}}>
                            <Button py={'10px'} px={'0px'} sx={{width: '50%', background: 'linear-gradient(to left, #00c6fb 0%, #005bea 100%)', color: '#fff', borderRadius: '0px'}}>Chỉnh sửa</Button>
                            <Button py={'10px'} px={'0px'} sx={{width: '50%', background: 'linear-gradient(to right, #00c6fb 0%, #005bea 100%)', color: '#fff', borderRadius: '0px'}}>Xóa </Button>
                        </Box>
                    </Box>
                </div>
        
        )
    }
