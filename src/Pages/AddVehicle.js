import React, { useRef, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Box, Button, Text, Image } from 'rebass'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { app } from '../firebaseConfig'
import { v4 as uuidv4 } from 'uuid'
import ImageUploading from 'react-images-uploading'
// import axios from "axios";
import { useSelector } from 'react-redux'
import { Label, Input, Select, Textarea, Radio, Checkbox } from '@rebass/forms'

export default function AddVehicle() {
    const history = useHistory()
    const form = useRef()
    const [images, setImages] = React.useState([])

    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList)
    }
    const uploadPhoto = async (data) => {
        const _data = { value: data }
        // return new Promise((resolve, reject) => {
        //     axios
        //         .post("http://localhost:2001/upload-image", _data)
        //         .then((res) => resolve(res.data))
        //         .catch((err) => reject(err));
        // });
    }
    const formik = useFormik({
        initialValues: {
            address: '',
            dateofbirth: '',
            email: '',
            name: '',
            phone: '',
            sex: '',
            licensePlates: '',
            maxPayload: '',
            vehicleName: '',
            height: '',
            length: '',
            width: '',
        },
        validationSchema: Yup.object({
            senderName: Yup.string()
                .min(3, 'Mininum 3 characters')
                .max(30, 'Maximum 30 characters')
                .required('Required!'),
            senderPhone: Yup.string()
                .min(9, 'Mininum 9 characters')
                .max(11, 'Maximum 11 characters')
                .required('Required!'),
            receiverName: Yup.string()
                .min(3, 'Mininum 4 characters')
                .max(15, 'Maximum 30 characters')
                .required('Required!'),
            receiverPhone: Yup.string()
                .min(9, 'Mininum 9 characters')
                .max(11, 'Maximum 11 characters')
                .required('Required!'),
            fromAddress: Yup.string()
                .min(15, 'Mininum 15 characters')
                .max(200, 'Maximum 200 characters')
                .required('Required!'),
            toAddress: Yup.string()
                .min(15, 'Mininum 8 characters')
                .max(200, 'Maximum 200 characters')
                .required('Required!'),
            fromLat: Yup.string()
                .min(2, 'Mininum 2 characters')
                .max(20, 'Maximum 15 characters')
                .required('Required!'),
            toLat: Yup.string()
                .min(2, 'Mininum 2 characters')
                .max(20, 'Maximum 15 characters')
                .required('Required!'),
            fromLong: Yup.string()
                .min(2, 'Mininum 2 characters')
                .max(20, 'Maximum 15 characters')
                .required('Required!'),
            toLong: Yup.string()
                .min(2, 'Mininum 2 characters')
                .max(20, 'Maximum 15 characters')
                .required('Required!'),
            note: Yup.string().min(2, 'Mininum 2 characters').max(15, 'Maximum 200 characters'),
            productName: Yup.string()
                .min(6, 'Mininum 6 characters')
                .max(100, 'Maximum 100 characters')
                .required('Required!'),
            weight: Yup.number()
                .min(0.1, 'Mininum 1 characters')
                .max(10000, 'Maximum 4 characters')
                .required('Required!'),
            length: Yup.number()
                .max(15, 'Maximum 4 characters')
                .min(0.1, 'Mininum 1 characters')
                .required('Required!'),
            width: Yup.number()
                .min(0.1, 'Mininum 2 characters')
                .max(15, 'Maximum 4 characters')
                .required('Required!'),
            height: Yup.number()
                .min(0.1, 'Mininum 2 characters')
                .max(15, 'Maximum 4 characters')
                .required('Required!'),
            imageUrl: Yup.string(),
            //         // .required("Required!")
        }),
        onSubmit: (values) => {},
    })
    useEffect(() => {}, [])
    const { values, errors, handleSubmit, touched, handleChange } = formik

    return (
        <div className="flex-grow-1 map">
            <Box
                sx={{
                    p: '15px',
                }}
            >
                <Text
                    sx={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#1b3a57',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    as="h1"
                >
                    <Text
                        sx={{
                            cursor: 'pointer',
                            marginRight: '20px',
                            fontSize: '18px',
                        }}
                        onClick={() => {
                            history.push('/transactions')
                        }}
                        as="span"
                    >
                        <i class="fa fa-arrow-left" aria-hidden="true"></i>{' '}
                    </Text>{' '}
                    Thêm thành viên
                </Text>
                <hr style={{ marginTop: '5px', marginBottom: '0px' }} />
                <Box>
                    <Box
                        sx={{
                            p: '50px 25px 40px 25px',
                            overflowY: 'auto',
                            flexGrow: 1,
                            backgroundColor: '#F7FAFC',
                        }}
                    >
                        <Box
                            sx={{
                                p: '5px 25px 0 25px',
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div class="row p-20 m-0">
                                    <Box>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            name="productName"
                                            value={values.productName}
                                            onChange={handleChange}
                                        />
                                        {errors.productName && touched.productName && (
                                            <Box
                                                sx={{
                                                    color: 'red',
                                                    top: '40px',
                                                }}
                                            >
                                                {errors.productName}
                                            </Box>
                                        )}
                                    </Box>

                                    <div class="form-grid col-md-6 col-lg-6 col-xl-6">
                                        <h3>Hình ảnh</h3>
                                        <Text>Vui lòng đăng tải ít nhất 1 hình ảnh!</Text>
                                        <ImageUploading
                                            multiple
                                            value={images}
                                            onChange={onChange}
                                            maxNumber={10}
                                            dataURLKey="data_url"
                                        >
                                            {({
                                                imageList,
                                                onImageUpload,
                                                onImageRemoveAll,
                                                onImageUpdate,
                                                onImageRemove,
                                                isDragging,
                                                dragProps,
                                            }) => (
                                                // write your building UI
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexWrap: 'wrap',
                                                    }}
                                                    className="upload__image-wrapper mt-1"
                                                >
                                                    {imageList.map((image, index) => (
                                                        <Box
                                                            key={index}
                                                            sx={{
                                                                position: 'relative',
                                                                marginRight: '15px',
                                                                marginBottom: '15px',
                                                                border: '1px solid #b3abab',
                                                                width: '100px',
                                                                height: '110px',
                                                            }}
                                                        >
                                                            <Image
                                                                src={image.data_url}
                                                                alt=""
                                                                sx={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                }}
                                                            />
                                                            <Button
                                                                sx={{
                                                                    border: 'none',
                                                                    background: 'transparent',
                                                                    position: 'absolute',
                                                                    padding: '0px 1px',
                                                                    color: '#343333',
                                                                    right: 0,
                                                                    top: 0,
                                                                }}
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    onImageRemove(index)
                                                                }}
                                                            >
                                                                <i
                                                                    class="fa fa-times-circle"
                                                                    aria-hidden="true"
                                                                ></i>
                                                            </Button>
                                                        </Box>
                                                    ))}
                                                    <Button
                                                        sx={{
                                                            width: '100px',
                                                            height: '110px',
                                                            border: 'none',
                                                            overflow: 'hidden',
                                                            borderStyle: 'outset',
                                                        }}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            onImageUpload()
                                                        }}
                                                        {...dragProps}
                                                    >
                                                        <Image
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    transform: 'scale(1.2)',
                                                                },
                                                            }}
                                                            src="/images/upload-placeholder.jpg"
                                                        ></Image>
                                                    </Button>
                                                </Box>
                                            )}
                                        </ImageUploading>
                                    </div>
                                    <Button
                                        sx={{
                                            margin: '30px auto 80px',
                                            padding: '20px 250px',
                                            background:
                                                '-webkit-linear-gradient(135deg, rgb(255, 16, 83) 0%, rgb(52, 82, 255) 100% )',
                                            outline: 'none',
                                        }}
                                        type="submit"
                                    >
                                        Gửi yêu cầu
                                    </Button>
                                </div>
                            </form>

                            <Box>
                                <Button>Hủy yêu cầu</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
