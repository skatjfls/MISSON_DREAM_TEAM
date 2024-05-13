import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Nav } from 'react-bootstrap';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Group from './pages/Group.js';
import LogIn from './pages/LogIn.js';
import SignUp from './pages/SignUp.js';
axios.defaults.withCredentials = true;

function App() {
  //let state = useSelector((state) => state )

  let [missionList, setMissionList] = useState([]);
  let [groupList] = useState(['그지깽깽이들', '그만 좀 먹어라', '예쁜말 고운말']);
  let [join, setJoin] = useState(false);
  let [create, setCreate] = useState(false);

  let [userName, setUserName] = useState();
  let [point, setPoint] = useState();
  let [missionInput, setMissionInput] = useState('');
  let [tap, setTap] = useState(0);
  let navigate = useNavigate();
  let [userCount] = useState(32)
  
  const [isLoggerIn, setIsLoggedIN] = useState(false);

  useEffect(() => {
    axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
    .then(res => {
      console.log('로그인 상태 : ',res);
      if(res.data === 'true'){
        setIsLoggedIN(true);
      }else{
        setIsLoggedIN(false);
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error)
    })
<<<<<<< HEAD
    
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/GetInfo.php');
        console.log(res);
        const userData = res.data;
        setUserName(userData.name);
        setPoint(userData.point);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
=======

    axios.get('http://localhost/MISSION_DREAM_TEAM/PHP/CheckLoginState.php')
    .then(res => {
      console.log('로그인 상태 : ',res);
      if(res.data === 'true'){
        setIsLoggedIN(true);
      }else{
        setIsLoggedIN(false);
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error)
    })

>>>>>>> 72bb6472598dc8803082fd473aa3216a5cfa9a97
  });

  const handleAddMission = async () => {
    try {
      // 새로운 미션 추가
      const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/Insert_mission.php', {
        mission: missionInput // 미션 내용
      });
      console.log('insert_mission',res)
    
      // 미션 목록 갱신
      setMissionList([...missionList, missionInput]);
      fetchMissions(setMissionList);
      setMissionInput('');
    } catch (error) {
      console.error('Error adding mission:', error);
    }
  };
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <div className="nav-bar">
              <img className="img-logo" onClick={()=>{navigate('/')}} src="/img/dream.png"/>
              <div>
                <h6>{ userName }</h6>
                <h6>{ point } point</h6>
                <img className="imgs" src="/img/gear.png"/>
                <button className="button-logout" onClick={()=>{
                  axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/LogOut.php')
                  .then(res => {
                    navigate('/login')
                  })
                  .catch(err => {
                    console.log(err)
                  })
                  }}>로그아웃</button>
              </div>
            </div>
            <div className="main-top">
              {
                tap == 0? <>
                  <h1>To do list</h1>
                  <input className="input-todo" type="text" value={missionInput} onChange={(e)=>{ setMissionInput(e.target.value)}}placeholder="오늘의 할 일을 작성하세요!"></input>
                  <button className="button-todo-plus" onClick={handleAddMission}>+</button>
                </> : <h1>Calendar</h1>
              }
              <Nav variant="tabs" defaultActiveKey="todo" className="tap">
                <Nav.Item>
                  <Nav.Link onClick={()=>{ setTap(0) }} eventKey="todo">to do</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={()=>{ setTap(1) }} eventKey="calendar">calendar</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            {
              tap == 0 ? <ToDo setCreate={setCreate} setJoin={setJoin} groupList={groupList} missionList={missionList} setMissionList={setMissionList} navigate={navigate}/> : null
            }
            {
              tap == 1 ? <MyCalendar/> : null
            }
          </div>
        }/>
        <Route path="/login" element={ <LogIn userCount={userCount} navigate={navigate}/> }/>
        <Route path="/signup" element={ <SignUp/> }/>
        <Route path="/group" element={ <Group/> }/>
        <Route path="*" element={<div>404</div>}/>
      </Routes>
      <CreateGroup create={create} setCreate={setCreate}/>
      <JoinGroup join={join} setJoin={setJoin}/>
    </div>
  );
}


const fetchMissions = async (setMissionList) => {
  try {
      const res = await axios.get(`http://localhost/MISSION_DREAM_TEAM/PHP/Show_mission.php?`)
      console.log('show_mission',res)
      setMissionList(res.data)
  } catch (error) {
      console.error('Error fetching missions:', error)
  }
}

