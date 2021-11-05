import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'


export default function Member(props) {

      const value = props.avatar ? props.avatar:  `./png/avatar_${Math.floor(Math.random() * 5) + 1}.jpg`
        return (
            <div className="col col-sm-6 col-md-4 col-xl-3  mb_45">
            <div className="card box_sd">
              <img src="https://via.placeholder.com/340x120/006dfb/yellow" alt="Cover" className="card-img-top" />
              <div className="card-body pb-0   text-center">
              <div>
              <img src={`${value}`} style={{width: '100px', marginTop: '-65px'}} alt="User" className="img-fluid img-thumbnail rounded-circle border-0 mb-1" />
              <div className="text-secondary  mb-4">
                <input onChange={(event)=>{this.txtChange(event)}} value={"Le duc tai"} className="input3 focus" name="name" />
                <label className="edit_right"><i className="fa fa-pencil" aria-hidden="true" /></label>
              </div>
              <div className="text-secondary mb-1"><span className="absolute">Phone:</span> 
                <input  onChange={(event)=>{this.txtChange(event)}}  value={'01266540680'} className="m-left focus" name="phone" />
                <label  className="edit_right"><i className="fa fa-pencil" aria-hidden="true" /></label>
              </div>
              <div className="text-secondary mb-2"><span className="absolute">Position:</span>
                <input  onChange={(event)=>{this.txtChange(event)}} value={"Postion"} className="m-left focus" name="position" />
                <label className="edit_right"><i className="fa fa-pencil" aria-hidden="true" /></label>
              </div>
            </div>

          </div>
              <div className="btn bg_btn_edit btn-group" style={{borderTop: '1px solid rgba(83, 77, 77, 0.158)'}}>
                <button onClick={()=>{this.delete()}} type="button" name id className="btn color_white btn-md"><i className="mr-1 fa fa-trash-o" aria-hidden="true" />Delete</button>
              </div>
            </div>
          </div>
        
        )
    }
