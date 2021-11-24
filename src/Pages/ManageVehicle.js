import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Set_Page, Read_Data, Set_Team, On_Read_Data } from '../Actions/Actions'
import { app } from '../firebaseConfig'
import VehicleList from '../Components/ManageVehicle/VehicleList'
import VehicleItem from '../Components/ManageVehicle/VehicleItem'
import usePagination from '../Hooks/usePagination'
import { Pagination } from '../Components/Pagination'

import { Box, Text, Image, Button } from 'rebass'
const ManagerTeam = () => {
    // var database = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/`)
    const [data, setData] = useState(null)
    const {pagination,handlePageChange, setPagination} = usePagination(10)
    const {limit,page} =pagination
    useEffect(() => {
        const db_Vehicles = app.database().ref().child('/vehicles')
        db_Vehicles.on('value', (snap) => {
            if (snap.val()) {
                    setData(Object.values(snap.val()))
            }
            setPagination({...pagination,totalCount:Object.values(snap.val()).length})

        })
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
                    Quản lý phương tiện
                </Text>
                <hr style={{ marginTop: '5px', marginBottom: '0px' }} />
                <Box>
                    <Box sx={{ paddingTop: '20px' }}>
                        <VehicleList>
                            {data &&
                              data.slice((page-1)*limit,page *limit).map((value, index) => <VehicleItem key={index} data={value} />)}
                        </VehicleList>
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

