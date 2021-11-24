import React, { useEffect, useState } from 'react'
import { Box, Text, Image, Button } from 'rebass'
import { Input, Label, Select, Checkbox } from '@rebass/forms'
import ImageUploading from 'react-images-uploading'
import { app } from '../../firebaseConfig'
import { v4 as uuidv4 } from 'uuid'
import uploadPhoto from '../../Utils/UploadImg'

export default function ModalAddMember({ close, data }) {
    const [images, setImages] = React.useState([])
    const [formData, setFormData] = React.useState({
        name: data?.name || '',
        totalCount: data?.totalCount || '',
        using: 0,
        image: data?.image || '',
        length: data?.length || '',
        width: data?.width || '',
        height: data?.height || '',
        payload: data?.payload || '',
    })
    console.log('formData')
    console.log(formData)

    const handleSubmit = () => {
        const { name, totalCount, length, width, height, payload } = formData
        console.log(formData)

        try {
            if (data) {
                console.log("if data")
                if (!name || !totalCount || !length || !width || !height || !payload) {
                    alert('Vui lòng nhập đầy đủ thông tin!')
                    return
                }
                const db_Vehicle = app.database().ref().child(`/vehicles/${data.vehicleId}`)
                if (images[0]) {
                    uploadPhoto(images[0].data_url).then((res) => {
                        const _data = { ...data, ...formData, image: res.message }
                        db_Vehicle.update(_data).then(() => {
                            close()
                            alert('Cập nhật thành công!')
                        })
                    })
                    return
                }
                console.log("if data2")
                const _data = { ...data, ...formData }
                db_Vehicle.update(_data).then(() => {
                    close()
                    alert('Cập nhật thành công!')
                })
                return
            }
            if (
                !name ||
                !totalCount ||
                images.length === 0 ||
                !length ||
                !width ||
                !height ||
                !payload
            ) {
                alert('Vui lòng nhập đầy đủ thông tin!')
                return
            }
            console.log('dsdsd')
            uploadPhoto(images[0].data_url).then((res) => {
                const vehicleId = uuidv4()
                const db_Vehicle = app.database().ref().child(`/vehicles/${vehicleId}`)
                const data = { ...formData, image: res.message, vehicleId }
                db_Vehicle.set(data).then(() => {
                    close()
                    alert('Thêm thành công!')
                })
            })
        } catch (err) {
            alert(err)
            alert('Có lỗi xảy ra vui lòng thử lại!')
        }
        console.log("dddddddddddd")
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: Number(e.target.value) || e.target.value })
    }

    return (
        <Box
            sx={{
                width: '450px',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: ' translate(-50%,-50%)',
                background: 'white',
                boxShadow: '1px 1px 10px 2px #44444457',
                borderRadius: '10px',
                padding: '5px',
                zIndex: 10,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Text
                    as="p"
                    sx={{
                        zIndex: 1,
                        width: 'fit-content',
                        color: '#1b3a57',
                        p: '10px',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                    }}
                >
                    Thêm phương tiện
                </Text>
                <Button
                    sx={{ backgroundColor: 'blue' }}
                    onClick={() => {
                        close()
                    }}
                >
                    x
                </Button>
            </Box>
            <Box p={3} sx={{}}>
                <Box sx={{ display: 'flex' }}>
                    <ImageUploading
                        value={images}
                        onChange={(imageList) => {
                            console.log(imageList)
                            setImages(imageList)
                        }}
                        maxNumber={10}
                        dataURLKey="data_url"
                    >
                        {({ imageList, onImageUpload, onImageRemove, dragProps }) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                }}
                                className="upload__image-wrapper mt-1"
                            >
                                {imageList.length > 0 ? (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            border: '1px solid #b3abab',
                                            width: '80px',
                                            height: '90px',
                                            marginTop: '20px',
                                        }}
                                    >
                                        <Image
                                            src={imageList[0].data_url}
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
                                                onImageRemove(0)
                                            }}
                                        >
                                            <i class="fa fa-times-circle" aria-hidden="true"></i>
                                        </Button>
                                    </Box>
                                ) : (
                                    <Button
                                        sx={{
                                            width: '80px',
                                            height: '90px',
                                            border: 'none',
                                            overflow: 'hidden',
                                            borderStyle: 'outset',
                                            marginTop: '20px',
                                            padding: 0,
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
                                            src={formData.image || '/png/upload-placeholder.jpg'}
                                        ></Image>
                                    </Button>
                                )}
                            </Box>
                        )}
                    </ImageUploading>
                    <Box ml={2} sx={{ flexGrow: 1 }}>
                        <Box mb={1}>
                            <Label htmlFor="name">Loại xe</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.name}
                                // defaultValue="sdsd"
                                name="name"
                                onChange={handleChange}
                                type="text"
                            />
                        </Box>
                        <Box mb={1}>
                            <Label htmlFor="name">Số lượng</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.totalCount}
                                name="totalCount"
                                type="number"
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box
                    mt={3}
                    sx={{
                        color: '#1b3a57',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '7px',
                    }}
                    mb={1}
                >
                    Kích thước thùng chứa
                </Box>
                <Box mb={1}>
                    <Box sx={{ display: 'flex' }}>
                        <Box pr={2} mb={1}>
                            <Label htmlFor="name">Chiều dài(m)</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.length}
                                name="length"
                                type="number"
                                onChange={handleChange}
                            />
                        </Box>
                        <Box pl={2} mb={1}>
                            <Label htmlFor="name">Chiều rộng(m)</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.width}
                                name="width"
                                type="number"
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box mb={1}>
                    <Box sx={{ display: 'flex' }}>
                        <Box pr={2} mb={1}>
                            <Label htmlFor="name">Chiều cao(m)</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.height}
                                name="height"
                                type="number"
                                onChange={handleChange}
                            />
                        </Box>
                        <Box pl={2} mb={1}>
                            <Label htmlFor="name">Trọng tải(kg)</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.payload}
                                name="payload"
                                type="number"
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box mt={4}>
                    <Button
                        sx={{
                            background: 'blue',
                            margin: ' 10px auto',
                            color: 'white',
                            padding: '10px 50px',
                            display: 'block',
                        }}
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        {data ? "Cập nhật" : "Thêm"}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
