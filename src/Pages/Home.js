import React, { useFetching,useEffect,useMemo,useCallback,useState,useRef  } from 'react';
import { MapContainer, TileLayer, Marker, Popup,Tooltip } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet'
import { useDispatch } from 'react-redux';
import L from "leaflet";
import { connect } from 'react-redux'
import {Set_Page,} from './../Actions/Actions'

import {app} from '../firebaseConfig'


const CenterIcon = new L.Icon({
  iconUrl: ("./png/myCenter.png"),
  iconSize: [32, 32],
  iconAnchor: [17, 46], 
  popupAnchor: [0, -46],
});
const TeamIcon = new L.Icon({
  iconUrl: ("./png/teamLocation.png"),
  iconSize: [32, 32],
  iconAnchor: [17, 46], 
  popupAnchor: [0, -46],
});
const UserIcon = new L.Icon({
  iconUrl: ("./png/userLocation.png"),
  iconSize: [32, 32],
  iconAnchor: [17, 46], 
  popupAnchor: [0, -46],
});




export const Component = (props) => {
const[center,setCenter] = useState(
     [16.060392,108.211847]
)

const [draggable, setDraggable] = useState(true)
const [Transaction, setTransaction] = useState(null)
const [CenterLocation, setCenterLocation] = useState(null)
const [TeamLocation, setTeamLocation] = useState(null)
const [UserLocation, setUserLocation] = useState(null)


const database_getCenterLocation = app.database().ref().child('InfomationCenter/yym15naI10VGGoK94hR1Pa7eFX52')
const database_Transactions = app.database().ref().child('CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/Transactions/')

const dispatch = useDispatch()


useEffect(() => {
  dispatch(Set_Page(1));
  database_getCenterLocation.once("value",(snap)=>{
    const lat =snap.val().center_latitude
    const lng=snap.val().center_longitude
    if(lng){
      setCenterLocation([lat,lng])
      console.log("didmount"+ typeof CenterLocation)
    }
   
  })


     database_Transactions.on("value",(snap)=>{
    setTransaction(snap.val())
     
  })

  



}, [])
/* useFetching(props.setPage(1)) */


const DraggableMarker =()=> {
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setCenterLocation(marker.getLatLng())
          database_getCenterLocation.update({
            center_latitude: `${marker.getLatLng().lat}`,
            center_longitude:`${marker.getLatLng().lng}`,
          })
        }
      },
    }),
    [],
  )
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return (

    <Marker
      icon={CenterIcon}
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={CenterLocation}
      ref={markerRef}>
      <Tooltip direction="top" offset={[0, -50]}>Your Center</Tooltip>
      <Popup maxWidth={200} >
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Is this your position? If not, drag and drop at the position you want!'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  )
}


const FirstCenterLocation=()=> {
  const [position, setPosition] = useState(null)
  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setCenterLocation(marker.getLatLng())
          database_getCenterLocation.update({
            center_latitude: `${marker.getLatLng().lat}`,
            center_longitude:`${marker.getLatLng().lng}`,
          })
        }
      },
    }),
    [],
  )
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, 12)
      },
    })
  
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d)
  }, [])

  return position  === null ? null : (
    <Marker position={position}
     icon={CenterIcon}
    draggable={draggable}
    eventHandlers={eventHandlers}
    ref={markerRef}>
      <Tooltip direction="top" offset={[0, -50]} opacity={1} permanent>
        Is this your position? If not, drag and drop at the position you want!
      </Tooltip>
    </Marker>
  )
}



const ShowUserLocation=()=>{
  console.log(Transaction)
  const view = Object.values(Transaction).map((value,index)=>{
    const lat = value.user_latitude
    const lng = value.user_longitude
    return(
      <Marker
      key={index}
      icon={UserIcon}
      position={[lat,lng]}
   >
       <Tooltip direction="top" offset={[0, -25]} opacity={1} sticky>
          Ready...
      </Tooltip>
 </Marker>)
  })
  return view
}
const ShowTeamLocation=()=>{
  console.log(Transaction)
  const view = Object.values(Transaction).map((value,index)=>{
    const lat = value.team_latitude
    const lng = value.team_longitude
    const Message =  value.user_longitude?`On duty...`:`Ready...`
    return(
      <Marker
      key={index}
      icon={TeamIcon}
      position={[lat,lng]}
   >
     <Tooltip direction="top" offset={[0, -45]} opacity={1} permanent>
        {Message}
      </Tooltip>
 </Marker>)
  })
  return view
}



    return (
      
      <div classname="flex-grow-1 map" >
       
      <MapContainer  style={{width: '100%', height: '93.2vh'}}
            center={center}
            zoom={3}
            scrollWheelZoom={true}>
           
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
    
         {CenterLocation? <DraggableMarker/>:console.log(" đang hiện lần đầu")}
    
        {!CenterLocation?<FirstCenterLocation/>:console.log("đang hiện lần sau")}
      {Transaction? <ShowUserLocation/>:console.log("la")}
      {Transaction? <ShowTeamLocation/>:console.log("cc")}
      </MapContainer>,
 
      </div>
      )
    
    }

/* export default Component */


export default Component
