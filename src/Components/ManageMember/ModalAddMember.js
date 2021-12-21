import React, { useEffect, useState } from 'react'
import { Box, Text, Image, Button } from 'rebass'
import { Input, Label, Select, Checkbox } from '@rebass/forms'
import ImageUploading from 'react-images-uploading'
import { app } from '../../firebaseConfig'
import { v4 as uuidv4 } from 'uuid'
import uploadPhoto from '../../Utils/UploadImg'
export default function ModalAddMember({ close, vehicles, data }) {
    const [images, setImages] = React.useState([])
    const [lat, setLat] = React.useState('')
    const [long, setLong] = React.useState('')

    const [formData, setFormData] = React.useState({
        name: data?.name || '',
        phone: data?.phone || '',
        sex: data?.sex || true,
        joinDate: data?.joinDate || '',
        birthDay: data?.birthDay || '',
        vehicleId: data?.vehicleId || '',
        status: true,
        image: data?.image || '',
    })
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude)
                setLong(position.coords.longitude)
            })
        } else {
            alert('Allow location!')
        }
    }, [])
    const handleSubmit = () => {
        const { name, phone, sex, joinDate, birthDay, vehicleId } = formData
        try {
            const db_Vehicles_New = app.database().ref().child(`/vehicles/${formData.vehicleId}`)

            const newVehicle = vehicles.filter(
                (vehicle) => vehicle.vehicleId === formData.vehicleId
            )[0]
            if (data) {
                if (!name || !phone || !joinDate || !birthDay || !vehicleId) {
                    alert('Vui lòng nhập đầy đủ thông tin!')
                    return
                }
                const db_Vehicles_Old = app.database().ref().child(`/vehicles/${data.vehicleId}`)
                const oldVehicle = vehicles.filter(
                    (vehicle) => vehicle.vehicleId === data.vehicleId
                )[0]

                const db_Drivers = app.database().ref().child(`/drivers/${data.driverId}`)

                if (images[0]) {
                    uploadPhoto(images[0].data_url).then((res) => {
                        const _data = { ...data, ...formData, image: res.message }
                        db_Drivers.update(_data)
                        if(formData.vehicleId !== data.vehicleId){
                            db_Vehicles_New.update({ ...newVehicle, using: newVehicle.using + 1 })
                            db_Vehicles_Old.update({ ...oldVehicle, using: oldVehicle.using - 1 })
                        }
                        close()
                        alert('Cập nhật thành công!')
                    })

                    return
                }
                const _data = { ...data, ...formData }
                db_Drivers.update(_data).then(() => {
                    close()
                    if(formData.vehicleId !== data.vehicleId){
                    db_Vehicles_New.update({ ...newVehicle, using: newVehicle.using + 1 })
                    db_Vehicles_Old.update({ ...oldVehicle, using: oldVehicle.using - 1 })
                }
                    alert('Cập nhật thành công!')
                })
                return
            }

            if (!name || !phone || !joinDate || !birthDay || !vehicleId || images.length === 0) {
                alert('Vui lòng nhập đầy đủ thông tin!')
                return
            }
            uploadPhoto(images[0].data_url).then((res) => {
                const driverId = uuidv4()
                const db_Drivers = app.database().ref().child(`/drivers/${driverId}`)
                const code = Math.floor(Math.random() * 899999 + 100000)
                const filterVehicle = vehicles.filter(
                    (vehicle) => vehicle.vehicleId === formData.vehicleId
                )[0]
                const _data = { ...formData, image: res.message, driverId, code,vehicleStatus:{
                    lat : lat,
                    long: long,
                    payload: filterVehicle.payload,
                    height: filterVehicle.height,
                    length: filterVehicle.length,
                    width: filterVehicle.width,
                }  }
                db_Drivers.set(_data).then(() => {
                    console.log(newVehicle)
                    db_Vehicles_New.update({ ...newVehicle, using: newVehicle.using + 1 })
                    close()
                    alert('Thêm thành công!')
                })
            })
        } catch (err) {
            alert('Có lỗi xảy ra vui lòng thử lại!')
        }
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
                        color: '#476282',
                        p: '10px',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                    }}
                >
                    {data ? 'Chỉnh sửa thông tin' : 'Thêm thành viên'}
                </Text>
                <Button
                    sx={{ backgroundColor: '#476282' }}
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
                            <Label htmlFor="name">Họ và tên</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.name}
                                name="name"
                                onChange={handleChange}
                                type="text"
                            />
                        </Box>
                        <Box mb={1}>
                            <Label htmlFor="name">Số điện thoại</Label>
                            <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.phone}
                                name="phone"
                                type="text"
                                onChange={handleChange}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box mb={1}>
                    <Box sx={{ display: 'flex' }}>
                        <Box mr={4}>
                            <Label mb={'3px'} sx={{ display: 'block' }} htmlFor="name">
                                Ngày sinh
                            </Label>
                            <input
                                style={{
                                    height: '40px',
                                    width: '180px',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                defaultValue={formData.birthDay}
                                type="date"
                                id="birthDay"
                                name="birthDay"
                                onChange={handleChange}
                            ></input>
                        </Box>
                        <Box>
                            <Label mb={'3px'} sx={{ display: 'block' }} htmlFor="name">
                                Ngày tham gia
                            </Label>
                            <input
                                defaultValue={formData.joinDate}
                                style={{
                                    height: '40px',
                                    width: '180px',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                }}
                                type="date"
                                id="birthday"
                                name="joinDate"
                                onChange={handleChange}
                            ></input>
                        </Box>
                    </Box>
                </Box>
                <Box py={2} mb={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Text sx={{ minWidth: '75px' }}>Giới tính:</Text>
                    <Label sx={{ width: 'fit-content', minWidth: '75px' }} p={2}>
                        <Checkbox
                            id="remember"
                            onChange={() => {
                                setFormData({ ...formData, sex: true })
                            }}
                            checked={formData.sex}
                            name="remember"
                        />
                        Nam
                    </Label>
                    <Label p={2}>
                        <Checkbox
                            id="remember"
                            onChange={() => {
                                setFormData({ ...formData, sex: false })
                            }}
                            checked={!formData.sex}
                            name="remember"
                        />
                        Nữ
                    </Label>
                </Box>

                <Box mb={1}>
                    <Label htmlFor="name">Loại phương tiện</Label>
                    <Select
                        sx={{ border: '1px solid #e3e3e3', background: '#cdcdcd14' }}
                        id="location"
                        name="vehicleId"
                        defaultValue={formData.vehicleId}
                        onChange={handleChange}
                    >
                        <option value="">Chọn xe</option>
                        {vehicles ? (
                            vehicles.map((vehicle, index) => (
                                <option
                                    disabled={vehicle.using === vehicle.totalCount}
                                    key={index}
                                    value={vehicle.vehicleId}
                                >
                                    {vehicle.name}
                                </option>
                            ))
                        ) : (
                            <option value="">Chưa có xe nào</option>
                        )}
                    </Select>
                </Box>
                {data && <Box mb={1}>
                    <Label htmlFor="name">Mã đăng nhập</Label>
                    <Input
                                sx={{
                                    outline: 'none',
                                    width: '100%',
                                    border: '1px solid #e3e3e3',
                                    background: '#cdcdcd14',
                                    color: '#476282',
                                    fontWeight: 600
                                }}
                                defaultValue={data?.code}
                                name="phone"
                                type="text"
                                onChange={handleChange}
                            />
                </Box>}

                <Box mt={4}>
                    <Button
                        sx={{
                            background: '#476282',
                            margin: ' 10px auto',
                            color: 'white',
                            padding: '10px 50px',
                            display: 'block',
                        }}
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        {data ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
