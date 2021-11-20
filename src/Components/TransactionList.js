import React, { useEffect, useState } from 'react'
import HistoryItem from './historyItem'
import { app } from '../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import TransactionItem from './TransactionItem'

export default function TransactionList({ type }) {
    const [data, setData] = useState(null)

    useEffect(() => {
        if (!type) {
            const db_Transactions = app.database().ref().child('/transactions')
            db_Transactions.on('value', (snap) => {
                if (snap.val()) {
                    setData(Object.values(snap.val()))
                }
            })
            return
        }
        const db_Transactions = app
            .database()
            .ref()
            .child('/transactions')
            .orderByChild('status')
            .equalTo(type)
        db_Transactions.on('value', (snap) => {
            if (snap.val()) {
                setData(Object.values(snap.val()))
            }
        })
    }, [])

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    borderBottom: '1px solid gray',
                    paddingBottom: '10px',
                }}
            >
                <Box>
                    <label for="birthday">Birthday:</label>
                    <input type="date" id="birthday" name="birthday" />
                </Box>
                <Box>
                    <label for="birthday">Birthday:</label>
                    <input type="date" id="birthday" name="birthday" />
                </Box>
                <Box sx={{ marginLeft: 'auto' }}>
                    <label for="birthday">Search</label>
                    <input
                        placeholder="Tìm kiếm đơn vận chuyển..."
                        type="text"
                        id="birthday"
                        name="birthday"
                    />
                </Box>
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
                        sx={{
                            display: 'table-cell',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#476282',
                        }}
                    >
                        Ngày khởi tạo
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{
                            display: 'table-cell',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#476282',
                        }}
                    >
                        Mã vận chuyển
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{
                            display: 'table-cell',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#476282',
                        }}
                    >
                        Tên khách hàng
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{
                            display: 'table-cell',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#476282',
                        }}
                    >
                        Số điện thoại
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{
                            display: 'table-cell',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#476282',
                        }}
                    >
                        Trạng thái
                    </Box>
                    <Box
                        py={'10px'}
                        sx={{
                            display: 'table-cell',
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#476282',
                        }}
                    >
                        Thao tác
                    </Box>
                </Box>
                {data && data.map((value, index) => <TransactionItem key={index} data={value} />)}
            </Box>
        </Box>
    )
}
