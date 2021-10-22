import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'
import Team from './authoriryTeam'
import {Set_Status} from '../Actions/Action_transactions'
import {SetUserLocation} from '../Actions/Actions'

class authority extends Component {
    constructor(props) {
       super(props);
       this.Database_GetData_Team = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/`)
       this.state ={
            DataTeam :{}
       }
    }
    componentDidMount(){
        this.Database_GetData_Team.on('value',(datasnapshot)=>{
            this.setState({
                DataTeam: datasnapshot.val(),
                
        })

    } )}
    authorityTeam=(teamID)=>{
        const self = this
        if(teamID){
            const database_HistoryCenter = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/history/${this.props.transactionData.request_data.request_id}`) 
            const database_Mission = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${teamID}/Mission/`) 
            const database_Transactions = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/Transactions/${teamID}/`) 
            const database_GetUserInfo = app.database().ref().child(`InfoUser/${this.props.transactionData.request_data.user_id}/Information/`) 
            database_Transactions.update({
                name:this.props.transactionData.request_data.userName,
                phone:this.props.transactionData.request_data.userPhone, 
                user_id:this.props.transactionData.request_data.user_id,
                user_latitude:this.props.transactionData.request_data.latitude_user,
                user_longitude:this.props.transactionData.request_data.longitude_user,

            }).then(()=>{
                alert("Authorization Successfully")

            })
            
            database_Mission.update({
                status: "true"
            })
            database_HistoryCenter.update({
                "team_id":teamID
            })
            
        }
        this.props.hide();
        this.props.setLocation({});

    }
     toRad=(Value)=>
    {
        return Value * Math.PI / 180;
    }
    cacurlatorDistance=(lat1, lng1, lat2, lng2)=>{
        var R = 6371; // km
        var dLat = this.toRad(lat2-lat1);
        var dLon = this.toRad(lng2-lng1);
        var lat1 = this.toRad(lat1);
        var lat2 = this.toRad(lat2);
  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var distance = R * c;
        return distance;
    }
    showForm = ()=>{
            const team =this.state.DataTeam
            console.log(team)
            const user_latitude = localStorage.getItem('userLatitude')
            const user_longitude = localStorage.getItem('userLongitude')
            var result = Object.values(team).map((value,index)=>{
                var distance=null
                if(value.team_latitude){
                const team_latitude = value.team_latitude
                const team_longitude = value.team_longitude
                distance = this.cacurlatorDistance(user_latitude,user_longitude,team_latitude,team_longitude)
                }
                
                return(
                    <Team distance={distance} update={(teamID)=>{this.authorityTeam(teamID)}} teamID={value.code} key={index} nameTeam={value.team_name} status={value.status_active}  ></Team>
                )
             })
            return result 
        }

    hideAuthority=()=>{
        this.props.hide();
    }
    render() {
        return (
            <>
             <div className="authority_form">
                 <button onClick={()=>{this.hideAuthority()}} className="btn close_author btn-sm btn-danger rounded-circle">
                         <i class="fa author_ico fa-times" aria-hidden="true"></i>
                 </button>
                <h4 className="author_title">AUTHORITY</h4>
                <div className="team_container">
                {this.showForm()}
                </div>
            </div>

            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        transactionData: state.transaction2,
    }
  }
  
  
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    hide: () => {
        dispatch(Set_Status());
    },
    setLocation: (location) => {
        dispatch(SetUserLocation(location));
    },
    }
  } 
export default connect(mapStateToProps,mapDispatchToProps)(authority)