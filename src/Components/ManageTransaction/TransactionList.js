import React, { useEffect, useState, useRef } from 'react'
import { app } from '../../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'
import TransactionItem from './TransactionItem'
import usePagination from '../../Hooks/usePagination'
import { Pagination } from '../Pagination'
import { Input, Label, Select, Checkbox } from '@rebass/forms'

export default function TransactionList({ data, callbackFunc }) {
    const { pagination, handlePageChange, setPagination } = usePagination(10)
    const { limit, page } = pagination
    const [_data, set_data] = useState([])
    const [users, setUser] = useState([])

    useEffect(() => {
        const rs = []
        data.forEach((tran) => {
            const customer_db = app.database().ref().child(`/customers/${tran.customerId}`)
            customer_db.once('value', (snap) => {
                if (snap.val()) {
                    rs.push(snap.val())
                }
            })
        })
        setUser(rs)
        set_data(data)
        setPagination({ ...pagination, totalCount: data.length })
    }, [])

    useEffect(() => {
        callbackFunc()
    }, [page])

    const handleFilter = (keyword) => {
        const filterResult = data.filter((tran, index) => {
            return (
                tran.transportCode.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
                users[index].phone.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
                users[index].name.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
            )
        })
        console.log(filterResult)
        set_data(filterResult)
        setPagination({ ...pagination, page: 1, totalCount: filterResult.length })
    }
    const handleChange = () => {}
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    borderBottom: '1px solid gray',
                    paddingBottom: '10px',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Text
                        sx={{
                            fontWeight: '600',
                            color: '#476282',
                            padding: '3px 10px',
                        }}
                    >
                        Từ ngày
                    </Text>
                    <input
                        style={{
                            height: '40px',
                            width: '180px',
                            border: '1px solid #e3e3e3',
                            background: '#cdcdcd14',
                        }}
                        type="date"
                        id="birthDay"
                        name="birthDay"
                        onChange={handleChange}
                    ></input>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Text
                        sx={{
                            fontWeight: '600',
                            color: '#476282',
                            padding: '3px 10px',
                        }}
                    >
                        Đến ngày
                    </Text>
                    <input
                        style={{
                            height: '40px',
                            width: '180px',
                            border: '1px solid #e3e3e3',
                            background: '#cdcdcd14',
                        }}
                        type="date"
                        id="birthDay"
                        name="birthDay"
                        onChange={handleChange}
                    ></input>
                </Box>
                <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Label
                        mr={2}
                        sx={{
                            fontWeight: '600',
                            color: '#476282',
                            width: 'auto',
                            minWidth: 'fit-content',
                        }}
                        htmlFor="name"
                    >
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
                            fontSize: '18px',
                        }}
                    >
                        <Input
                            sx={{
                                width: '400px',
                                outline: 'none',
                                border: 'none',
                                fontSize: '15px',
                            }}
                            name="name"
                            onChange={(e) => {
                                handleFilter(e.target.value)
                            }}
                            type="text"
                            placeholder="Nhập mã vận chuyển đề tìm kiếm..."
                        />
                        <i class="fa fa-search" aria-hidden="true"></i>
                    </Box>
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
                {_data.length > 0 &&
                    _data
                        .slice((page - 1) * limit, page * limit)
                        .map((value, index) => <TransactionItem key={index} data={value} />)}
            </Box>
            {_data.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        paddingTop: '100px',
                        color: 'black',
                        margin: '50px auto',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text sx="span">Không có yêu cầu vận chuyển nào!</Text>
                </Box>
            ) : (
                <Box>
                    <Pagination pagination={pagination} handlePageChange={handlePageChange} />
                </Box>
            )}
        </Box>
    )
}
