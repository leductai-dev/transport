import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Set_Page,Read_Data_Information} from './../Actions/Actions'
import {app} from '../firebaseConfig'

class Information extends Component {
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

  componentDidMount(){
    this.props.setPage(2);
    this.props.getData();
    const database = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/`)
    database.on('value', (dataSnapshot)=> {
        this.props.getData();
      })
  }
  
  saveInfo=()=>{
    console.log("Dữ liệu chuẩn bị lưu là:"+JSON.stringify(this.state))
    const database = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/`)
    var updates = {
        center_name:this.state.name,
        center_phone:this.state.phone,
        center_address:this.state.address,
        center_email:this.state.email,
        center_type:this.state.type,

    };
    database.update(updates);
    this.setState({
        statusFormEdit : !this.state.statusFormEdit
    })
  }

    setStatus=()=>{
        const {center}= this.props
        this.setState({
        statusFormEdit : !this.state.statusFormEdit,
        name:center.center_name,
        phone:center.center_phone,
        address:center.center_address,
        email:center.center_email,
        type:center.center_type
      })
    }
    fomrClose=(event)=>{
        if(event.target.id =="close")
        {
            this.setState({
                statusFormEdit : !this.state.statusFormEdit,
            }) 
        }
    
    }
   


    
    showEdit =()=>{
        if(this.state.statusFormEdit)
        {
            const {center}= this.props
            return (
                <div className="form-edit" id="close" onClick={(event)=>{this.fomrClose(event)}}>
                <div className="edit">
                  <button className="btn-close-form  rounded-circle border border-primary" onClick={(event)=>{this.fomrClose(event)}}><i id="close" className="fa fa-times" aria-hidden="true" /></button>
                  <h2 className="mx-auto  text-center d-block position-relative" style={{color: 'white'}}>EDIT
                    INFORMATION</h2>
                  <div className="p-0">
                    <div className="mt-cts d-flex mt-5">
                      <label className="position-absolute color-label"><i className="fa fa-user-o" aria-hidden="true" /> Center Name*:</label>
                      <input placeholder="Example: Police Man" type="text" className="edit-input" name="name" onChange={(event)=>{this.onChange(event)}} defaultValue={this.props.center.center_name} />
                    </div>
                    <div className="mt-cts d-flex">
                      <lable className=" position-absolute color-label"><i className="fa fa-phone" aria-hidden="true" /> Phone number*:</lable>
                      <input type="text" placeholder="Example: 0123456789" className="edit-input" name="phone" onChange={(event)=>{this.onChange(event)}} defaultValue={center.center_phone}/>
                    </div>
                    <div className="mt-cts d-flex">
                      <label className="  position-absolute color-label"><i className="fa fa-map-marker" aria-hidden="true" /> Address*:</label>
                      <input  className="edit-input" name="address" onChange={(event)=>{this.onChange(event)}} defaultValue={center.center_address} />
                    </div>
                    <div className="mt-cts d-flex">
                      <label className="  position-absolute color-label"><i className="fa fa-envelope-o" aria-hidden="true" /> Email*:</label>
                      <input placeholder="Example: Email18800@gmail.com" type="text" className="edit-input" name="email" onChange={(event)=>{this.onChange(event)}} defaultValue={center.center_email}/>
                    </div>
                    <div className="mt-cts  d-flex">
                      <label className="position-absolute color-label"><i className="fa fa-yelp" aria-hidden="true"/> Type Of Center*:</label>
                      <select id="type" name="type" className="edit-input select-control" onChange={(event)=>{this.onChange(event)}}>
                        <option className="hidden" selected disabled>Please choose one</option>
                        <option value="Police">Police </option>
                        <option value="Hospital">Hospital</option>
                        <option value="Firefighter">Firefighter</option>
                      </select>
                    </div>
                    <div className="position-relative d-flex " style={{marginTop: '80px'}}>
                      <button type="button" onClick={()=>{this.saveInfo()}} name id className="btn btn-edit border border-primary  mx-auto border px-5 rounded-pill">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )
        }
    }



    render() {
        const {center} = this.props
        console.log("Dữ liệu nhận được từ info "+this.props.center.center_address);
        return (
            <div className="flex-grow-1 map">
            <div className="contain">
              <div className="row w-100 p-2">
                <div className="col  col-8 mx-auto">
                  <div className="w-100 p-3 ">
                    <h2 className="mx-auto h2-title text-center d-block position-relative">CENTER
                      INFORMATION</h2>
                    <div className="content-man">
                      <div className="mt-4 d-flex mt-5">
                        <span className="ml-5 position-absolute"><img className="verti-tb" src="./png/house.png" alt="" /> Center Name*:</span>
                       <span className="position-relative" style={{left: '300px'}}>{center.center_name}</span>
                      </div>
                      <div className="mt-5 d-flex">
                        <span className="ml-5 position-absolute"><img className="verti-tb" src="./png/telephone.png" alt="" /> Phone number*:</span>
                        <span className="position-relative" style={{left: '300px'}}>{center.center_phone}</span>
                      </div>
                      <div className="mt-5 d-flex">
                        <span className=" ml-5 position-absolute"><img className="verti-tb" src="./png/notebook.png" alt="" /> Address*:</span>
                        <span className="position-relative" style={{left: '300px'}}>{center.center_address}</span>
                      </div>
                      <div className="mt-5 d-flex">
                        <span className=" ml-5 position-absolute"><img className="verti-tb" src="./png/gmail.png" alt="" /> Email*:</span>
                        <span className="position-relative" style={{left: '300px'}}>{center.center_email}</span>
                      </div>
                      <div className="mt-5 d-flex">
                        <span className="ml-5 position-absolute"><img className="verti-tb" src="./png/classification.png" alt="" /> Type Of Center*:</span>
                        <span className="position-relative" style={{left: '300px'}}>{center.center_type}</span>
                      </div>
                      <div className="mt-5 d-flex">
                        <button onClick={()=>{this.setStatus()}} type="button" name id className="btn btn-edit mx-auto border px-4 rounded-pill"><img className="mr-2 verti-tb" src="./png/edit.png" alt="" /> Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.showEdit()}
          </div>
          
        )
    }
}
const mapStateToProps = (state) => {
  return {
      center: state.centerInfo
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setPage: (page) => {
        dispatch(Set_Page(page));
    },
    getData: () => {
        dispatch(Read_Data_Information());
    },
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(Information)



