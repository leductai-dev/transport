import { Button, Text, Box, Image } from "rebass";
import { setDataTransaction } from "../Actions/Action_transactions";
import { useDispatch } from "react-redux";

import React, { useState } from "react";
export const MenuOption = ({ transactions }) => {
    const [showOptions, setShowOptions] = useState(true);
    const dispatch = useDispatch();

    return (
        <>
            <Button
                sx={{
                    position: "absolute",
                    right: "5px",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "transparent",
                    fontSize: "35px",
                    outline: "none !important",
                    border: "none",
                }}
                onClick={() => {
                    setShowOptions(true);
                }}
            >
                <i class="fa fa-bars" aria-hidden="true"></i>
            </Button>
            <Box
                sx={{
                    transition: "all 0.4s",
                    position: "fixed",
                    width: "300px",
                    right: 0,
                    top: 0,
                    height: "100vh",
                    backgroundColor: "#fff",
                    boxShadow: "1px 1px 6px 1px #00000085",
                    zIndex: 1000,
                    transform: `${
                        showOptions ? "translateX(0)" : "translateX(100%)"
                    }`,
                }}
            >
                <Box
                    sx={{
                        padding: "5px 12px",
                        borderBottom: "1px solid #476282",
                        fontSize: "20px",
                        color: "black",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        color: '#fff',
                        background: '#0e5daa'
                    }}
                >
                    <Text sx={{ fontWeight: '600', }}>Chọn chế độ hiển thị</Text>
                    <Button
                        sx={{
                            backgroundColor: "transparent",
                            fontSize: "20px",
                            outline: "none !important",
                            border: "none",
                            padding: 0,
                            color: '#fff',
                            }}
                        onClick={() => {
                            setShowOptions(false);
                        }}
                    >
                        <i class="fa fa-times" aria-hidden="true"></i>
                    </Button>
                </Box>
                <Box sx={{}}>
                    {transactions && (
                        <Button
                        onClick={() => {
                            dispatch(
                                setDataTransaction(Object.values(transactions))
                            );
                        }}
                        sx={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "transparen",
                            color: "black",
                            textAlign: "left",
                            borderBottom: "1px solid gray",
                            outline: 'none !important'
                        }}
                    >
                        View all
                    </Button>
                    )}
                    {transactions &&
                        Object.values(transactions).map(
                            (transaction, index) => (
                                <Button
                                    key={index}
                                    onClick={() => {
                                        dispatch(
                                            setDataTransaction([transaction])
                                        );
                                    }}
                                    sx={{
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "transparen",
                                        color: "black",
                                        textAlign: "left",
                                        borderBottom: "1px solid gray",
                                        outline: 'none !important'
                                    }}
                                >
                                    TP-0245-8545
                                </Button>
                            )
                        )}
                </Box>
            </Box>
        </>
    );
};
