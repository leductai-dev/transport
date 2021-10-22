import React, { Component } from 'react'

export default class historyItem extends Component {
    render() {
        console.log(this.props.date);
        return (
            <div className="list-group contact-group">
                    <div id="list" className="wrap-ct clearfix">
                      <div className="circle"><img className="user-img" src="./png/avatar.jpg" alt="" /></div>
                      <div className="user-info">
                        <p className="user-name">{this.props.name}</p>
                        <p className="time">{this.props.date}</p>
                        <p className="user-address"><i className="fa fa-map-marker" style={{fontSize: '27px'}} aria-hidden="true" />{this.props.address}</p>

                        <div>
                        <div id="demo" className="collapse">
                        <span className="reques-title">Request Information:</span>
                        <p className="request-info">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque dolor vel animi excepturi? Saepe optio odio ab distinctio cupiditate quae corrupti mollitia aspernatur nobis. Autem!.</p>
                        </div>
                          </div>
                          <button type="button" className="btn_down " data-toggle="collapse" id="btn_drop" data-target="#demo"><i class="fa fa-chevron-circle-down" aria-hidden="true"></i></button>
                        <span onclick="deleted()" id="hide" className="util-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></span>
                      </div>
                    </div>
                  </div>
        )
    }
}
