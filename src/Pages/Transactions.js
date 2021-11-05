import React, { useEffect, useState } from "react";
import TransactionList from "../Components/TransactionList";
import TransactionItem from "../Components/TransactionItem";
import { app } from "../firebaseConfig";
import { Box, Text, Image, Button } from "rebass";

export default function History() {
    const [pending, setPending] = useState();
    const [progress, setProgress] = useState();
    const [completed, setCompleted] = useState();

    useEffect(() => {
        const db_Transactions = app
            .database()
            .ref()
            .child("/system/transactions/");
        db_Transactions.on("value", (snap) => {
            console.log("snap---");
            console.log(snap.val());
            if (snap.val()) {
                if (snap.val().pending) {
                    setPending(Object.values(snap.val().pending));
                }
                if (snap.val().inProgress) {
                    setProgress(Object.values(snap.val().inProgress));
                }
                if (snap.val().completed) {
                    setCompleted(Object.values(snap.val().completed));
                }
            }
        });
    }, []);

    console.log("pending")
    console.log(pending)
    return (
        <div className="flex-grow-1 map">
            <Box
                sx={{
                    p: "15px",
                    background: "#fff",
                    minHeight: "100vh",
                }}
            >
                <Text
                    sx={{
                        fontSize: "30px",
                        fontWeight: "bold",
                        color: "#1b3a57",
                    }}
                    as="h1"
                >
                    Quản lý vận chuyển
                </Text>
                <hr style={{ marginTop: "5px", marginBottom: "0px" }} />
                <Box>
                    <Box sx={{ paddingTop: "20px" }}>
                        <ul
                            style={{ borderBottom: "none" }}
                            className="nav nav-tabs ul-height"
                            role="tablist"
                        >
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: "none",
                                        paddingLeft: "0 !important",
                                   color: "#476282",
                                        fontWeight: 600,     
                                    }}
                                    className="nav-link active"
                                    data-toggle="tab"
                                    href="#all"
                                >
                                    Tất cả (3)
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: "none",
                                        color: "#476282",
                                    }}
                                    className="nav-link "
                                    data-toggle="tab"
                                    href="#home"
                                >
                                    Chờ xử lý
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: "none",
                                        color: "#476282",
                                    }}
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#menu1"
                                >
                                    Đang diễn ra
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    style={{
                                        border: "none",
                                        color: "#476282",
                                    }}
                                    className="nav-link"
                                    data-toggle="tab"
                                    href="#menu2"
                                >
                                    Đã hoàn thành
                                </a>
                            </li>
                        </ul>
                        <div className=" tab-content tab-container">
                            <div id="all" className="container tab-pane active">
                                <TransactionList>
                                {pending && pending.map((value, index) =><TransactionItem
                                                key={index}
                                                data={value}
                                            />
                                    )}
                                </TransactionList>
                            </div>  
                            <div id="home" className="container tab-pane ">
                              
                            </div>
                            <div id="menu1" className="container tab-pane fade">
                                <br />
                                {/* {showProgress()} */}
                            </div>
                            <div id="menu2" className="container tab-pane fade">
                                <br />
                                {/* {showCompleted()} */}
                            </div>
                        </div>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
