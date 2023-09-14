import {Content} from "antd/es/layout/layout";
import {useSearchParams} from "react-router-dom";
import {Button, Carousel, Col, Divider, Image, Input, List, message, Modal, Rate, Row, Typography} from "antd";
import Meta from "antd/es/card/Meta";
import React, {useEffect, useState} from "react";
import TextArea from "antd/es/input/TextArea";
import Map from "./Map";
import axios from "axios";
import moment from "moment"

const {Paragraph, Text} = Typography;

const Detail = ({windowHeight}) => {
    const [searchParams] = useSearchParams();
    const [paramID, setParamID] = useState(searchParams.get('id'))
    const [camp, setCamp] = useState({title: "", stars: 0, address: "", desc: "", lat: 0, lng: 0, imgs: [], time: ""});

    useEffect(()=>{
        const paramID = searchParams.get('id');
        getCampDetail(paramID)
    }, [])
    const getCampDetail = (id) => {
        axios.get('api/detail', {params: {id: id}}).then((res)=>{
            if (res.data.code !== 0) {
                message.error(res.data.message);
                return;
            }
            setCamp(res.data.data);
        }).catch((error)=>{
            message.error(error)
        })
    }

    return (
        <Content style={{minHeight: windowHeight}}>
            <Row style={{marginTop: '20px'}}>
                <Col span={2}></Col>
                <Col span={12}>
                    <Description camp={camp}></Description>
                    <Divider plain>最新评论</Divider>
                    <Comments campID={searchParams.get('id')}></Comments>
                </Col>
                <Col span={6} offset={2}>
                    <Imgs imgs={camp.imgs}></Imgs>
                    <Divider plain>位置信息</Divider>
                    <Map zoom={6} latlng={{lat: camp.lat, lng: camp.lng}} moveable={false}></Map>
                </Col>
                <Col span={2}></Col>
            </Row>
        </Content>
    );
}

const Description = ({camp}) => {
    return (
        <div>
            <Row>
                <h1>{camp.title}</h1>
            </Row>
            <Row style={{lineHeight: "35px"}}>
                <Col span={6}>
                    <Rate disabled defaultValue={0} value={camp.stars}></Rate>
                </Col>
                <Col span={4}>
                    平均星级: {camp.stars}
                </Col>
                <Col span={6}>
                    评论总数: {camp.comments}
                </Col>
                <Col>
                    发布日期: {moment(camp.time * 1000).format("YYYY-MM-DD")}
                </Col>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <h2>
                    地址: {camp.address}
                </h2>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <h2>
                    营地描述:
                </h2>
            </Row>
            <Row style={{marginTop: '10px'}}>
                <h3>
                    <span>
                        {camp.desc}
                    </span>
                </h3>
            </Row>
        </div>
    );
}

// const testImg = ["https://img.phb123.com/uploads/220613/800-220613145954a0.png", "https://img.phb123.com/uploads/220613/800-220613145954a0.png"];

const Imgs = ({imgs}) => {
    return (
        <div>
            <Carousel autoplay style={{height: 300, backgroundColor: 'rgba(209, 209, 209,0.5)', textAlign: 'center'}}>
                {imgs.map((img, idx)=><Image key={idx} height={300} src={`${axios.defaults.baseURL}/api/file?id=${img}`}></Image>)}
            </Carousel>
        </div>
    );
}

const Comments = ({campID}) => {
    const [coms, setComs] = useState([]);
    useEffect(()=>{
        getCommentList(campID);
    }, [])

    const commentAddEventHandle = () => {
        // console.log(comments)
        // const data = comments.map(item=>item);
        // setComs(comments);
        getCommentList(campID);
    }

    const getCommentList = (id) => {
        axios.get('/api/comments', {params: {campID: id}}).then((res)=>{
            if (res.data.code !== 0) {
                message.error(res.data.message);
                return;
            }
            setComs(res.data.data);
        }).catch((error)=>{
            message.error(error);
        });
    };

    return (
        <div>
            <List
                header={<CommentButton campID={campID} AddEventCallbackFunc={commentAddEventHandle} />}
                bordered
                size={'small'}
                dataSource={coms}
                renderItem={(item)=>(
                          <List.Item>
                              <Typography>
                                  <Paragraph>
                                      <span>用户: {item.user}</span>
                                      <span style={{marginLeft: '20px'}}>评分: {item.stars}</span>
                                      <span style={{marginLeft: '20px'}}>时间: {moment(item.time * 1000).format("YYYY-MM-DD HH:mm:ss")}</span>
                                  </Paragraph>
                                  <Text>
                                      {item.desc}
                                  </Text>
                              </Typography>
                          </List.Item>
                      )}>
            </List>
        </div>
    );
}

const CommentButton = ({campID, AddEventCallbackFunc}) => {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState("");
    const [stars, setStars] = useState(0);
    const [desc, setDesc] = useState("");
    const handleShowModal = () => {
        setDesc("");
        setStars(0);
        setUser("");
        setShow(true);
    }
    const handleShowOK = () => {
        const param = {campID: campID, user: user, stars: stars, desc: desc};
        addCampComment(param);
    }

    const addCampComment = (param) => {
        axios.post('/api/comments/add', param, {header: {'Content-Type': 'application/json'}}).then((res)=>{
            if (res.data.code !== 0) {
                message.error(res.data.message);
                return;
            }
            AddEventCallbackFunc();
            setShow(false);
        }).catch((error)=>{
            message.error(error)
        });
    }

    const handleShowCancel = () => {
        setShow(false);
    }
    return (
        <div>
            <Button type={'primary'} size={'small'} onClick={handleShowModal}>添加评价</Button>
            <Modal title={"评论"} open={show} onOk={handleShowOK} onCancel={handleShowCancel}>
                <Row>
                    <Col span={4}>用户名: </Col>
                    <Col span={17}><Input size={'small'} value={user} onChange={e=>{e.persist(); setUser(e.target.value);}} /></Col>
                </Row>
                <Row>
                    <Col span={4}>评分: </Col>
                    <Col span={17}><Rate value={stars} onChange={setStars} /></Col>
                </Row>
                <Row>
                    <Col span={4}>评论内容: </Col>
                    <Col span={17}><TextArea row={4} value={desc} onChange={e=>{e.persist(); setDesc(e.target.value);}} /></Col>
                </Row>
            </Modal>
        </div>
    );
}


export default Detail;