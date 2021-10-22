import React, { Component } from 'react'
import ListTeam from '../Components/listTeam'
import Member from '../Components/member'
import Li_Listteam from '../Components/li_listTeam'
import { connect } from 'react-redux'
import {Set_Page,Read_Data,Set_Team,On_Read_Data} from './../Actions/Actions'
import {app} from '../firebaseConfig'
import $ from 'jquery';
class ManagerTeam extends Component {
  constructor(props) {
     super(props);
     this.countTeam = 0
     this.codeTeam =1000
     this.teamName =""
     this.state ={
         currentTeam:"",
         countTeam:null,
         teamName: "firtvalue"
     }
    
     
  }
  componentDidMount(){
    var allow = true
    console.log("component didmount")
    this.props.setPage(4);
    var database = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/`)
    
    database.on('value', (dataSnapshot)=> {
      if(allow){
        this.props.getData();
        allow = false
      }
      else{
        this.props.On_getData();
      }
    })
  
  }


  static getDerivedStateFromProps(nextProps, prevState){
 }

  componentDidUpdate(){
}


  countTeams = ()=>{
    if(this.props.infos.dataCenter){
      this.countTeam = Object.values(this.props.infos.dataCenter).length
    }
  }

  setCurrentTeam=(code,name)=>{
    this.props.setTeam(code)
    this.setState({
      currentTeam:code,
      teamName:name
    })
  }

  readTeamList=()=>{
    const infos = this.props.infos.dataCenter  
    var active=2
    var result = Object.values(infos).map((value,index)=>{ 
      if(value){
        this.codeTeam = Number(value.code.substring(1, 5));
      }
      active--;
      if(active<1){
        active =0
      }
      return(
        <Li_Listteam KeyTeam={value.code} setCurrentTeam={this.setCurrentTeam}  active={active} code={index}  key={index} team_name={value.team_name} />
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
      <ListTeam addNewMember={()=>this.createNewMember()} team_name={value.team_name} members={value.members}  active={active} code={index}  key={index}/>
    )
})
return result
}

createNewMember=()=>{
  this.database = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${this.props.infos.currentTeam}/members`)
      this.database.push({
        name:"Null",
        phone:"Null",
        position:"Null",
        avatar: `./png/avatar_${Math.floor(Math.random() * 5) + 1}.jpg`
      })
  }



createNewTeam=()=>{
  if(this.countTeam >4){
    alert("Số team nhiều nhất có thể là 5")
  }
  else{

    $(".tab-container").on('DOMNodeInserted', function(e) {
     if(e.target.classList)
     e.target.classList.add("active")
    });
    $(".nav-tabs").on('DOMNodeInserted', function(e) {
      console.log("Chạy ở đây")
      if(e.target.querySelector('[href]'))
    e.target.querySelector('[href]').classList.add("active")
   
    });
   
    if( document.querySelector('li.nav-item > a.active')){
      document.querySelector('li.nav-item > a.active').classList.remove('active')
      document.querySelector('div.tab-content > div.active').classList.remove('active')
      
    }
    this.setState({
      teamName:"Vehicle type"
    })

    this.countTeam++
    this.codeTeam = +this.codeTeam+1
    const idTeam = "z"+this.codeTeam+"z"
    this.props.setTeam(idTeam)
    this.databaseInfo = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${idTeam}`)
      this.databaseInfo.set({
        status_active:false,
        code:idTeam,
        members:null,
        Mission:{
          status:"false"
        },
        team_name:"Vehicle Type",
        team_latitude:"",
        team_longitude:"",
      })
      this.databaseTransaction = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/Transactions/${idTeam}`)
      this.databaseTransaction.set({
          team_latitude:"",
          team_longitude:"",
          user_id:"",
          user_longitude:"",
          user_latitude:"",
          name:"",
          phone:"",
          team_name:"Vehicle Type"
      })
  }

 
}

