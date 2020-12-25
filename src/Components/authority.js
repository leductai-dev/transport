import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'
import Team from './authoriryTeam'
import {Set_Status} from '../Actions/Action_transactions'
class authority extends Component {
    constructor(props) {
       super(props);
       this.Database_GetData_Team = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/`)

       this.state ={
            DataTeam :{}
       }
    }
    componentDidMount(){
        this.Database_GetData_Team.on('value',(datasnapshot)=>{
            this.setState({
                DataTeam: datasnapshot.val()
        })

    } )}
    authorityTeam=(teamID)=>{
        if(teamID){
            const database_HistoryCenter = app.database().ref().child(`InfomationCenter/${localStorage.getItem('centerID')}/history/`) 
            const database_Mission = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${teamID}/Mission/`) 
            database_Mission.update({
                status: "true"
            })
            database_HistoryCenter.update({
                "team_id":teamID
            })
        }

    }
    showForm = ()=>{
            const Team =this.state.DataTeam
            var result = Object.values(Team).map((value,index)=>{
                return(
                    <Team update={(teamID)=>{this.authorityTeam(teamID)}} teamID={value.id} key={index} nameTeam={value} status={value.active_status}  ></Team>
                )
             })
            return result 
        }

    hideAuthority=()=>{
        this.props.hide();
    }
    render() {
        console.log(typeof this.state.DataTeam );
        return (
            <>
             <div className="authority_form">
                 <button onClick={()=>{this.hideAuthority()}} className="btn close_author btn-sm btn-danger rounded-circle">
                         <i class="fa author_ico fa-times" aria-hidden="true"></i>
                 </button>
                <h4 className="author_title">AUTHORITY</h4>
                <div className="team_container">
                {this.showForm()}
                </div>
            </div>

            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        transactionData: state.transaction
    }
  }
  
  
  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        hide: () => {
        dispatch(Set_Status());
    },
    }
  } 
export default connect(mapStateToProps,mapDispatchToProps)(authority)