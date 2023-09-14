import {Content} from "antd/es/layout/layout";
import React, {useEffect, useState} from "react";
import {Card, List, message, Rate} from "antd";
import axios from "axios";
import Meta from "antd/es/card/Meta";
import {Link} from "react-router-dom";


const Body = ({windowHeight, newEventNotice}) => {
    return (
        <Content style={{minHeight: windowHeight}}>
            <Camps newNotice={newEventNotice}></Camps>
        </Content>
    );
}

const Camps = ({newNotice}) => {
    const [camps, setCamps] = useState([])

    useEffect(()=>{
        getCamps()
    }, [newNotice])

    // 获取首页的营地列表数据
    const getCamps = () => {
        axios.get('/api/list', {params: {}}).then((res) => {
            if (res.data.code !== 0) {
                message.error(res.data.message);
                return;
            }
            setCamps(res.data.data)
        }).catch((error) => {
            message.error(error);
        });
    };


    return (
        <div style={{marginLeft: "35px", marginTop: "20px"}}>
            <List
                grid={{column: 4}}
                dataSource={camps}
                renderItem={(item)=>(
                    <List.Item>
                        <Link target={'_blank'} to={{pathname: '/detail', search: `id=${item.id}`}}>
                            <Card
                                style={{width: 300}}
                                cover={<img style={{height: "180px", width: "300px"}} src={`${axios.defaults.baseURL}/api/file?id=${item.imgs[0]}`}
                                />}>
                                <Rate disabled defaultValue={item.stars}></Rate>
                                <Meta title={item.title} description={`${item.desc.substring(0, 16)}...`}></Meta>
                            </Card>
                        </Link>
                    </List.Item>
                )}
            >
            </List>
        </div>
    );
};
export default Body;