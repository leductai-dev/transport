import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { browserHistory } from "react-router";
import { v4 as uuidv4 } from 'uuid';
import {UserLogin} from '../Actions/Actions'
import {
    createBrowserHistory,
  } from 'history'
import {connect} from 'react-redux'
class LoginRegister extends Component {
  
    constructor(props) {
       super(props);
       this.state ={
            statusFormEdit:false,
            name:"",
            phone:"",
            address:"",
            email:"",
            type:""
        }
    }
    onChange = (event) => {
        var key = event.target.name;
        var value =event.target.value;
        this.setState({
            [key]: value
        })
    }
    signup =()=>{
        const center_email = this.state.center_email
        const pass = this.state.center_password
        const repass = this.state.confirm_password
        const center_name = this.state.center_name
        const center_phone = this.state.center_phone
        const center_type = this.state.center_type
        const center_city = this.state.center_city
        const generatorID = uuidv4()    
        const db_CenterTeam = app.database().ref().child(`CenterTeam/${generatorID}/`)
        const db_InfomationTeam = app.database().ref().child(`InfomationCenter/${generatorID}/`)
        const db_SupportTeam = app.database().ref().child(`SupportCenter/${center_type}/${center_city}/${generatorID}/`)
        const db_Request = app.database().ref().child(`Requests/${generatorID}/`)


        app.auth().createUserWithEmailAndPassword(center_email, pass)
         .then((user) => {

        alert("Đăng kí tài khoản thành công")
        console.log(user)
        console.log(app.auth().currentUser.l)
        var user = app.auth().currentUser;
        if (user != null) {
            user.providerData.forEach(function (profile) {
              console.log(profile)
            });
          }
        db_CenterTeam.set({
            InforTeam:"",
            Transactions:""
        })
     db_InfomationTeam.set({
            center_email,
            center_name,
            center_phone,
            center_type,
            center_city,
            center_address:"　",
            center_latitude:"",
            center_longitude:"",
            center_status:true,
            center_id:generatorID,
            history:""
              
        })
         db_SupportTeam.set({
            center_name,
            center_latitude:"",
            center_longitude:"",
            center_status:"true",
            center_id:generatorID
        }) 
         db_Request.set({
          tran_status: true,
          message_toUser:"null"
         })
        app.auth().signInWithEmailAndPassword(center_email, pass)
        .then((user) => {
          console.log("login`")
          console.log(user)
        
            var user = app.auth().currentUser;
                user.updateProfile({
                    displayName:generatorID,
                  }).then(function() {
                    const database_getUserInfo = app.database().ref().child(`InfomationCenter/${generatorID}/`)
                    database_getUserInfo.once('value',function(dataSnapshot){
                        console.log(dataSnapshot.val())
                        localStorage.setItem('centerID' ,dataSnapshot.val().center_id)
                        localStorage.setItem( 'centerPhone' ,dataSnapshot.val().center_phone)
                        localStorage.setItem( 'centerName' ,dataSnapshot.val().center_name)
                        localStorage.setItem( 'centerStatus' ,dataSnapshot.val().center_status)
                        localStorage.setItem( 'centerCity' ,dataSnapshot.val().center_city)
                        localStorage.setItem( 'centerEmail' ,dataSnapshot.val().center_email)
                        localStorage.setItem( 'centerType' ,dataSnapshot.val().center_type)
                    })
                     /*  app.auth().signOut().then(function() {
                        console.log("logout thành công")
                        if (user != null) {
                            user.providerData.forEach(function (profile) {
                              console.log("  Name: " + profile.displayName);
                            });
                          }
                      }).catch(function(error) {
                        console.log("logout thất bại")
                      }); */
                  }).catch(function(error) {
                    console.log("update profile thất bại")
                    
                  });
              }
             )
        .catch((error) => {
            alert("Đang nhâp không thành công từ đăng kí")
           
        });
      

    })
  .catch((error) => {
      alert("Đăng kí thất bại")
    var errorCode = error.code;
   var  Message = error.message;
  });
    }


    login= () =>{
        const self = this
        const history = createBrowserHistory();
        const name = this.state.email
        const {password}= this.state
         app.auth().signInWithEmailAndPassword(name, password)
        .then((user) => {
        var user = app.auth().currentUser; // cần có 
        var userid = null;
        if (user != null) {
            user.providerData.forEach(function (profile) {
              console.log("  User ID 1: " + profile.displayName);
              userid = profile.displayName
              const database_getUserInfo = app.database().ref().child(`InfomationCenter/${userid}/`)
              database_getUserInfo.once('value', function(dataSnapshot){
              localStorage.setItem( 'latitude' ,dataSnapshot.val().center_latitude)
              localStorage.setItem( 'longitude' ,dataSnapshot.val().center_longitude)
              localStorage.setItem('centerID' ,dataSnapshot.val().center_id)
              localStorage.setItem( 'centerPhone' ,dataSnapshot.val().center_phone)
              localStorage.setItem( 'centerName' ,dataSnapshot.val().center_name)
              localStorage.setItem( 'centerStatus' ,dataSnapshot.val().center_status)
              localStorage.setItem( 'centerCity' ,dataSnapshot.val().center_city)
              localStorage.setItem( 'centerEmail' ,dataSnapshot.val().center_email)
              localStorage.setItem( 'centerType' ,dataSnapshot.val().center_type)
              self.props.setUserLogin(dataSnapshot.val())

             
          })
            });
          }
          console.log("user id 2 là :"+userid)
       
  })
        .catch((error) => {
            alert("Đang nhâp không thành công")
        });
    }




