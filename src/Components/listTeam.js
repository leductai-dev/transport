import React, { Component } from 'react'
import Member from './member'
import { app } from '../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import { useHistory } from 'react-router'

export default function ListTeam(props) {
    const history= useHistory()
    const member_render = () => {
        const members = props.members
        var result = null
        if (members) {
            result = Object.values(members).map((values, index) => {
                return (
                    <Member
                        key={index}
                        vt={index}
                        memberCode={Object.keys(members)[index]}
                        name={values.name}
                        phone={values.phone}
                        avatar={values.avatar}
                        position={values.position}
                    ></Member>
                )
            })
        }
        return result
    }

    return (
        <div className={`container `}>
            <Box
                sx={{
                    padding: '20px 0 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid gray'
                }}
            >
                <Box sx={{display:'flex'}}>
                    <Text>Phân loại xe:</Text>
                    <select style={{width: '150px'}}>
                        <option>Loại 1</option>
                        <option>Loại 1</option>
                        <option>Loại 1</option>
                    </select>
                </Box>
                
                <Box sx={{display:'flex', alignItems: 'center',}}>
                <Text
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        color: '#1b3a57',
                        marginRight: '10px',
                    }}
                >
                    Tìm kiếm
                </Text>
                <input
                    placeholder="Nhập tên hoặc số thoại, biển số xe..."
                    type="text"
                    style={{
                        borderRadius: '50px',
                        padding: '5px 10px',
                        outline: 'none',
                        border: '1px solid gray',
                        width: '300px',
                    }}
                />
                </Box>
                <Button onClick={()=>{history.push('/vehicle/add-new')}} sx={{
                    background: 'blue',
                    color: 'white'
                }}>Thêm mới</Button>
            </Box>
            <div className="row row-cols-sm-2 mt-2  row-cols-1 row-cols-md-4 row-cols-lg-5 gutters-sm">
                <Member />
                <Member />
                <Member />
                <Member />
                <Member />
            </div>
        </div>
    )
}
