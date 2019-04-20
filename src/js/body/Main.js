import React, { Component } from 'react';
import * as rs from 'reactstrap';
import styled, {} from 'styled-components'
import axios from 'axios'

import ServerInfo from '../info/ServerInfo'

import BoardForm from '../components/main/BoardForm';
import BoardInfoList from '../components/main/BoardInfoList';
import BoardSearchForm from '../components/main/BoardSearchForm';
import BoardRemocon from '../components/main/BoardRemocon'


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      information : [
      ],
      check_information : [
        {row : 0}
      ],
      search_information : [

      ],
      search_check_information : [
        {row : 0}
      ],
      temp_information : [

      ],
      search_form : {
        keyword : '',
        search_filter : 'title',
      },
      tempInfo : [],
      collapse: false, 
      no : 2,
      view_board_list : 10,
      view_count : 10,
      view_add_count : 10,
      remocon_collapse : true,
      is_more_board_list : true,
      is_refrash : true,
      is_search : false,
      is_ie : false,
      is_render : false,
    };
    this.toggle = this.toggle.bind(this)
    this.more_button = null
    this.body = null
    this.remocon = null
    this.write_button = null
    this.is_dbcon = false
    this.server_url = ServerInfo().location
  }

      
  componentDidMount() {
    this.setState({
      credential : localStorage.getItem('credential')
    })
    window.addEventListener("scroll", this.handleScroll);
    setTimeout(()=>{
      window.scrollTo(0,0)
      this.setState({
        is_refrash : false
      })
    },250)
    const agent = navigator.userAgent.toLowerCase();
    if ( (navigator.appName === 'Netscape' && 
    agent.indexOf('trident') !== -1) || 
    (agent.indexOf("msie") !== -1)) {
      this.setState({
        is_ie : true
      })
    }else{
      this.more_button.remove()
    }
    if(localStorage.getItem('credential')!==null){
      axios({
        method:'post',
        url: this.server_url+'/board',
        params: {
          credential : localStorage.getItem('credential'),
        }
      }).then((res)=>{
        if(res.data!=='err'){
          this.setState({
            information : res.data[1],
            temp_information : res.data[1],
            is_render : true,
          })
        }else{
          localStorage.removeItem("name")
          localStorage.removeItem("credential")
          localStorage.removeItem("profile_image")
          window.location = '/'
        }
      })
    }else{
      this.more_button.remove()
      this.setState({
        information : [{
          title : '반가워요!',
          content : '웹 메모장이에요! 회원가입을 하시면 글을 저장할수있어요!',
          no : 1,
          register_date : 'now',
          update_date : 'now',
          credential : '',
        }],
        is_render : true,
      })
    }
  }

  
  handleScroll = (e) => {
    const { innerHeight } = window;
    const {information,check_information,
      view_board_list, view_count,is_refrash,search_form
      ,temp_information,is_more_board_list,view_add_count,is_ie} = this.state
    // ie 11 scrollingElement null
    if(!is_refrash){
      if(!is_ie){
        const myScroll = e.srcElement.scrollingElement.scrollTop
        if(localStorage.getItem('credential')!==null){
          if(search_form.keyword===''){
            if((innerHeight + myScroll) > this.props.footer.offsetTop) {
              if(is_more_board_list){
                if(!this.is_dbcon){
                  this.is_dbcon = true
                  axios({
                    method:'post',
                    url: this.server_url+'/board/list',
                    params: {
                      credential : localStorage.getItem('credential'),
                      view_board_list : view_board_list,
                      view_count : view_count
                    }
                  }).then((res)=>{
                    if(res.data!=='err'){
                      let data = res.data[1]
                    if(data.length!==0){
                      if(check_information[0].row===data[0].row){
                        this.setState({
                          is_more_board_list : false
                        })
                      }else{
                        this.setState({
                          information : information.concat(data),
                          temp_information : temp_information.concat(data),
                          check_information : data,
                          view_count : view_count + view_add_count
                        })
                      }
                    }else{
                      this.setState({
                        is_more_board_list : false
                      })
                    }
                    this.is_dbcon = false
                    }else{
                      localStorage.removeItem("name")
                      localStorage.removeItem("credential")
                      localStorage.removeItem("profile_image")
                      window.location = '/'
                    }
                  })
                }
              }
            }
          }
        }
      }
    };
  }

  handleUpdate=(e)=>{
    const {information,temp_information} = this.state
    this.setState({
      information : information.map(
        info =>{
          if(info.no===e.no){
            return {...e}
          }
          return info
        }
      ),
      temp_information : temp_information.map(
        info =>{
          if(info.no===e.no){
            return {...e}
          }
          return info
        }
      ),
    })
  }

  handleRemove=(no)=>{
    const {information} = this.state
    this.setState({
      information : information.filter(info => info.no !== no)
    })
  }

  handlesearchForm=(e)=>{
    const {temp_information} = this.state
    if(localStorage.getItem('credential')!==null){
      this.setState({
        credential : localStorage.getItem('credential')
      })
      if(e.keyword===''){
        setTimeout(()=>{
          this.setState({
            search_form : {
              search_filter : e.search_filter,
              keyword : e.keyword,
            },
            information : temp_information,
          })
        },300)
      }else{
        axios({
          method : 'post',
          url : ServerInfo().location+'/board/search/',
          params : {
            credential : localStorage.getItem('credential'),
            keyword : e.keyword,
            form : e.search_filter
          }
        }).then((res)=>{
          if(res.data.length!==0){
            let rd = res.data
            let temp = []
            this.setState({
              search_form : {
                search_filter : e.search_filter,
                keyword : e.keyword,
              },
              information : temp.concat(rd)
            })
          }else{
            this.setState({
              search_form : {
                search_filter : e.search_filter,
                keyword : e.keyword,
              },
              information : []
            })
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    }else{
      this.setState({
        search_form : {
          search_filter : e.search_filter,
          keyword : e.keyword,
        },
      })
    }
  }

  handleRemocon=(e)=>{
    const {remocon_collapse} = this.state
    switch(e){
      case "up" : window.scrollTo(0,0); break;
      case "down" : window.scrollTo(0,9999999); break;
      case "all" : 
        this.setState({
          remocon_collapse : !remocon_collapse,
        })
      break;
      default : break;
    }
  }

  infoFilter = (info)=>{ 
    const {search_form} = this.state
      if(search_form.search_filter==="title"){
        return info.title.indexOf(search_form.keyword)>-1
      }else if(search_form.search_filter==="content"){
        return info.content.indexOf(search_form.keyword)>-1
      }else{
        return info
      }
  }

  infoReverse = (info) =>{
    let arr = []
    info.forEach((j,i)=> {
      arr.push(info[(info.length-(i+1))])
    });
    return arr
  }

  toggle(e) {
    this.setState({ 
        collapse: !this.state.collapse,
    });
  }

  moreButtonClick=()=>{
    const {information,check_information,is_more_board_list,
      view_board_list, view_count
      ,temp_information,view_add_count} = this.state
    if(is_more_board_list){
      if(!this.is_dbcon){
        this.is_dbcon = true
        axios({
          method:'post',
          url: ServerInfo().location+'/board/list',
          params: {
            credential : localStorage.getItem('credential'),
            view_board_list : view_board_list,
            view_count : view_count
          }
        }).then((res)=>{
          let data = res.data[1]
          if(data.length!==0){
            if(data.length<10){
              this.setState({
                information : information.concat(data),
                temp_information : temp_information.concat(data),
                check_information : data,
                is_more_board_list : false
              })
              this.more_button.remove()
            }else{
              if(check_information[0].row===data[0].row){
                this.setState({
                  is_more_board_list : false
                })
              }else{
                this.setState({
                  information : information.concat(data),
                  temp_information : temp_information.concat(data),
                  check_information : data,
                  view_count : view_count + view_add_count
                })
              }
            }
          }
          this.is_dbcon = false
        })
      }
    }
  }

  render() {
    const {collapse, information, view_board_list, no,remocon_collapse,credential,is_render} = this.state
    return (
      <MainRender ren={is_render}>
        <MainController ref={ref=>{this.body=ref}}>
          <BoardController>
          <WriteButton
            ref = {ref=>this.write_button=ref}
            no={no}
            view_board_list={view_board_list}
            onClick={this.toggle}
            className={collapse ? 
              ("btn btn-secondary btn-sm") 
            : ("btn btn-success btn-sm")}
          >
          {collapse ? ("안쓰기") : ("글쓰기")}
          </WriteButton>
          <rs.Collapse isOpen={collapse}>
            <rs.Card>
              <rs.CardBody>
                <BoardForm
                  onClick={this.toggle}
                  onCreate={this.handleCreate}
                />
              </rs.CardBody>
            </rs.Card>
          </rs.Collapse>
          <BoardSearchForm
            onChange={this.handlesearchForm}
          />
          <BoardInfoList
            data={
              credential!==null?(information):
              (information.filter(info=>this.infoFilter(info)))
            }
            remocon_collapse={remocon_collapse}
            onUpdate={this.handleUpdate}
            onRemove={this.handleRemove}
          />
          <MoreButton
            ref={ref=>this.more_button=ref}
            className='btn btn-primary'
            onClick={this.moreButtonClick}
          >
          더보기
          </MoreButton>
          </BoardController>
        </MainController>  
        <BoardRemocon
          ref={ref=>{this.remocon=ref}}
          nav={this.props.nav}
          onClick={this.handleRemocon}
        />
      </MainRender>
    );
  }
}

const MainRender = styled.div`
  display : ${dis => {
    if(dis.ren){
      return "block;"
    }else{
      return "none;"
    }
  }}
`

const WriteButton = styled.button`
  width: 100% ;
  height : 40px;
  margin-bottom : 10px;
  display : block ;
`

const MoreButton = styled.button`
  width: 100%
  height : 40px;
  margin: 10px 0px 10px 0px;
  display : ${dis => {
    if(dis.more_button){
      if(dis.no<=dis.view_board_list){
        return "none;"
      }else{
        return "block;"
      }
    }
  }}
`

const MainController = styled.div`
  width: 70%;
  min-height: calc(100vh - 80px - 120px);
  margin: 0 auto;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  padding-bottom: 10px;
`
          
const BoardController = styled.div` 
  padding-top : 15px;
  width: 70%;
  margin: 0 auto;
`

export default Main;