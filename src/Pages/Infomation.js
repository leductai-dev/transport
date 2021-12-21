import React, { Component } from 'react'

class Information extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statusFormEdit: false,
            name: '',
            phone: '',
            address: '',
            email: '',
            type: '',
        }
    }

    render() {
      return (
        <div className="flex-grow-1 map">
        <div className="contain">
          <div className="row w-100 p-2">
            <div className="col  col-8 mx-auto">
            </div>
          </div>
        </div>
      </div>
      
    )
    }
}
export default Information
