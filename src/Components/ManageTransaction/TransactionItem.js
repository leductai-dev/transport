import React, { useEffect, useState } from 'react'
import { app } from '../../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import ModalTransaction from './ModalTransactionInfo'
import { useHistory } from 'react-router-dom'
import convertDate from '../../Utils/ConvertDate'

export default function TransactionItem({ data }) {
    const [showTransactionInfo, setShowTransactionInfo] = useState(false)
    const [user, setUser] = useState({})
    const history = useHistory()
    const { customerId, transactionId, transportCode, initialTime, status } = data
    useEffect(() => {
        const customer_db = app.database().ref().child(`/customers/${customerId}`)
        customer_db.once('value', (snap) => {
            if (snap.val()) {
                setUser(snap.val())
            }
        })
    }, [data])
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
                    sx={{ display: 'table-cell', textAlign: 'center', color: '#476282' }}
                >
                   {convertDate(initialTime)}
                </Box>
                <Box
                    py={'5px'}
                    sx={{ display: 'table-cell', textAlign: 'center', color: '#476282' }}
                >
                    {transportCode}
                </Box>
                <Box
                    py={'5px'}
                    sx={{ display: 'table-cell', textAlign: 'center', color: '#476282' }}
                >
                    {user.name}
                </Box>
                <Box
                    py={'5px'}
                    sx={{ display: 'table-cell', textAlign: 'center', color: '#476282' }}
                >
                    {user.phone}
                </Box>
                <Box
                    py={'5px'}
                    sx={{ display: 'table-cell', textAlign: 'center', color: '#476282' }}
                >
                    {status === 'pending' ? 'Chờ xử lý' : status === 'inProgress' ? 'Đang giao' : status==='driverPending'? 'Chuyển giao' : status==='completed'?'Hoàn tất' : 'Đã hủy'}
                </Box>
                <Box
                    py={'5px'}
                    sx={{ display: 'table-cell', textAlign: 'center', color: '#476282' }}
                >
                    <Button
                        sx={{   background: '#477b9e',
                        color: 'white', }}
                        onClick={() => {
                            history.push(`/transaction/${transactionId}`)
                        }}
                    >
                         <i class="fa fa-eye" aria-hidden="true"></i>  Chi tiết
                    </Button>
                </Box>
            </Box>
            {showTransactionInfo && (
                <ModalTransaction setShowTransactionInfo={setShowTransactionInfo} />
            )}
        </>
    )
}
