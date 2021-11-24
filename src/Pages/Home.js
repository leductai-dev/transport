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
        const db_Transactions = app.database().ref().child('/transactions').orderByChild('/status').equalTo('inProgress')
        db_Transactions.on("value", (snap) => {
            if(snap.val()){
                dispatch(setDataTransaction(Object.values(snap.val())))
                setTransactions(snap.val());
            }
        });
        
    }, []);

  
    const ShowTransaction = () => {
        if(transactions_props){
            console.log('d')
        const view = transactions_props.map((transaction, index) => {
                const fromAdress =[transaction.shippingInfo.sender.lat, transaction.shippingInfo.sender.long]
                const toAddress =[transaction.shippingInfo.receiver.lat, transaction.shippingInfo.receiver.long]
                const currentLocation =[transaction.shippingInfo.driver.lat, transaction.shippingInfo.driver.long]
                return (
                   <React.Fragment key={index}>
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
                    </React.Fragment>
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
