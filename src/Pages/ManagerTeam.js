import React, { Component } from 'react'
import ListTeam from '../Components/listTeam'
import { connect } from 'react-redux'
import { Set_Page, Read_Data, Set_Team, On_Read_Data } from './../Actions/Actions'
import { app } from '../firebaseConfig'
import $ from 'jquery'

import { Box, Text, Image, Button } from 'rebass'
const ManagerTeam = () => {
    // var database = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/`)

    const createNewMember = () => {
        this.database = app
            .database()
            .ref()
            .child(
                `CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${
                    this.props.infos.currentTeam
                }/members`
            )
        this.database.push({
            name: 'Null',
            phone: 'Null',
            position: 'Null',
            avatar: `./png/avatar_${Math.floor(Math.random() * 5) + 1}.jpg`,
        })
    }

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
                    }}
                    as="h1"
                >
                    Quản lý thành viên
                </Text>
                <hr style={{ marginTop: '5px', marginBottom: '0px' }} />
                <Box>
                    <Box sx={{ paddingTop: '20px' }}>
                        <ListTeam />
                    </Box>
                </Box>
                {/* <Box
                    sx={{ width: "85vw", height: "90vh", position: "fixed", border: '1px solid black', background: '#fff', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000000000000 }}
                ></Box> */}
            </Box>
        </div>
    )
}
export default ManagerTeam