// Todo 탭
function ToDo(props) { 
  const inputFileRef = useRef(null);
  useEffect(() => {
    fetchMissions(props.setMissionList);
  }, []);
  
  const handleDeleteMission = async (i) => {
    try {
      const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/Delete_mission.php', {
        mission_idx: props.missionList[i][0]
      })
      console.log(res)
      fetchMissions(props.setMissionList);
    } catch (error) {
      console.error('Error deleting mission:', error);
    }
  };
  
  const handleImageUpload = async (e, i) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('imgFile', file);
    formData.append('mission_idx', props.missionList[i][0])

    console.log(file)
    try {
      const res = await axios.post('http://localhost/MISSION_DREAM_TEAM/PHP/ImageUpload.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Image uploaded:', res.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return(
    <div className="todo-tap">
      <div className="row">
        <div className="col-md-4"></div>
        <div className="col-md-4">
          {props.missionList && props.missionList.length > 0 && (
            props.missionList.map(function(content, i){
              return (
                <div className="mission" key={i}>
                  <input type="checkbox"/>
                  <h6 id={ content[2] }>{ content[2] }</h6>
                  <input type="file" accept="image/*" ref={inputFileRef} style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, i)} />
                  <img className="imgs" src="/img/camera.png" onClick={() => inputFileRef.current.click()} />
                  <button className="button-x" onClick={()=>{ handleDeleteMission(i) }}>X</button>
                </div>
              )
            })
          )}
          {(!props.missionList || props.missionList.length === 0) && (
            <div className='empty-mission'>미션을 추가해보세요!</div>
          )}
        </div>
        <div className="col-md-4">
          <div className="myGroup">
            <div className="myGroup-top">
              <h5>나의 그룹</h5>
              <button onClick={()=>{ props.setCreate(true) }} className="button-plus">+</button>
            </div>
            {
              props.groupList.map(function(content, i){
                return (
                  <div className="groupList" key={i}>
                    <h6 onClick={()=>{ props.navigate('/group')}}>{ content }</h6>
                  </div>
                )
              })
            }
            <button className="button-mygroup" onClick={()=>{ props.setJoin(true) }}>그룹 가입하기</button>
          </div>
        </div>
      </div>
    </div>
  )
}


// 캘린더 탭
function MyCalendar() {
  let [value, setValue] = useState(new Date());
  return (
    <div className='calendar-tap'>
      <Calendar
        onChange={setValue}
        value={value}
        formatDay={(locale, date) => moment(date).format("DD")}
      ></Calendar>
      {
        console.log(moment(value))
      }
      <div>
        {moment(value).format("YYYY년 MM월 DD일")}
      </div>
    </div>
  );
}

// 그룹 생성 모달
function CreateGroup(props) {
  return (
    <Modal show={props.create} onHide={() => props.setCreate(false)} className='modal modal-xl'>
      <Modal.Header closeButton>
        <Modal.Title>그룹 생성</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-creategroup">
        <div className='modal-div'>
          <h5>그룹 이름</h5>
          <input className="input-groupname" type="text" placeholder="그룹 이름을 작성해주세요!"></input>
          <p>이미 존재하는 이름입니다.</p>
        </div>
        <div className='modal-div'>
          <h5>포인트 별 금액</h5>
          <div>
            <span>₩0</span><span>₩500</span><span>₩1,000</span><span>₩2,000</span><span>₩3,000</span><span>₩5,000</span>
            <div className='modal-p'>
              <p>동기부여를 위해 포인트별 금액을 설정해보세요! 벌금처럼 걷어서 회식이나 1/n을 해도 좋고, 꼴등이 1등에게 쏘기도 좋아요!</p>
              <p>벌금이 부담스럽다면 0원으로 설정 후 상벌을 정해보세요.</p>
            </div>
          </div>
        </div>
        <div className='modal-div'>
          <h5>그룹 공지사항</h5>
          <textarea placeholder="그룹 내에서 지켜야 할 규칙을 작성해주세요."></textarea>
        </div>
        <div className='modal-div'>
          <h5>가입 비밀번호</h5>
          <input className="input-grouppw" type="password" placeholder="비밀번호를 숫자로 작성해주세요!"></input>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className="button-group" variant="secondary">
          그룹 만들기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// 그룹 가입 모달
function JoinGroup(props) {
  return (
    <Modal show={props.join} onHide={() => props.setJoin(false)} className="modal">
      <Modal.Header closeButton>
        <Modal.Title>그룹 가입</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-joingroup'>
        <input type="text" placeholder="그룹 이름"></input>
        <input type="password" placeholder="PASSWORD"></input>
        <button className='button-join'>그룹 가입하기</button>
      </Modal.Body>
    </Modal>
  );
}

export default App;