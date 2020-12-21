import React, { Component } from 'react'
import ListTeam from '../Components/listTeam'
import Member from '../Components/member'
import Li_Listteam from '../Components/li_listTeam'
import { connect } from 'react-redux'
import {Set_Page,Read_Data,Set_Team} from './../Actions/Actions'
import {app} from '../firebaseConfig'

class ManagerTeam extends Component {
  constructor(props) {
     super(props);
     this.state ={
         currentTeam:""
     }
  }
  componentDidMount(){
    this.props.setPage(4);
    var database = app.database().ref().child('CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforTeam/')
    database.on('value', (dataSnapshot)=> {
      this.props.getData();
    })
  }

  setCurrentTeam=(team)=>{
    console.log("current team:" +team)
    this.props.setTeam(team)
    this.setState({
      currentTeam:team
    })
  }

  readTeamList=()=>{
    const infos = this.props.infos.dataCenter  // sau khi có dữ liệu
    var active=2
    var result = Object.keys(infos).map((value,index)=>{ 
      active--;
      if(active<1){
        active =0
      }
      return(
        <Li_Listteam KeyTeam={value} setCurrentTeam={(teamCode)=>{this.setCurrentTeam(teamCode)}}  active={active} code={index}  key={index} name={index} />
      )
  })
  return  result
}

  listTeam_render=()=>{
  const infos = this.props.infos.dataCenter
  var active=2
  var result = Object.values(infos).map((value,index)=>{ 
    active--;
    if(active<1){ 
      active =0
    }
    return(
      <ListTeam addNewMember={()=>this.createNewMember()}  active={active} code={index}  key={index} members={value.members} />
    )
})
return result
}

createNewMember=()=>{
  this.database = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforTeam/${this.props.infos.currentTeam}/members`)
      this.database.push({
        name:"Null",
        phone:"Null",
        position:"Null"
      })
  }


createNewTeam=()=>{
  const idTeam = "z"+Math.random().toString(36).substr(2, 5)
  this.databaseInfo = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforTeam/${idTeam}`)
    this.databaseInfo.set({
      status_active:false,
      code:idTeam,
      members:null,
      Mission:{
        status:false
      }
    })

    this.databaseTransaction = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/Transactions/${idTeam}`)
    this.databaseTransaction.set({
        name:null,
        phone:null,
        team_latitude:null,
        team_longitude:null,
        user_id:null,
        user_longitude:null,
        user_latitude:null
    })
   
}
deleTeam=()=>{
  const databaseInfo = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforTeam/${this.props.infos.currentTeam}`)
  databaseInfo.remove()
  const databaseTransaction = app.database().ref().child(`CenterTeam/yym15naI10VGGoK94hR1Pa7eFX52/InforTeam/${this.props.infos.currentTeam}`)
  databaseTransaction.remove()

}

  
    render() {

        return (
        <div className="flex-grow-1 map">
          <div className="contain">
            <ul className="nav nav-tabs ul-height mr-auto" role="tablist">
               {this.readTeamList()}
               <li className="nav-item">
               <button onClick={()=>{this.createNewTeam()}} type="button" name id className="btn btn-primary rounded-circle btn-sm" >
               <i class="fa fa-plus-square-o" aria-hidden="true"></i>
               </button>
              </li>
            <button onClick={()=>{this.deleTeam()}}
                    className="ml-auto btn_dele_team position-absolute"
                    data-toggle="delete team" data-placement="bottom" 
                    title="Deleted This Team!"
                    >
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                    </button>

            </ul>
            <div className=" tab-content tab-container">
               {this.listTeam_render()}
            </div>
          </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
  return {
      infos: state.centerData
  }
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
      getData: () => {
          dispatch(Read_Data());
      },
      setPage: (page) => {
        dispatch(Set_Page(page));
    },
    setTeam: (team) => {
      dispatch(Set_Team(team));
  },
    
     
  }
} 
export default connect(mapStateToProps,mapDispatchToProps)(ManagerTeam)