    isChange=(e)=>{
        var key = e.target.name
        var value = e.target.value
        this.setState({
            [key]:value
        })
        console.log(e.target.value)
        
    }

  componentDidMount(){
 
  }
  

    render() {
      
        return (
                    <div className="container register">
                      <div className="row rowcs1">
                        <div className="col-md-3 register-left">
                          <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />
                          <h3>Welcome</h3>
                          <p>You are 30 seconds away from earning your own money!</p>
                          <input type="submit" name defaultValue="Login" /><br />
                        </div>

                        <div className="col-md-9 register-right">
                          <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
                            <li className="nav-item nav-item1">
                              <a className="nav-link active cl_h33 " id="home-tab" data-toggle="tab" href="#login" role="tab" aria-controls="home" aria-selected="true">Login</a>
                            </li>
                            <li className="nav-item nav-item1">
                              <a className="nav-link cl_h33" id="profile-tab" data-toggle="tab" href="#register" role="tab" aria-controls="profile" aria-selected="false">Register</a>
                            </li>
                          </ul>


                          <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="login" role="tabpanel" aria-labelledby="home-tab">
                              <h3 className="register-heading">Login</h3>
                              <div className="row register-form">
                                <div className="col-md-10">
                                  <form action="/login" method="POST" className="form" id="form-1">
                                    <div className="form-group">
                                      <label htmlFor="email" className="form-label">Email</label>
                                      <input onChange={(e)=>{this.isChange(e)}}  id="email" name="email" type="text" placeholder="Email Address *" className="form-control" />
                                      <span className="form-message" />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="password" className="form-label">Password</label>
                                      <input onChange={(e)=>{this.isChange(e)}}  id="password" name="password" type="text" placeholder="Password *" className="form-control" />
                                      <span className="form-message" />
                                    </div>
                                    <button type="button" onClick={()=>{this.login()}} className="btnRegister2">Login</button>
                                    <div className="err-message" style={{marginTop: '15px'}}>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>



                            <div className="tab-pane fade show" id="register" role="tabpanel" aria-labelledby="profile-tab">
                              <h3 className="register-heading">Register</h3>
                              <form action="/register" method="POST" className="form" id="form-1">
                                <div className="row register-form">
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label htmlFor="fullname" className="form-label">Center Name</label>
                                      <input onChange={(e)=>{this.isChange(e)}} id="fullname" name="center_name" type="text" placeholder="Center Name *" className="form-control" />
                                      <span className="form-message" />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="phone" className="form-label">Phone Number</label>
                                      <input onChange={(e)=>{this.isChange(e)}}  id="phone" name="center_phone" type="text" placeholder="Phone Number *" className="form-control" />
                                      <span className="form-message" />
                                    </div>
                                   
                                    <div className="form-group div_cus">
                                        <div className="type_center">
                                        <label htmlFor="type" className="form-label">Type</label>
                                      <select onChange={(e)=>{this.isChange(e)}}  id="type" name="center_type" className="form-control">
                                        <option className="hidden" selected disabled>Choose one</option>
                                        <option value="Police">Police</option>
                                        <option value="Hospital">Hospital</option>
                                        <option value="Fire Fight">Fire Fight</option>
                                      </select>
                                        </div>
                                        <div className="city_center">
                                        <label htmlFor="type" className="form-label">City</label>
                                      <select onChange={(e)=>{this.isChange(e)}}  id="type" name="center_city" className="form-control">
                                        <option className="hidden" selected disabled>Choose one</option>
                                        <option value="Đà Nẵng">Đà Nẵng</option>
                                        <option value="Hồ Chí Mình">Hồ Chí Minh</option>
                                        <option value="Hà Nội">Hà Nội</option>
                                      </select>

                                        </div>

                                    </div>
                                    
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label htmlFor="email" className="form-label">Email</label>
                                      <input onChange={(e)=>{this.isChange(e)}}  id="email" name="center_email" type="text" placeholder="Your email *" className="form-control" />
                                      <span className="form-message" />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="password_register" className="form-label">Password</label>
                                      <input onChange={(e)=>{this.isChange(e)}}  id="password" name="center_password" type="password" placeholder="Password *" className="form-control" />
                                      <span className="form-message" />
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="re-password_register" className="form-label">Confirm Password</label>
                                      <input  onChange={(e)=>{this.isChange(e)}} id="password" name="confirm_password" type="password" placeholder="Confirm Password *" className="form-control" />
                                      <span className="form-message" />
                                    </div>
                                  </div>
                                
                                  <button type="button" onClick={()=>{this.signup()}} className="btnRegister">Continue</button>
                                </div></form>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  );
                }
            }


const mapStateToProps = (state) => {
  return {
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    
    setUserLogin: (user) => {
      dispatch(UserLogin(user));
  },
  setUserLogout: (user) => {
    dispatch(UserLogin(user));
},
    
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(LoginRegister)