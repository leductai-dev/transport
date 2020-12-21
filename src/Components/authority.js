import React, { Component } from 'react'
import {app} from '../firebaseConfig'
import { connect } from 'react-redux'
import Team from './authoriryTeam'
import {Set_Status} from '../Actions/Action_transactions'
class authority extends Component {
    constructor(props) {
       super(props);
       this.Database_GetData_Team = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforCenterTeam/`)
       this.Database_Update_History = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforCenterTeam/`)

       this.state ={
            DataTeam :{}
       }
    }
    componentDidMount(){
        this.Database_GetData_Team.once('value',(datasnapshot)=>{
            this.setState({
                DataTeam: datasnapshot.val()
        })
        console.log(datasnapshot.val())

    } )}
    updateTransaction=(teamID)=>{
        if(teamID){
            const Database_Update_History = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/History/${this.props.transactionData.transaction_id}`)
            Database_Update_History.update({
                "team_id":teamID
            })
        }
    }
    showForm = ()=>{
          const Teama =this.state.DataTeam
          var t =  Object.values(Teama)
            var result = t.map((value,index)=>{
                return(
                    <Team update={(teamID)=>{this.updateTransaction(teamID)}} teamID={value.id} key={index} nameTeam={value} status={value.active_status}  ></Team>
                )
       })
        console.log( Object.values(Team))
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