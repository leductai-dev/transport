import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'
import {Set_Data} from '../Actions/Action_transactions'
import {generatorTime} from '../Utils/Time_generator'
import { v4 as uuidv4 } from 'uuid';
import Authority from './authority';
class request extends Component {
    constructor(props) {
       super(props);
       this.database_GetUserID = app.database().ref().child('Transaction/d3lnDLK3ApV7UJuUZUjXjWy5W742/')
       this.database_UpdateValue = app.database().ref().child('Transaction/d3lnDLK3ApV7UJuUZUjXjWy5W742/')
       this.state ={
           show : false ,
           userInfo:{},
           transactionInfo:{}
       }
    }
/*     componentDidMount(){
        this.database_GetUserID.on('value', (dataSnapshot)=> {  //Lắng nghe request từ user, nếu có id user
            if(dataSnapshot.val().user_id)  
            {
              this.setState({  
                show : true,   //show form request
                transactionInfo: dataSnapshot.val() //Lưu thông tin request vào state để khi accept thì gửi thông tin tracsaction lên db

            },this.getUserInfo(dataSnapshot.val()))  //Có được id rồi thì get thông tin user rồi lưu vào state
            }
            else{
                this.setState({
                    show : false
                })
            }
        })
    }
 */
    reject_Request= ()=>{        //Button từ chối request
    var date = generatorTime();      //Tao ra time để lưu thời gian request
    this.setState({
      show: false        //Ẩn form form request
    })
    const database_PushValue = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/History/`) 
      database_PushValue.push(  //Đẩy dữ liệu request lên db lưu vào history
        {...this.state.requestInfo,
          "status":"false",       //Status đại diện cho việc center từ chối request
          "date":date
        }
        )
      this.database_UpdateValue.update({    //Trả thông tin transaction về null
              latitude_user:"",
              longitude_user:"",
              tran_status: true,
              user_id:""
          }) 
      }

      
    accept_Request= ()=>{     //Button accept request
      const generatorID = uuidv4()    //Tự tạo id transaction để lúc update team đã help thì biết được transaction nào
      this.props.setData(generatorID)     //Lưu vào state để cpn update team helped nhận được
      const database_PushValue = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/History/${generatorID}`) 
      var date = generatorTime();     //Đẩy dữ liệu lên database lưu vào history
      database_PushValue.set(
        {...this.state.transactionInfo,
          "status":"true",  //Status đại diện cho việc center có accept request không
          "date":date,
          "team_id":""    
        }
        )
      this.database_UpdateValue.update({    //Update lại transaction
              latitude_user:"",
              longitude_user:"",
              tran_status: true,
              user_id:""
          }) 
      }   

    showRequest =()=>{    //Interface request từ user 
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
                <p className="location d-flex flex-row justify-content-around">
                  <span className=" d-flex align-items-center ml-4"><img style={{width: '32px'}} src="./png/placeholder.png" alt="" /> Name:</span>
                  <span className="ml-5 mt-3
                    ">{this.state.userInfo.name}</span>
                </p>
                <p className="mt-2 phone">
                  <span className="float-left ml-4"><img style={{width: '25px'}} src="./png/phone-call.png" alt="" /> Phone number:</span>
                  <span className="ml-2">{this.state.userInfo.phone}</span>
                </p>
                <p className="mt-2 d-flex flex-row justify-content-around">
                  <span className=" d-flex align-items-center ml-4"><img style={{width: '32px'}} src="./png/placeholder.png" alt="" /> Location:</span>
                  <span className="ml-5 mt-3
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
      console.log("Help me");
      return(
        <Authority></Authority>
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
    }
  } 
export default connect(mapStateToProps,mapDispatchToProps)(request)