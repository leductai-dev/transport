import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import { Button, Text, Box, Image } from 'rebass'
export default function ModalTransaction({ setShowTransactionInfo }) {
    return (
        <Box
            sx={{
                transition: 'all 0.4s',
                position: 'fixed',
                width: '80%',
                minWidth: '800px',
                height: '90%',
                minHeight: '500px',
                top: '49%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                backgroundColor: '#fff',
                boxShadow: '1px 1px 6px 1px #00000085',
                zIndex: 1000000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '4px',
            }}
        >
            <Box
                sx={{
                    padding: '5px 12px',
                    borderBottom: '1px solid gray',
                    fontSize: '20px',
                    color: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#eff0f3',
                }}
            >
                <Text sx={{ marginRight: 'auto' }}>TP-3584-1045</Text>
                <Text sx={{ marginRight: '8px', fontSize: '15px' }}>Initial day:</Text>
                <Text sx={{ marginRight: '50px', fontSize: '15px' }}>15-10-2021</Text>
                <Button
                    sx={{
                        backgroundColor: 'transparent',
                        fontSize: '20px',
                        outline: 'none !important',
                        border: 'none',
                        color: 'black',
                        padding: 0,
                    }}
                    onClick={() => {
                        setShowTransactionInfo(false)
                    }}
                >
                    X
                </Button>
            </Box>
            <Box
                sx={{
                    p: '30px 25px 40px 25px',
                    overflowY: 'auto',
                    flexGrow: 1,
                    backgroundColor: '#F7FAFC',
                }}
            >
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '30%', textAlign: 'center' }}>
                        <Image
                            sx={{
                                width: '200px',
                            }}
                            src="http://orthok.vn/wp-content/uploads/2018/10/avatar-NAM.png"
                        ></Image>
                    </Box>
                    <Box sx={{ width: '70%', pt: '10px' }}>
                        <Text
                            sx={{
                                fontWeight: 'bold',
                                fontSize: '30px',
                            }}
                        >
                            John Doe
                        </Text>
                        <Text
                            sx={{
                                borderBottom: '1px solid #80808030',
                                pb: '8px',
                            }}
                        >
                            Customer
                        </Text>
                        <Box
                            sx={{
                                pt: '10px',
                                lineHeight: '30px',
                            }}
                        >
                            <Text>
                                <i class="fa fa-phone mr-2 " aria-hidden="true"></i> Phone:
                                0926772712
                            </Text>
                            <Text>
                                <i class="fa fa-envelope mr-2" aria-hidden="true"></i>
                                Email: useremail99@gmail.com
                            </Text>
                            <Text>
                                <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                                Join Day: 12-02-2022
                            </Text>
                            <Text></Text>
                        </Box>
                    </Box>
                </Box>

                <Box
                    sx={{
                        p: '25px',
                        pt: '30px',
                    }}
                >
                    <Box
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '25px',
                            position: 'relative',
                            '&:after': {
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                transform: 'translateY(-50%)',
                                width: '100%',
                                height: '1px',
                                backgroundColor: 'gray',
                                zIndex: -1,
                                content: "''",
                            },
                        }}
                    >
                        <Text
                            as="p"
                            sx={{
                                zIndex: 1,
                                background: '#fff',
                                width: 'fit-content',
                                pr: '10px',
                            }}
                        >
                            Transport Infomations
                        </Text>
                    </Box>
                    <Box
                        sx={{
                            columnCount: 2,
                            lineHeight: '45px',
                            p: '10px',
                        }}
                    >
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>{' '}
                        <Text>
                            <i class="fa fa-calendar mr-2" aria-hidden="true"></i>
                            Join Day: 12-02-2022
                        </Text>
                    </Box>
                </Box>
                <Box
                    sx={{
                        p: '5px 25px 0 25px',
                    }}
                >
                    <Box
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '25px',
                            position: 'relative',
                            '&:after': {
                                position: 'absolute',
                                top: '50%',
                                left: 0,
                                transform: 'translateY(-50%)',
                                width: '100%',
                                height: '1px',
                                backgroundColor: 'gray',
                                zIndex: -1,
                                content: "''",
                            },
                        }}
                    >
                        <Text
                            as="p"
                            sx={{
                                zIndex: 1,
                                background: '#fff',
                                width: 'fit-content',
                                pr: '10px',
                            }}
                        >
                            Product Pictures
                        </Text>
                    </Box>

                    <Box
                        sx={{
                            columnCount: 2,
                            lineHeight: '40px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            pt: '10px',
                        }}
                    >
                        <Box
                            sx={{
                                width: '33.33%',
                                height: '170px',
                                padding: '0px 5px',
                            }}
                        >
                            <Image
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHLS5JQrUrZ-34pgIuaWnjyF3iV5Qv3V_nQ&usqp=CAU"
                            ></Image>
                        </Box>
                        <Box
                            sx={{
                                width: '33.33%',
                                height: '170px',
                                padding: '0px 5px',
                            }}
                        >
                            <Image
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHLS5JQrUrZ-34pgIuaWnjyF3iV5Qv3V_nQ&usqp=CAU"
                            ></Image>
                        </Box>
                        <Box
                            sx={{
                                width: '33.33%',
                                height: '170px',
                                padding: '0px 5px',
                            }}
                        >
                            <Image
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHLS5JQrUrZ-34pgIuaWnjyF3iV5Qv3V_nQ&usqp=CAU"
                            ></Image>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
