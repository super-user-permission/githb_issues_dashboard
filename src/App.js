import './App.css';
import { OverlayTrigger, Pagination, Popover, Tooltip } from 'react-bootstrap';
import { Component } from 'react';
import { getTotalIssues } from './actions';
import { faCommentAlt, faInfoCircle, faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
    Open Issue
  </Tooltip>
);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      pages: 0,
      total_issues: 0,
      active: 1,
    }
  }

  componentDidMount() {
    this.getApiData(this.state.active);
  }

  // Function call to get listed issues for axios in github.
  getApiData = (current_page) => {
    getTotalIssues(current_page)
      .then(res => {
        this.setState({ data: res.data.items, pages: Math.ceil(res.data.total_count / 30), total_issues: res.data.total_count })
        var pages = [];
        for (let number = 1; number <= Math.ceil(res.data.total_count / 30); number++) {
          pages.push(
            <Pagination.Item onClick={(e) => this.onPaginationValueClick(e)} key={number} active={number === this.state.active}>
              {number}
            </Pagination.Item>,
          );
        }
        this.setState({ pages });
      })
      .catch(error => console.log(error))
  }

  onPaginationValueClick = (e) => {
    this.setState({ active: Number(e.target.text) });
    setTimeout(() => {
      this.getApiData(this.state.active)
    }, 500);
  }

  nextClick = () => {
    if (this.state.active < this.state.pages.length) {
      this.setState({ active: this.state.active + 1 })
      setTimeout(() => {
        this.getApiData(this.state.active)
      }, 500);
    }
    else {
      return null;
    }
  }

  prevClick = () => {
    if (this.state.active !== 1) {
      this.setState({ active: this.state.active - 1 })
      setTimeout(() => {
        this.getApiData(this.state.active)
      }, 500);
    }
    else {
      return null;
    }
  }

  render() {

    const { data, pages, total_issues, active } = this.state;

    return (
      <div className='fluid-container' >
        <div className='row bg-light pl-5 p-3'>
          <div className='col'>
            <div className='row'>
              <div className='col'>
                <FontAwesomeIcon icon={faBook} />
                <span className='fontConfig h5 pl-3'>axios/axios</span>
              </div>
            </div>
            <div className='row mt-4'>
              <div className='col'>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className='fontConfig fontM pl-2'>Issues</span>
                <span className='tag fontConfig fontM borderRadius15 px-2 ml-2'> {total_issues} </span>
              </div>
            </div>
          </div>
        </div>
        <div className='row m-5'>
          <div className='col border rounded'>
            <div className='row px-2 py-3 border-bottom bg-light'>
              <div className='col'>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span className='fontConfig'> {total_issues} Open </span>
              </div>
            </div>
            {data && data.map((value, index) => (
              <div className='row p-2 border-bottom' key={value.title} id="issues">
                <div className='col-11'>
                  <div className='row'>
                    <div className='col'>
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 100, hide: 200 }}
                        overlay={renderTooltip}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement='auto'
                        overlay={
                          <Popover className='bodypop' id='button-tooltip-2'>
                            <span>
                              {value.labels.map((label, index) => <span className='px-2 issueLabel mx-1' style={{ background: `#${label.color}`, color: '#fff' }} >{label.name}</span>)} <br />
                              {value.body}
                            </span>
                          </Popover>
                        }
                      >
                        <a className='fontConfig h6' target='_blank' href={value.html_url}> {value.title} </a>
                      </OverlayTrigger>
                      {value.labels.map(label => <span className='px-2 issueLabel mx-1' style={{ background: `#${label.color}`, color: '#fff' }} >{label.name}</span>)}
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col'>
                      <span className='fontXS' > #{value.number} </span>
                      <span className='fontXS' > opened {new Date(value.created_at).getDay()} day ago by {value.user["login"]} </span>
                    </div>
                  </div>
                </div>
                {value.comments ?
                  <div className='col d-flex justify-content-end align-self-center'>
                    <FontAwesomeIcon icon={faCommentAlt} />
                    <span className='fontConfig fontXS pl-2'> {value.comments} </span>
                  </div> : null
                }
              </div>
            ))}
          </div>
        </div>
        <div className='row'>
          <div className='col d-flex justify-content-center'>
            <Pagination>
              <Pagination.Prev onClick={this.prevClick} />
              {pages}
              <Pagination.Next onClick={this.nextClick} />
            </Pagination>
          </div>
        </div>
      </div >
    );
  }
}