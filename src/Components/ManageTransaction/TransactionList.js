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
    console.log(data)
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
    }, [data])

    useEffect(() => {
        callbackFunc()
    }, [page])

    const handleFilter = (keyword) => {
        const filterResult = data.filter((tran, index) => {
            return (
                tran.transportCode.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
                users[index].phone.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
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
                        T??? ng??y
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
                            marginLeft: '12px'
                        }}
                    >
                        ?????n ng??y
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
                        T??m ki???m
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
                            placeholder="Nh???p m?? v???n chuy???n, s??? ??i???n tho???i..."
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
                        Ng??y kh???i t???o
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
                        M?? v???n chuy???n
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
                        T??n kh??ch h??ng
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
                        S??? ??i???n tho???i
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
                        Tr???ng th??i
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
                        Thao t??c
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
                    <Text sx="span">Kh??ng c?? y??u c???u v???n chuy???n n??o!</Text>
                </Box>
            ) : (
                <Box>
                    <Pagination pagination={pagination} handlePageChange={handlePageChange} />
                </Box>
            )}
        </Box>
    )
}