deleTeam=()=>{
  const infos = this.props.infos.dataCenter
  if(Object.values(infos).length){
  
   
  this.countTeam = Object.values(infos).length
  if(this.countTeam==1){
    const databaseInformation = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/`)
    databaseInformation.update({
      InforTeam:""
    })
    const databaseTransactions = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/`)
    databaseTransactions.update({
      Transactions:""
    })
    this.countTeam=0
  }else{
  var listCodeTeam = []
  listCodeTeam = Object.values(infos).map((value,index)=>{
    return value.code
  })
  const vt = listCodeTeam.indexOf(this.props.infos.currentTeam)
  if(Object.keys(infos)[vt+1]){
    this.props.setTeam(Object.keys(infos)[vt+1])
  }
  else{
    this.props.setTeam(Object.keys(infos)[vt-1])
   document.querySelector(`[href='#index${vt-1}'`).classList.add('active')
   document.querySelector(`#index${vt-1}`).classList.add('active')
  }

  this.countTeam--
  const databaseInfo = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${this.props.infos.currentTeam}`)
  databaseInfo.remove()
  const databaseTransaction = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/Transactions/${this.props.infos.currentTeam}`)
  databaseTransaction.remove()
}
}
else{
  alert("Không có team nào để xóa!!")
}
}


viewCode=()=>{
  alert("Enter This Code On The Mobile App To Login:   "+this.props.infos.currentTeam)
}

/* updateName =()=>{

  const databaseTransaction =app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/Transactions/${this.props.infos.currentTeam}/`)
  databaseTransaction.update({
    team_name: this.state.teamName
  })

  const database_UpdateTeamName = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${this.props.infos.currentTeam}/`)
  database_UpdateTeamName.update({
    team_name: this.state.teamName
  })
 

} */


nameChange = (event)=>{
  const name = event.target.name
  const value = event.target.value
  this.setState({
    [name]: value
  })
  const database_Transaction =app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/Transactions/${this.props.infos.currentTeam}/`)
  database_Transaction.update({
    team_name:event.target.value
  })
  const database_UpdateTeamName = app.database().ref().child(`CenterTeam/${localStorage.getItem('centerID')}/InforTeam/${this.props.infos.currentTeam}/`)
  database_UpdateTeamName.update({
    team_name:  event.target.value
  })
  
}
  
    render() {
      console.log("component render")
        return (
        <div className="flex-grow-1 map">
          <div className="contain">
            <ul className="nav nav-tabs ul-height mr-auto" role="tablist">
               {this.readTeamList()}
               <li className="nav-item">
               <button onClick={()=>{this.createNewTeam()}} 
                    type="button" name id
                    className=" btn-primary  btn_dele_team " 
                    data-toggle="delete team" data-placement="bottom" 
                    title="Add new a team!">
                    <i class="fa align_bottom  fa-plus-square-o" aria-hidden="true"></i>
               </button>
              </li>
              <div className="util_team d-flex ">
              <div className="input-group e_name mb-3">
                  <input  className="form-control i_outline form-control-sm" name="teamName" onChange={(event)=>{this.nameChange(event)}} value={this.state.teamName}/>
                  <div className="input-group-append">
                    <button onClick={this.updateName} className="btn btn-sm btn-success"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>  
                  </div>
              </div>

            <button onClick={()=>{this.viewCode()}}
                    className="ml-auto btn_dele_team btn-secondary btn_dele "
                    data-toggle="delete team" data-placement="bottom" 
                    title="View Code!"
                    >
                    <i class="fa fa-eye" aria-hidden="true"></i>
            </button>
            <button onClick={()=>{this.deleTeam()}}
                    className="ml-auto btn_dele_team btn-danger btn_view " id="btnv"
                    data-toggle="delete team" data-placement="bottom" 
                    title="Deleted This Team!"
                    >
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
            </button>
            </div>
            </ul>
            <div className=" tab-content tab-container">
               {this.listTeam_render()}
               {
                  this.countTeams()
               }
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
      On_getData:() =>{
        dispatch(On_Read_Data());
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
