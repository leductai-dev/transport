import React, { Component } from 'react'
import Member from './member'


export default  class listteam extends Component {
  

    member_render =()=>{
      const members = this.props.members
      console.log("Danh sách member")
      console.log(JSON.stringify(members))
      var result=null
      if(members){
         result =Object.values(members).map((values,index)=>{
           const keyCode1= "x"+Math.random().toString(36).substr(2, 8)
           const keyCode2= "y"+Math.random().toString(36).substr(2, 8)
           const keyCode3= "z"+Math.random().toString(36).substr(2, 8)
          return(
            <Member 
            key={index} 
            keyCode1={keyCode1}
            keyCode2={keyCode2}
            keyCode3={keyCode3}
            vt={index}
            memberCode={Object.keys(members)[index]} name={values.name}
            phone={values.phone} position={values.position}>
            </Member>
          )
      });
      }
      return result
    }
    
    render() {

      console.log("Danh sách members");
      
     var active = this.props.active===1?"active":""
        return (
            <div id={`index${this.props.code}`} className={`container tab-pane ${active} `}>
            <div className="row row-cols-sm-2  row-cols-1 row-cols-md-3 row-cols-lg-4 gutters-sm">
              {this.member_render()}
              <div className="col col-sm-6 col-md-4 col-xl-3  h-100  mb-3">
                <div className=" w-100 h-75 mt-auto ">
                    <button
                        style={{backgroundColor: 'transparent',}}
                         onClick={()=>{this.props.addNewMember()}}
                         data-toggle="addteam" data-placement="bottom" 
                         title="Deleted This Team!" className="btn-addnew">
                        <img 
                        className="addnewbtn w-75" src="./png/addn.png" alt="" />
                        </button>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

