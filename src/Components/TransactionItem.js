import React, { useEffect, useState } from "react";
import { app } from "../firebaseConfig";
import { Box, Text, Image, Button } from "rebass";
import ModalTransaction from "./ModalTransactionInfo"
import {useHistory} from 'react-router-dom'


export default function TransactionItem(props) {
    const [showTransactionInfo, setShowTransactionInfo] = useState(false);
    const [user, setUser] = useState({});
    const history = useHistory()
    const {customerId} = props.data
    useEffect(() => {
        console.log(customerId)
        const customer_db = app.database().ref().child(`/Customers/${customerId}`)
        customer_db.once("value", (snap) => {
            if(snap.val()){
                setUser(snap.val())
            }
        });
    }, [])
    return (
        <>
        <Box sx={{ display: "table-row", borderBottom: '1px solid #9391915c', marginBottom: '10px' }}>
        <Box py={"5px"} sx={{ display: "table-cell", color: "#476282", }}>15-12-2021</Box>
        <Box py={"5px"} sx={{ display: "table-cell", color: "#476282", }}>TP-202-150</Box>
        <Box py={"5px"} sx={{ display: "table-cell", color: "#476282", }}>{user.name}</Box>
        <Box py={"5px"} sx={{ display: "table-cell", color: "#476282", }}>{user.phone}</Box>
        <Box py={"5px"} sx={{ display: "table-cell", color: "#476282", }}>Pending</Box>
        <Box py={"5px"} sx={{ display: "table-cell", color: "#476282",  }}><Button sx={{background:'cornflowerblue'}} onClick={()=>{history.push('/transaction-detail')}}>Chi tiết</Button></Box>
    </Box>
    {showTransactionInfo && <ModalTransaction setShowTransactionInfo={setShowTransactionInfo} />}
    </>
    );
}
