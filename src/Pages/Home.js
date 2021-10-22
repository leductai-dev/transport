import React, {
    useFetching,
    useEffect,
    useMemo,
    useCallback,
    useState,
    useRef,
} from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip,  } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import { Set_Page } from "./../Actions/Actions";
import { app } from "../firebaseConfig";
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";
const CenterIcon = new L.Icon({
    iconUrl: "./png/myCenter.png",
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});
const TeamIcon = new L.Icon({
    iconUrl: "./png/teamLocation.png",
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});
const UserIcon = new L.Icon({
    iconUrl: "./png/userLocation.png",
    iconSize: [32, 32],
    iconAnchor: [17, 46],
    popupAnchor: [0, -46],
});

export const Component = (props) => {
    const useLogin = useSelector((state) => state.userLogin);
    const [center, setCenter] = useState([16.060392, 108.211847]);

    const [draggable, setDraggable] = useState(true);
    const [Transaction, setTransaction] = useState(null);
    const [CenterLocation, setCenterLocation] = useState(null);
    const [tmpLocation, setTmpLocation] = useState(null);

    const [TeamLocation, setTeamLocation] = useState(null);
    const [UserLocation, setUserLocation] = useState(null);
    const localStorageID = localStorage.getItem("centerID");
    const stateID = useLogin.center_id;
    const centerID = localStorageID ? localStorageID : stateID;

    const id = localStorage.getItem("centerID");
    const city = localStorage.getItem("centerCity");
    const type = localStorage.getItem("centerType");

    var database_getCenterLocation = app
        .database()
        .ref()
        .child(`InfomationCenter/${centerID}`);
    const database_Transactions = app
        .database()
        .ref()
        .child(`CenterTeam/${centerID}/Transactions/`);
    var database_UpdateLocationSupport = app
        .database()
        .ref()
        .child(`SupportCenter/${type}/${city}/${id}/`);
    /* var database_UpdateLocationSupport = "" */
    const dispatch = useDispatch();
    const user_location = useSelector((state) => state.userlocation);

    useEffect(() => {
        
        dispatch(Set_Page(1));
        var a = setInterval(() => {
            const id = localStorage.getItem("centerID");
            const city = localStorage.getItem("centerCity");
            const type = localStorage.getItem("centerType");
            if (id) {
                clearInterval(a);
                database_getCenterLocation = app
                    .database()
                    .ref()
                    .child(`InfomationCenter/${id}/`);
                database_UpdateLocationSupport = app
                    .database()
                    .ref()
                    .child(`SupportCenter/${type}/${city}/${id}/`);

                database_getCenterLocation.once("value", (snap) => {
                    if (snap.val()) {
                        const lat = snap.val().center_latitude;
                        const lng = snap.val().center_longitude;
                        if (lng) {
                            setCenterLocation([lat, lng]);
                            setCenter([lat, lng]);
                        }
                    }
                    if (user_location.latitude_user) {
                        console.log(JSON.stringify(user_location));
                        setTmpLocation([
                            user_location.latitude_user,
                            user_location.longitude_user,
                        ]);
                    }
                });
            }
        }, 100);

        database_Transactions.on("value", (snap) => {
            setTransaction(snap.val());
        });
    }, []);

    const DraggableMarker = () => {
        const markerRef = useRef(null);
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        setCenterLocation(marker.getLatLng());
                        database_getCenterLocation.update({
                            center_latitude: `${marker.getLatLng().lat}`,
                            center_longitude: `${marker.getLatLng().lng}`,
                        });
                        database_UpdateLocationSupport.update({
                            center_latitude: `${marker.getLatLng().lat}`,
                            center_longitude: `${marker.getLatLng().lng}`,
                        });
                        localStorage.setItem(
                            "latitude",
                            marker.getLatLng().lat
                        );
                        localStorage.setItem(
                            "longitude",
                            marker.getLatLng().lng
                        );
                    }
                },
            }),
            []
        );

        const map = useMapEvents({
            click() {
                map.locate();
            },
            locationfound(e) {
                map.flyTo(CenterLocation, 13);
            },
        });

        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d);
        }, []);

        return (
            <Marker
                icon={CenterIcon}
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={CenterLocation}
                ref={markerRef}
            >
                <Tooltip direction="top" permanent offset={[0, -50]}>
                    Your Center
                </Tooltip>
                <Popup maxWidth={200}>
                    <span onClick={toggleDraggable}>
                        {draggable
                            ? "Is this your position? If not, drag and drop at the position you want!"
                            : "Click here to make marker draggable"}
                    </span>
                </Popup>
            </Marker>
        );
    };

    const FirstCenterLocation = () => {
        const [position, setPosition] = useState(null);
        const markerRef = useRef(null);
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current;
                    if (marker != null) {
                        setCenterLocation(marker.getLatLng());
                        database_getCenterLocation.update({
                            center_latitude: `${marker.getLatLng().lat}`,
                            center_longitude: `${marker.getLatLng().lng}`,
                        });
                        /*   localStorage.setItem('latitude',marker.getLatLng().lat)
          localStorage.setItem('longitude',marker.getLatLng().lat) */
                    }
                },
            }),
            []
        );
        const map = useMapEvents({
            click() {
                map.locate();
            },
            locationfound(e) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, 13);
                database_getCenterLocation.update({
                    center_latitude: `${e.latlng.lat}`,
                    center_longitude: `${e.latlng.lng}`,
                });

                database_UpdateLocationSupport.update({
                    center_latitude: `${e.latlng.lat}`,
                    center_longitude: `${e.latlng.lng}`,
                });
                localStorage.setItem("latitude", e.latlng.lat);
                localStorage.setItem("longitude", e.latlng.lng);
            },
        });

        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d);
        }, []);

        return position === null ? null : (
            <Marker
                position={position}
                icon={CenterIcon}
                draggable={draggable}
                eventHandlers={eventHandlers}
                ref={markerRef}
            >
                <Tooltip
                    direction="top"
                    offset={[0, -50]}
                    opacity={1}
                    permanent
                >
                    Is this your position? If not, drag and drop at the position
                    you want!
                </Tooltip>
            </Marker>
        );
    };

    const ShowUserLocation = () => {
        const view = Object.values(Transaction).map((value, index) => {
            if (value.user_latitude && value.user_longitude) {
                const lat = value.user_latitude;
                const lng = value.user_longitude;
                const name = value.name;
                const phone = value.phone;
                return (
                    <Marker key={index} icon={UserIcon} position={[lat, lng]}>
                        <Tooltip
                            permanent
                            direction="top"
                            offset={[0, -45]}
                            opacity={1}
                            sticky
                        >
                            {name}
                        </Tooltip>
                    </Marker>
                );
            }
        });
        return view;
    };

    const ShowTeamLocation = () => {
        const view = Object.values(Transaction).map((value, index) => {
            if (value.team_latitude && value.team_longitude) {
                const lat = value.team_latitude;
                const lng = value.team_longitude;
                var teamName = null;
                if (value.team_name) {
                    teamName = value.team_name;
                }
                const Message = value.user_id ? `On duty...` : `Ready...`;
                return (
                    <Marker key={index} icon={TeamIcon} position={[lat, lng]}>
                        <Tooltip
                            direction="top"
                            maxWidth={10}
                            offset={[0, -45]}
                            opacity={1}
                            permanent
                        >
                            {teamName ? teamName : "Team"}
                            {/* {Message} */}
                        </Tooltip>
                    </Marker>
                );
            }
        });
        return view;
    };
    const ShowUserRequest = () => {
        if (localStorage.getItem("userLongitude")) {
            const name = user_location.userName;
            const latitude = user_location.latitude_user;
            const longitude = user_location.longitude_user;
            return (
                <Marker
                    icon={UserIcon}
                    /*  position={[localStorage.getItem('userLatitude'),localStorage.getItem('userLongitude')]} */
                    position={[16.155, 108.1455]}
                >
                    <Tooltip
                        direction="top"
                        maxWidth={10}
                        offset={[0, -45]}
                        opacity={1}
                        permanent
                    >
                        {name ? name : "Ko Tên"}
                    </Tooltip>
                </Marker>
            );
        } else return false;
    };
    /* var location = []
if(localStorage.getItem('latitude')){
const lat = localStorage.getItem('latitude')
const lng = localStorage.getItem('longitude')
 location = [lat,lng]
} */

    return (
        <div classname="flex-grow-1 map">
            {center ? console.log(center) : console.log("null")}
            <MapContainer
                style={{
                    width: "100%",
                    minHeight: "100vh",
                    position: "relative",
                    zIndex: "0",
                }}
                /*  center={location?location:center} */
                center={
                    localStorage.getItem("latitude")
                        ? [
                              localStorage.getItem("latitude"),
                              localStorage.getItem("longitude"),
                          ]
                        : center
                }
                zoom={localStorage.getItem("latitude") ? 13 : 2}
                /*   zoom={ 13} */

                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {CenterLocation ? (
                    <DraggableMarker />
                ) : (
                    console.log(" đang hiện lần đầu")
                )}

                {!CenterLocation ? (
                    <FirstCenterLocation />
                ) : (
                    console.log("đang hiện lần sau")
                )}
                {Transaction ? (
                    <ShowUserLocation />
                ) : (
                    console.log("Chưa nhận request nào từ user")
                )}
                {Transaction ? (
                    <ShowTeamLocation />
                ) : (
                    console.log("Chưa có team nào")
                )}

            </MapContainer>
            ,
        </div>
    );
};

