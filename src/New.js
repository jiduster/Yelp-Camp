import React, {useState} from "react";
import {Button, Col, Input, message, Modal, Rate, Row, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons"
import Map from "./Map";
import {render} from "react-dom";
import axios from "axios";

const getBase64 = (file) => new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});
const New = ({newEvent}) => {
    const [show, setShow] = useState(false);
    const [user, setUser] = useState("");
    const [title, setTitle] = useState("");
    const [stars, setStars] = useState(0);
    const [address, setAddress] = useState("");
    const [desc, setDesc] = useState("");
    const [maxUploadPicNum] = useState(6);
    const [PicList, setPicList] = useState([]);
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [ver, setVer] = useState(0);
    const handleMapClick = (lat, lng) => {
        console.log("handleMapClick", lat, lng);
        setLat(lat);
        setLng(lng);
    };
    const HandleShow = () => {
        setUser("");
        setTitle("");
        setAddress("");
        setDesc("");
        setStars(0);
        setLat(0);
        setLng(0);
        setPicList([]);
        setShow(true);
    }

    const HandleCancel = () => {
        setShow(false);
    }

    const HandleOK = () => {
        const param = {
            user: user,
            title: title,
            stars: stars,
            address: address,
            lat: lat,
            lng: lng,
            imgs: PicList.map(item => item.response.data.id),
            desc: desc,
        };
        addCamp(param);
        setShow(false);
    }

    const addCamp = (param) => {
        axios.post('/api/add', param, {header:{"Content-Type": "application/json"}}).then((res) => {
            if (res.data.code !== 0) {
                message.error(res.data.message);
                return;
            }
            message.success("新增数据成功");
            setVer(ver + 1);
            newEvent(ver + 1);
        }).catch((error) => {
            message.error(error.message);
        });
    };

    const uploadImagePreviewHandle = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setImagePreviewSrc(file.url || file.preview);
        setImagePreviewShow(true);
        setImagePreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/')));
    }

    const UploadPicHandle = ({file, fileList, event}) => {
        console.log('upload handle', file.status, fileList, event);
        if (file.status === "uploading") {
            message.success("图片上传中，请耐心等待");
            setPicList(fileList)
        }

        if (file.status === "done") {
            message.success("上传成功");
            setPicList(fileList);
        }

        if (file.status === "removed") {
            const list = fileList.filter(item => item.uid !== file.uid);
            setPicList(list);
        }

        if (file.status === "error") {
            message.error("图片上传失败，请重试", 3);
            const list = fileList.filter(item => item.uid !== file.uid);
            setPicList(list);
        }
        setPicList(fileList);
    }

    const ImagePreviewCancel = () => {
        setImagePreviewShow(false);
    }

    const [ImagePreviewShow, setImagePreviewShow] = useState(false);
    const [ImagePreviewTitle, setImagePreviewTitle] = useState('');
    const [ImagePreviewSrc, setImagePreviewSrc] = useState('');
    const uploadButton = (
            <div>
                <PlusOutlined></PlusOutlined>
                <div style={{marginTop: 8}}> Upload </div>
            </div>
    )

    return (
        <div style={{
            float: 'right',
            display: "block",
            width: "100px"
        }}>
            <Button style={{
                backgroundColor: "transparent",
                color: 'rgba(255, 255, 255)'
            }}
            size={'large'} onClick={HandleShow}
            >
                New
            </Button>
            <Modal open={show} title={'露营地分享'} width={'800px'} onOk={HandleOK} onCancel={HandleCancel}>
                <Row>
                    <Col span={3}> 分享者: </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Input size={'small'} value={user} onChange={e=>{e.persist(); setUser(e.target.value);}}></Input>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}> 标题: </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Input size={'small'} value={title} onChange={e=>{e.persist(); setTitle(e.target.value);}}></Input>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}> 评分: </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Rate value={stars} onChange={setStars}></Rate>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        地址:
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Input size={'small'} value={address} onChange={e=>{e.persist(); setAddress(e.target.value);}}></Input>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        位置信息:
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Map latlng={{lat: lat, lng: lng}} zoom={6} moveable={true} onClick={handleMapClick}></Map>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}> 描述: </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Input.TextArea row={4} value={desc} maxLength={150} onChange={e=>{e.persist(); setDesc(e.target.value);}}></Input.TextArea>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        营地图片:
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Upload
                            action={`${axios.defaults.baseURL}/api/upload`}
                            listType='picture-card'
                            fileList={PicList}
                            onPreview={uploadImagePreviewHandle}
                            onChange={UploadPicHandle}
                        >
                            {PicList.length >= maxUploadPicNum ? null : uploadButton}
                        </Upload>
                    </Col>
                </Row>
            </Modal>
            <Modal open={ImagePreviewShow} title={ImagePreviewTitle} footer={null} onCancel={ImagePreviewCancel} >
                <img alt='pic' style={{width: '100%'}} src={ImagePreviewSrc}></img>
            </Modal>
        </div>
    );
}
export default New;