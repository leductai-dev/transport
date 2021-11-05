import React, { Component } from "react";
import Member from "./member";

export default function ListTeam(props) {
    const member_render = () => {
        const members = props.members;
        var result = null;
        if (members) {
            result = Object.values(members).map((values, index) => {
                return (
                    <Member
                        key={index}
                        vt={index}
                        memberCode={Object.keys(members)[index]}
                        name={values.name}
                        phone={values.phone}
                        avatar={values.avatar}
                        position={values.position}
                    ></Member>
                );
            });
        }
        return result;
    };

    return (
        <div
            className={`container `}
        >
            <div className="row row-cols-sm-2  row-cols-1 row-cols-md-3 row-cols-lg-4 gutters-sm">
                {member_render()}
                <div className="col col-sm-6 col-md-4 col-xl-3  h-100  mb-3">
                    <div className=" w-100 h-75 mt-auto ">
                        <button
                            style={{ backgroundColor: "transparent" }}
                            onClick={() => {
                            }}
                            data-toggle="addteam"
                            data-placement="bottom"
                            title="Deleted This Team!"
                            className="btn-addnew"
                        >
                            <img
                                className="addnewbtn w-75"
                                src="./png/addn.png"
                                alt=""
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
