import React, { useEffect, useState,useRef } from 'react'
import TransactionList from '../Components/ManageTransaction/TransactionList'
import { app } from '../firebaseConfig'
import { Box, Text, Image, Button } from 'rebass'

export default function History() {
    const [all, setAll] = useState([])
    const [pending, setPending] = useState([])
    const [driverPending, setDriverPeding] = useState([])
    const [inProgress, setInProgress] = useState([])
    const [completed, setCompleted] = useState([])
    const [canceled, setCanceled] = useState([])
    const ref = useRef()
    const scroll = () =>{
        ref.current.scrollIntoView({
            behavior: 'smooth'
        }, 500)
    }
    useEffect(() => {
        const db_Transactions = app.database().ref().child('/transactions')
        const pending = []
        const driverPending = []
        const inProgress = []
        const completed = []
        const canceled = []
        db_Transactions.once('value', (snap) => {
            if (snap.val()) {
                Object.values(snap.val()).forEach((item) => {
                    if (item.status === 'pending') {
                        pending.push(item)
                    }
                    if (item.status === 'driverPending') {
                        driverPending.push(item)
                    }
                    if (item.status === 'inProgress') {
                        inProgress.push(item)
                    }
                    if (item.status === 'completed') {
                        completed.push(item)
                    }
                    if (item.status === 'canceled') {
                        canceled.push(item)
                    }
                })
                setAll(Object.values(snap.val()).sort((a,b)=> b.initialTime - a.initialTime))
                setPending(pending.sort((a,b)=> b.initialTime - a.initialTime))
                setDriverPeding(driverPending.sort((a,b)=> b.initialTime - a.initialTime))
                setInProgress(inProgress.sort((a,b)=> b.initialTime - a.initialTime))
                setCompleted(completed.sort((a,b)=> b.initialTime - a.initialTime))
                setCanceled(canceled.sort((a,b)=> b.initialTime - a.initialTime))
            }
        })
    }, [])

    return (
        <div className="flex-grow-1 map">
            <Box ref={ref}
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
                    Quản lý vận chuyển
                </Text>
                <hr style={{ marginTop: '5px', marginBottom: '0px' }} />
                <Box>
                    <Box sx={{ paddingTop: '20px' }}>
                        <ul
                            style={{ borderBottom: 'none' }}
                            className="nav nav-tabs ul-height"
                            role="tablist"
                        >
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: 'none',
                                        paddingLeft: '0 !important',
                                        color: '#476282',
                                        fontWeight: 600,
                                    }}
                                    className="nav-link active"
                                    data-toggle="tab"
                                    href="#all"
                                >
                                    Tất cả ({all.length})
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: 'none',
                                        color: '#476282',
                                    }}
                                    className="nav-link "
                                    data-toggle="tab"
                                    href="#home"
                                >
                                    Chờ xử lý ({pending.length})
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: 'none',
                                        color: '#476282',
                                    }}
                                    className="nav-link "
                                    data-toggle="tab"
                                    href="#chuyengiao"
                                >
                                    Đã chuyển giao ({driverPending.length})
                                </a>
                            </li>

                            <li className="nav-item">
                                <a
                                    style={{
                                        border: 'none',
                                        color: '#476282',
                                    }}
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#menu1"
                                >
                                    Đang vận chuyển ({inProgress.length})
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: 'none',
                                        color: '#476282',
                                    }}
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#menu2"
                                >
                                    Đã hoàn thành ({completed.length})
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: 'none',
                                        color: '#476282',
                                    }}
                                    className="nav-link "
                                    data-toggle="tab"
                                    href="#dahuy"
                                >
                                    Đã Hủy ({canceled.length})
                                </a>
                            </li>
                        </ul>
                        <div className=" tab-content tab-container">
                            <div id="all" className=" tab-pane active">
                                <TransactionList callbackFunc={scroll} data={all} />
                            </div>
                            <div id="home" className=" tab-pane fade">
                                <TransactionList callbackFunc={scroll} data={pending} />
                            </div>
                            <div id="chuyengiao" className=" tab-pane fade">
                                <TransactionList callbackFunc={scroll} data={driverPending} />
                            </div>
                            <div id="menu1" className=" tab-pane fade">
                                <TransactionList callbackFunc={scroll} data={inProgress} />
                            </div>
                            <div id="menu2" className=" tab-pane fade">
                                <TransactionList callbackFunc={scroll} data={completed} />
                            </div>
                            <div id="dahuy" className=" tab-pane fade">
                                <TransactionList callbackFunc={scroll} data={canceled} />
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
