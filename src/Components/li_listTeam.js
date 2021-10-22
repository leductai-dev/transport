import React, { Component } from 'react'

export default class li_listTeam extends Component {
 
    render() {
      var active = this.props.active===1?"active":""
        return (
     <li className="nav-item">
        <a className={`nav-link ${active}`} onClick={()=>{this.props.setCurrentTeam(this.props.KeyTeam,this.props.team_name)}}  data-toggle="tab" href={`#index${this.props.code}`}>{this.props.team_name}</a>
      </li>
     
        )
    }
} 