import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Set_Page, Read_Data, Set_Team, On_Read_Data } from '../Actions/Actions'
import { app } from '../firebaseConfig'
import usePagination from '../Hooks/usePagination'
import { Pagination } from '../Components/Pagination'
import MemberList from '../Components/ManageMember/MemberList'
import MemberItem from '../Components/ManageMember/MemberItem'
import { Box, Text, Image, Button } from 'rebass'
const ManagerTeam = () => {
    // var database = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/`)
    const [data, setData] = useState(null)
    const [vehicles, setVehicles] = useState(null)
    const {pagination,handlePageChange, setPagination} = usePagination(10)
    const {limit,page} =pagination
    useEffect(() => {
        try {
            const db_drivers = app.database().ref().child('/drivers')
            db_drivers.on('value', (snap) => {
                if (snap.val()) {
                    setData(Object.values(snap.val()))
                    setPagination({...pagination,totalCount:Object.values(snap.val()).length})
                }
            })

            const db_Vehicles = app.database().ref().child('/vehicles')
            db_Vehicles.on('value', (snap) => {
                if (snap.val()) {
                    setVehicles(Object.values(snap.val()))
                }
            })
        } catch (err) {
            alert('Có lỗi xảy ra vui lòng thử lại')
        }
    }, [])

    return (
        <div className="flex-grow-1 map">
            <Box
                sx={{
                    p: '15px',
                    background: '#fff',
                    minHeight: '100vh',
                }}
            >
                <Text
                    sx={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#1b3a57',
                    }}
                    as="h1"
                >
                    Quản lý thành viên
                </Text>
                <hr style={{ marginTop: '5px', marginBottom: '0px' }} />
                <Box>
                    <Box sx={{ paddingTop: '20px' }}>
                        <MemberList vehicles={vehicles}>
                            {data &&
                                data.slice((page-1)*limit,page *limit).map((value, index) => <MemberItem key={index} vehicles={vehicles} data={value} />)}
                        </MemberList>
                    </Box>
                </Box>
                {/* <Box
                    sx={{ width: "85vw", height: "90vh", position: "fixed", border: '1px solid black', background: '#fff', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000000000000 }}
                ></Box> */}
            <Pagination pagination={pagination} handlePageChange={handlePageChange}/>

            </Box>
        </div>
    )
}
export default ManagerTeam
