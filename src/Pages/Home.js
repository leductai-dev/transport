import React, {
    useEffect,
    useMemo,
    useCallback,
    useState,
    useRef,
} from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import {setDataTransaction} from '../Actions/Action_transactions'
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import { app } from "../firebaseConfig";
import { Button, Text, Box, Image } from "rebass";
import { MenuOption } from "../Components/MenuOptions";
import ModalTransaction from "../Components/ModalTransactionInfo";

const DestinationIcon = new L.Icon({
    iconUrl: "./png/destination.png",
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});
const DriverIcon = new L.Icon({
    iconUrl: "./png/teamLocation.png",
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});
const InitialIcon = new L.Icon({
    iconUrl: "./png/userLocation.png",
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});

export const Component = (props) => {
    const transactions_props = useSelector((state) => state.transactions);
    const [center, setCenter] = useState([16.060392, 108.211847]);

    const [showTransactionInfo, setShowTransactionInfo] = useState(false);
    const [transactions, setTransactions] = useState(null);
    const dispatch = useDispatch();
    const user_location = useSelector((state) => state.userlocation);
    const db_Main = app.database().ref().child('/')
    
    useEffect(() => {
        // db_Main.set()
        const db_Transactions = app.database().ref().child('/system/transactions/inProgress')
        db_Transactions.on("value", (snap) => {
            if(snap.val()){
                dispatch(setDataTransaction(Object.values(snap.val())))
                setTransactions(snap.val());
            }
        });
        
    }, []);

    // const DraggableMarker = () => {
    //     const markerRef = useRef(null);
    //     const eventHandlers = useMemo(
    //         () => ({
    //             dragend() {
    //                 const marker = markerRef.current;
    //                 if (marker != null) {
    //                     setCenterLocation(marker.getLatLng());
    //                     database_getCenterLocation.update({
    //                         center_latitude: `${marker.getLatLng().lat}`,
    //                         center_longitude: `${marker.getLatLng().lng}`,
    //                     });

    //                 }
    //             },
    //         }),
    //         []
    //     );

    //     const map = useMapEvents({
    //         click() {
    //             map.locate();
    //         },
    //         locationfound(e) {
    //             map.flyTo(CenterLocation, 13);
    //         },
    //     });

    //     const toggleDraggable = useCallback(() => {
    //         setDraggable((d) => !d);
    //     }, []);

    //     return (
    //         <Marker
    //             icon={CenterIcon}
    //             draggable={draggable}
    //             eventHandlers={eventHandlers}
    //             position={CenterLocation}
    //             ref={markerRef}
    //         >
    //             <Tooltip direction="top" permanent offset={[0, -50]}>
    //                 Your Center
    //             </Tooltip>
    //             <Popup maxWidth={200}>
    //                 <span onClick={toggleDraggable}>
    //                     {draggable
    //                         ? "Is this your position? If not, drag and drop at the position you want!"
    //                         : "Click here to make marker draggable"}
    //                 </span>
    //             </Popup>
    //         </Marker>
    //     );
    // };

    // const FirstCenterLocation = () => {
    //     const [position, setPosition] = useState(null);
    //     const markerRef = useRef(null);
    //     const eventHandlers = useMemo(
    //         () => ({
    //             dragend() {
    //                 const marker = markerRef.current;
    //                 if (marker != null) {
    //                     setCenterLocation(marker.getLatLng());
    //                     database_getCenterLocation.update({
    //                         center_latitude: `${marker.getLatLng().lat}`,
    //                         center_longitude: `${marker.getLatLng().lng}`,
    //                     });
    //                     /*   localStorage.setItem('latitude',marker.getLatLng().lat)
    //       localStorage.setItem('longitude',marker.getLatLng().lat) */
    //                 }
    //             },
    //         }),
    //         []
    //     );
    //     const map = useMapEvents({
    //         click() {
    //             map.locate();
    //         },
    //         locationfound(e) {
    //             setPosition(e.latlng);
    //             map.flyTo(e.latlng, 13);
    //             database_getCenterLocation.update({
    //                 center_latitude: `${e.latlng.lat}`,
    //                 center_longitude: `${e.latlng.lng}`,
    //             });

    //         },
    //     });

    //     const toggleDraggable = useCallback(() => {
    //         setDraggable((d) => !d);
    //     }, []);

    //     return position === null ? null : (
    //         <Marker
    //             position={position}
    //             icon={CenterIcon}
    //             draggable={draggable}
    //             eventHandlers={eventHandlers}
    //             ref={markerRef}
    //         >
    //             <Tooltip
    //                 direction="top"
    //                 offset={[0, -50]}
    //                 opacity={1}
    //                 permanent
    //             >
    //                 Is this your position? If not, drag and drop at the position
    //                 you want!
    //             </Tooltip>
    //         </Marker>
    //     );
    // };

    // const ShowUserLocation = () => {
    //     const view = Object.values(Transaction).map((value, index) => {
    //         if (value.user_latitude && value.user_longitude) {
    //             const lat = value.user_latitude;
    //             const lng = value.user_longitude;
    //             const name = value.name;
    //             const phone = value.phone;
    //             return (
    //                 <Marker key={index} icon={InitialIcon} position={[lat, lng]}>
    //                     <Tooltip
    //                         permanent
    //                         direction="top"
    //                         offset={[0, -45]}
    //                         opacity={1}
    //                         sticky
    //                     >
    //                         {name}
    //                     </Tooltip>
    //                 </Marker>
    //             );
    //         }
    //     });
    //     return view;
    // };
    const ShowTransaction = () => {
        if(transactions_props){
            console.log('d')
        const view = transactions_props.map((transaction, index) => {
                const fromAdress =[transaction.shippingInfo.sender.lat, transaction.shippingInfo.sender.long]
                const toAddress =[transaction.shippingInfo.receiver.lat, transaction.shippingInfo.receiver.long]
                const currentLocation =[transaction.shippingInfo.driver.lat, transaction.shippingInfo.driver.long]
                console.log(fromAdress)
                return (
                   <>
                    <Marker eventHandlers={{ click: ()=>{setShowTransactionInfo(true)}}} key={index} icon={InitialIcon} position={fromAdress}>
                        <Tooltip
                            direction="top"
                            maxWidth={10}
                            offset={[0, -45]}
                            opacity={1}
                        >
                            "Tooltip"
                        </Tooltip>
                    </Marker>
                    <Marker onClick={()=>{setShowTransactionInfo(true)}} key={index} icon={DestinationIcon} position={toAddress}>
                        <Tooltip
                            direction="top"
                            maxWidth={10}
                            offset={[0, -45]}
                            opacity={1}
                        >
                            "Tooltip"
                        </Tooltip>
                    </Marker>
                    <Marker onClick={()=>{setShowTransactionInfo(true)}} key={index} icon={DriverIcon} position={currentLocation}>
                        <Tooltip
                            direction="top"
                            maxWidth={10}
                            offset={[0, -45]}
                            opacity={1}
                            // permanent
                        >
                            "Tooltip"
                        </Tooltip>
                    </Marker>
                    </>
                );
        });
        return view;
    }
    };

    return (
        <div classname="flex-grow-1 position-relative map">
          
                <MenuOption transactions={transactions}/>
            {showTransactionInfo && (
                <ModalTransaction setShowTransactionInfo={setShowTransactionInfo}/>
            )}
           
            <MapContainer
                style={{
                    width: "100%",
                    minHeight: "100vh",
                    position: "relative",
                    zIndex: "0",
                }}
                /*  center={location?location:center} */
                center={center}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* { {Transaction ? (
                    <ShowUserLocation />
                ) : (
                    console.log("Chưa nhận request nào từ user")
                )} */}
                   {transactions_props && <ShowTransaction/>} 
            </MapContainer>
        </div>
    );
};

/* export default Component */

export default Component;
