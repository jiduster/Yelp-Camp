import {Header} from "antd/es/layout/layout";
import React, {useState} from "react";
import {Menu} from "antd";
import New from "./New";
import {useNavigate} from "react-router-dom";

const Head = ({newEventCallback}) => {
    const [menu, setMenu] = useState([{title: "Campgrounds", path: "/"}, {title: "About", path: "/"}]);
    const navigate = useNavigate();
    const menuClick = (event)=>{
        console.log(event)
        navigate(event.item.props.path)
    }
    return (
        <Header style={{backgroundColor: 'rgb(220, 54, 70)'}}>
            <div style={{color: 'white', width: '120px', display: 'block', float: 'left', fontSize: '22px'}}>
                YelpCamp
            </div>
            <div style={{
                marginLeft: "50px",
                display: 'block',
                float: 'left',
                width: '400px'
            }}>
                <Menu style={{
                    backgroundColor: 'transparent',
                    fontSize: "16px",
                    color: "rgba(255, 255, 255, .55)"
                }}
                      mode="horizontal"
                      defaultSelectedKeys={['Campgrounds']}
                      items={menu.map((item)=>{
                          const key = item.title;
                          return {key, label: `${item.title}`, path: item.path};
                      })}
                    onClick={menuClick}
                >

                </Menu>
            </div>
            <New newEvent={newEventCallback}></New>
        </Header>
    );
}
export default Head;