import React, { Component } from 'react'

export default class li_listTeam extends Component {
    render() {
      var active = this.props.active===1?"active":""
        return (
     <li className="nav-item">
        <a className={`nav-link ${active}`} onClick={()=>{this.props.setCurrentTeam(this.props.KeyTeam)}}  data-toggle="tab" href={`#index${this.props.code}`}>{`Team ${this.props.name+1}`}</a>
      </li>
     
        )
    }
}
// e map để render dán sách team