/* export default Component */

export default Component;



// // Initialize the map and assign it to a variable for later use
// var map = L.map('map', {
//   // Set latitude and longitude of the map center (required)
//   center: [37.7833, -122.4167],
//   // Set the initial zoom level, values 0-18, where 0 is most zoomed-out (required)
//   zoom: 10
// });

// L.control.scale().addTo(map);

// // Create a Tile Layer and add it to the map
// //var tiles = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png').addTo(map);
// L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

// var searchControl = new L.esri.Controls.Geosearch().addTo(map);

// var results = new L.LayerGroup().addTo(map);
// console.log(results)
// searchControl.on('results', function(data){
//   results.clearLayers();
//   for (var i = data.results.length - 1; i >= 0; i--) {  console.log(data.latlng.lat) 
//  results.addLayer(L.marker(data.results[i].latlng));
//   }
// });

// setTimeout(function(){$('.pointer').fadeOut('slow');},3400);
// document.getElementById('btn').addEventListener('click', function(){
// console.log("hihi")
// console.log(document.getElementsByClassName('geocoder-control-input leaflet-bar')[0])
// document.getElementsByClassName('geocoder-control-input leaflet-bar')[0].click()
// document.getElementsByClassName('geocoder-control-input leaflet-bar')[0].value = 'Duong Ba Cung'
//  document.getElementsByClassName('geocoder-control-input leaflet-bar')[0].onchange();
//    var evt =   document.getElementsByClassName('geocoder-control-input leaflet-bar')[0]
//   evt.initEvent("change", false, true);
//   element.dispatchEvent(evt);

// })

// console.log(a)