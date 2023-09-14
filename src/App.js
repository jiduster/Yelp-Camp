import React, {useState} from 'react';
import { Layout } from 'antd';
import { Header, Footer, Content } from 'antd/es/layout/layout';
import './index.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Head from './Head';
import Body from './Body';
import Foot from "./Foot";
import Detail from "./Detail";

const App = () => {
    const [bodyHeight, setBodyHeight] = useState(window.innerHeight - 64 - 64); // 两个64是在说head和foot的高度， 减掉以后刚好
    const [newEvent, setNewEvent] = useState(0);
    const newEventHandle = (ver) => {
        setNewEvent(ver);
    };

    return (
        <BrowserRouter>
            <Layout>
                <Head newEventCallback={newEventHandle}></Head>
                    <Routes>
                        <Route path='/' element={<Body windowHeight={bodyHeight} newEventNotice={newEvent}></Body>}></Route>
                        <Route path='/detail' element={<Detail windowHeight={bodyHeight} />}></Route>
                    </Routes>
                <Foot></Foot>
            </Layout>
        </BrowserRouter>
    );
}

export default App;