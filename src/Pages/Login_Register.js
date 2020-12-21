import React, { Component } from 'react'
import { connect } from 'react-redux'
import {UserLogin} from './../Actions/Actions'
import {app} from '../firebaseConfig'
import { browserHistory } from "react-router";
import { v4 as uuidv4 } from 'uuid';

import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import { Redirect } from "react-router-dom";
import {
    createBrowserHistory,
    createHashHistory,
    createMemoryHistory
  } from 'history'
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

        app.auth().createUserWithEmailAndPassword(center_email, pass)
         .then((user) => {
        alert("Đăng kí tài khoản thành công")
        db_CenterTeam.set({
            History:"",
            InforTeam:"",
            Transactions:""
        })
        db_InfomationTeam.set({
            center_email,
            center_name,
            center_phone,
            center_type,
            center_city,
            center_address:"",
            center_latitude:"",
            center_longitude:"",
            center_status:true
        })
        db_SupportTeam.set({
            center_email,
            center_name,
            center_phone,
            center_type,
            center_city,
            center_address:"",
            center_latitude:"",
            center_longitude:"",
            center_status:true
        })

    })
  .catch((error) => {
      console.log("có lỗi")
      alert("Đăng kí thất bại")
    var errorCode = error.code;
   var  Message = error.message;
  });
    }


    login= () =>{
        const name = this.state.email
        const password= this.state.password
        const history = createBrowserHistory();
        app.auth().signInWithEmailAndPassword(name, password)
        .then((user) => {
            console.log(user)
            localStorage.setItem('user_ID','1')
            window.location.reload();
  })
        .catch((error) => {
            alert("Đang nhâp không thành công")
            var errorCode = error.code;
            var errorMessage = error.message;
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
                                      <span id="getMsg">Msg box</span>
                                      <span>"hihi"</span>
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
                                        <option value="Đà nẵng">Đà nẵng</option>
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
                                  <div className="err-message" style={{marginTop: '5px'}}>
                                    <span>Show msg</span>
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
      center: state.centerInfo
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    userLogin: () => {
        dispatch(UserLogin());
    },
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(LoginRegister)



