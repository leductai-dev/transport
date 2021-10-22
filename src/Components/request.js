import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'
import {Set_Data} from '../Actions/Action_transactions'
import {SetUserLocation} from '../Actions/Actions'

import {generatorTime} from '../Utils/Time_generator'
import { v4 as uuidv4 } from 'uuid';
import Authority from './authority';
class request extends Component {
    constructor(props) {
       super(props);
       this.user_latitude =null
       this.user_longitude=null
       this.centerID = localStorage.getItem('centerID')
       this.database_GetUserID = app.database().ref().child(`Requests/${this.centerID}/`)
       this.database_UpdateValue =  app.database().ref().child(`Requests/${this.centerID}/`)
       this.state ={
           show : false ,
           userInfo:{},
           request_Information:{}
       }
    }
    componentDidMount(){
      if(this.centerID){
        this.database_GetUserID.on('value', (dataSnapshot)=> {  //Lắng nghe request từ user, nếu có id user
          if(dataSnapshot.val().user_id)  
          {
            var a = localStorage.getItem('userLatitude')
            var b = localStorage.getItem('userLongitude')
            console.log(typeof a);
            if(typeof a =="string"){
              localStorage.setItem('userLatitude',dataSnapshot.val().latitude_user)
            }
            if(b==null || b=='undefined'){
              localStorage.setItem('userLongitude',dataSnapshot.val().longitude_user)
            }
               
                this.user_latitude =dataSnapshot.val().latitude_user
                this.user_longitude=dataSnapshot.val().longitude_user
             
           
            this.setState({  
              show : true,  
              request_Information: dataSnapshot.val() //Lưu thông tin request vào state để khi accept thì gửi thông tin tracsaction lên db

          },this.getUserInfo(dataSnapshot.val()))  //Có được id rồi thì get thông tin user rồi lưu vào state
          }
          else{
              this.setState({
                  show : false
              })
          }
      })
      }
    }



    reject_Request= ()=>{       
    var date = generatorTime();      //Tao ra time để lưu thời gian request
    this.setState({
      show: false        //Ẩn form form request
    })
    const database_HistoryCenter = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/history/`) 
    database_HistoryCenter.push(  //Đẩy dữ liệu request lên db lưu vào history
        { "userName": this.state.userInfo.name,
        "userPhone": this.state.userInfo.phone,
        "userEmail": this.state.userInfo.email,
        "userAddress": this.state.userInfo.address,
          "status":"false",       //Status đại diện cho việc center từ chối request
          "date":date,
          "team_id":"" ,
        }
        )
      this.database_UpdateValue.update({    //Trả thông tin transaction về null
              message_toUser:"false"   
          }) 
      }
      
    accept_Request= ()=>{    
      this.setState({
        show: false        //Ẩn form form request
      })
      const generatorID = uuidv4()    //Tự tạo id transaction để lúc update team đã help thì biết được transaction nào
      var data = {
        ...this.state.request_Information,
        request_id:generatorID,
        userName:this.state.userInfo.name,
        userPhone: this.state.userInfo.phone
      }
      this.props.setLocation(data)
      this.props.setData(data)     //Lưu vào state để cpn update team helped nhận được
      const database_HistoryCenter = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/history/${generatorID}`) 
      var date = generatorTime();     //Đẩy dữ liệu lên database lưu vào history
      database_HistoryCenter.set(
        {
          "userName": this.state.userInfo.name,
          "userPhone": this.state.userInfo.phone,
          "userEmail": this.state.userInfo.email,
          "userAddress": this.state.userInfo.address,
          "status":"true",  //Status đại diện cho việc center có accept request không
          "date":date,
          "team_id":"" ,
        }
        )
      this.database_UpdateValue.update({    //Update lại transaction và trả lời user
              message_toUser:"true"  
          }) 
      }   
   
   
      showRequest =()=>{    
        if(this.state.show){
        return (
        <div className="user-request" id="modal">   <i className="fa fa-user-o" aria-hidden="true" />
            <div className="request-modal">
              <div className="modal-top">
                <div className="request-img">
                  <span className=" avar-cs">  <i className="fa fa-user-o avar-cs" aria-hidden="true" /></span>
                </div>
              </div>
              <div className="modal-contain">
                <p className="location">
                  <span className=" d-flex align-items-center ml-4"><img style={{width: '32px'}} src="./png/user_request.png" alt="" /> Name:</span>
                  <span className="m_left1 
                    ">{this.state.userInfo.name}</span>
                </p>
                <p className="location">
                  <span className="float-left ml-4"><img style={{width: '25px'}} src="./png/phone_request.png" alt="" /> Phone:</span>
                  <span className="m_left2">{this.state.userInfo.phone}</span>
                </p>
                <p className="location">
                  <span className=" d-flex align-items-center ml-4"><img style={{width: '32px'}} src="./png/placeholder.png" alt="" /> Location:</span>
                  <span className="m_left3 
                    ">{this.state.userInfo.address}</span>
                </p>
              </div>
              <div className="request-button">
                <button type="button" onClick={()=>{this.reject_Request()}} className="btn btn-danger btn-request btn-denied"><img  src="./png/no-entry.png" alt="" /><span className="vertical-text ml-2">REJECT</span></button>
                <button type="button"onClick={()=>{this.accept_Request()}} className="btn btn-success btn-request btn-accept"><img src="./png/yes.png" alt="" /><span className="vertical-text ml-2">ACCEPT</span></button>
              </div>
            </div>
          </div>
          )
    }}
    getUserInfo =(value)=>{
      const database_GetUserInfo = app.database().ref().child(`InfoUser/${value.user_id}/Information/`)
      database_GetUserInfo.once('value',(dataSnapshot)=>{
            this.setState({
              userInfo: dataSnapshot.val()
            })
      })
  } 
  Authority =()=>{    //Function hiển thị mini form authority cho team
    if(this.props.transaction.status){
      const user_latitude =  this.user_latitude 
      const user_longitude = this.user_longitude

      return(
        <Authority user_latitude={user_latitude} user_longitude={user_longitude}>
        </Authority>
      )
    }
  }

      render() {
                return(
                    <>
                    {this.showRequest()}
                    {this.Authority()}
                 </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      transaction: state.transaction2      //State để show miniform hay không?
    }
  }
  
  
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      setData: (data) => {
        dispatch(Set_Data(data));   //Action lưu id transaction vào reducer
    },
    setLocation:(location)=>{
      dispatch(SetUserLocation(location)); 
      
    }
    }
  } 
export default connect(mapStateToProps,mapDispatchToProps)(request)