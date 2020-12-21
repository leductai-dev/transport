import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Set_Page,} from './../Actions/Actions'
class History extends Component {
  componentDidMount(){
    this.props.setPage(3);
  }
    render() {
        return (
            <div className="flex-grow-1 map">
            <div className="contain">
              <ul className="nav nav-tabs ul-height" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#home">Mới nhất</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu1">Gần đây</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu2">Tháng qua</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#menu2">Trước nữa</a>
                </li>
              </ul>
              <div className=" tab-content tab-container">
                <div id="home" className="container tab-pane active">
                  <div className="list-group contact-group">
                    <div id="list" className="wrap-ct clearfix">
                      <div className="circle"><img className="user-img" src="./png/avatar.jpg" alt="" /></div>
                      <div className="user-info">
                        <p className="user-name">Đầu Cắt Moi</p>
                        <p className="time">8:30AM | 20-11-2011</p>
                        <p className="user-address"><i className="fa fa-map-marker" style={{fontSize: '27px'}} aria-hidden="true" /> <a href>03 Hoàng Tương, Thanh Ba, Phú Thọ</a></p>
                        <span className="reques-title">Request Information:</span>
                        <p className="request-info">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque dolor vel animi excepturi? Saepe optio odio ab distinctio cupiditate quae corrupti mollitia aspernatur nobis. Autem!.</p>
                        <p />
                        <span onclick="deleted()" id="hide" className="util-btn"><i className="fa fa-eye" aria-hidden="true" /></span>
                      </div>
                    </div>
                    <div className="wrap-ct clearfix">
                      <div className="circle"><img className="user-img" src="./png/avatar.jpg" alt="" /></div>
                      <div className="user-info">
                        <p className="user-name">Nguyễn Văn Tào</p>
                        <p className="time">8:30AM | 20/11/2011</p>
                        <p className="user-title">Tôi đang gặp tai nạn. Xin hãy đến đây giúp tôi</p>
                        <p className="user-address"> <i className="fa fa-map-marker" style={{fontSize: '30px'}} aria-hidden="true" /> <a href>03 Hoàng Tương, Thanh Ba, Phú Thọ</a>
                        </p>
                        <span className="util-btn">⋮</span>
                      </div>
                    </div>
                    <div className="wrap-ct clearfix">
                      <div className="circle"><img className="user-img" src="./png/avatar.jpg" alt="" /></div>
                      <div className="user-info">
                        <p className="user-name">Nguyễn Văn Tào</p>
                        <p className="time">8:30AM | 20/11/2011</p>
                        <p className="user-title">Tôi đang gặp tai nạn. Xin hãy đến đây giúp tôi</p>
                        <p className="user-address"> <i className="fa fa-map-marker" style={{fontSize: '30px'}} aria-hidden="true" /> <a href>03 Hoàng Tương, Thanh Ba, Phú Thọ</a>
                        </p>
                        <span className="util-btn">⋮</span>
                      </div>
                    </div>
                    <div className="wrap-ct clearfix">
                      <div className="circle"><img className="user-img" src="./png/avatar.jpg" alt="" /></div>
                      <div className="user-info">
                        <p className="user-name">Nguyễn Văn Tào</p>
                        <p className="time">8:30AM | 20/11/2011</p>
                        <p className="user-title">Tôi đang gặp tai nạn. Xin hãy đến đây giúp tôi</p>
                        <p className="user-address"> <i className="fa fa-map-marker" style={{fontSize: '30px'}} aria-hidden="true" /> <a href>03 Hoàng Tương, Thanh Ba, Phú Thọ</a>
                        </p>
                        <span className="util-btn">⋮</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="menu1" className="container tab-pane fade"><br />
                  <h3>Menu 1</h3>
                  <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                    ea
                    commodo consequat.</p>
                </div>
                <div id="menu2" className="container tab-pane fade"><br />
                  <h3>Menu 2</h3>
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                    laudantium, totam rem aperiam.</p>
                </div>
                <h5>You are at the bottom of the page</h5>
              </div>
            </div>
          </div>
          
        )
    }
}
const mapStateToProps = (state) => {
  return {
      infos: state.centerInfo
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      setPage: (page) => {
        dispatch(Set_Page(page));
    },
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(History)




