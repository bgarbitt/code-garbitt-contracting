import React, { Component } from 'react';
import logo from './gcl-logo.png';
import none from './img/no-images.png';
import './Homepage.css';

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    if (this.state.clicked === true) {
      this.setState({
        clicked: false
      });
    } else {
      this.setState({
        clicked: true
      });
    }
  }
  render () {
    return (
      <header className="navigation">
        <h1>
          Garbitt Contracting Ltd.
        </h1>
        <img src={logo} className="logo" alt="logo" />
        <nav className="navigation-normal">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#safety">Safety</a>
          <a href="#fleet">Fleet</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="navigation-dropdown">
          <button className="navigation-dropdown-button" onClick={this.handleClick}>Nav</button>
          {this.state.clicked ?
            <div className="navigation-dropdown-content">
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#safety">Safety</a>
              <a href="#fleet">Fleet</a>
              <a href="#contact">Contact</a>
            </div>
            : '' 
          }
        </div>
      </header>
    )
  }
}
class About extends Component {
  render () {
    return (
      <section className="about" id="about">
        <div className="about-parallax">
          <div className="about-parallax-opacity">
            <p className="about-parallax-pretty">ABOUT GARBITT CONTRACTING</p>
          </div>
        </div>
        <p className="about-statement">
          Garbitt Contracting Ltd is a mulching company providing safe, organized, 
          ergonomic, and environmentally friendly mulching services. Founded in 
          1998 by Hugh Garbitt, a Certified Utility Tree Trimmer, our concern for 
          the environment is put at the head of our business model. We believe our 
          mulching services provide the fastest, safest, and most productive 
          service in the industry.<br/><br/>
          Mulching is cost efficient and reduces a company’s environmental 
          footprint. Therefore, we provide environmentally responsible solutions 
          for the oil & gas, forestry, agriculture, and construction industries. 
          We are focused on completing the task safely, on time, and to the 
          customer’s satisfaction.<br/><br/>
          Our team of qualified and ticketed crews also have Enform safety tickets 
          and have various Oilfield experience. We are also ISN, Comply Works and 
          CQN Advantage  certified.

        </p>
      </section>
    );
  }
}
//#region Services
class Services extends Component {
  constructor (props) {
    super (props);
    this.state = {
      servicesList: [
        "Mulching", "Oilfiled Labour Crews", "Tree Trimming", "Tree Removal",
        "Tree Transplanting", "Chainlink Fencing", "Snow Plowing (Snowcat)",
        "Skid Steers", "Labour Crews", "Pipeline Clearing", "Fenceline Clearing",
        "General Excavating", "Commercial / Residential Land Clearing",
        "Disaster / Debris Clean-up", "Overgrowth Clean-Up", "Mulch Site Projects",
        "Powerline Clearing"
      ]
    }
  }
  render () {
    return (
      <section className="services" id="services">
        <div className="services-parallax">
          <div className="services-parallax-opacity">
            <p className="services-pretty">SERVICES</p>
          </div>
        </div>
        <p className="services-statement">At Garbitt Contracting, we offer services in: (click for more info)<br/></p>
        <ServicesList servicesList={this.state.servicesList}/>
        <br/>
      </section>
    );
  }
}
class ServicesList extends Component {
  render () {
    return (
      <div className="horizonatal-list-container">
        <ul className="services-list">
          {this.props.servicesList.map((service, index) => {
            return <ModalButton name={service} key={index}/>
          })}
        </ul>
      </div>
    );
  }
}
class ModalButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick (e) {
    if (this.state.showModal === false) {
      e.preventDefault();
      this.setState({showModal:true});
    } else {
      this.setState({showModal:false});
    }
  }
  render() {
    return (
      <li>
        <button 
          name="services-button"
          onClick={this.handleClick}>
          {this.props.name}
        </button>
        {this.state.showModal ? <Modal name={this.props.name} onSpanClick={this.handleClick}/> : null }
      </li>
    );
  }
}
/*
This is where a database will be needed. In order to have individual
modals pop up without manually creating an unknown amount, a database
will be needed.
Note: the iframe for the video needs a youtube url of the form:
      https://www.youtube.com/embed/05u0H1knxNE
      ec2-35-182-125-158.ca-central-1.compute.amazonaws.com
      http://127.0.0.1:5000/
*/
class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "http://127.0.0.1:5000/services/retrieve",
      title: this.props.name,
      description: "Description Loading...",
      videoUrls: ["about:blank"],
      resources: "Resources Loading...",
      imageUrls: [""]
    }
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
    this.getServices(this.state.url, "service="+encodeURIComponent(this.state.title));
  }
  getServices(url, service) {
    return fetch(url, {
      body: service,
      cache: 'no-cache',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    }).then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        //data = {"explanation":["s"],"image":["i","i"],"video":["v","v"]}
        description: data.explanation[0],
        videoUrls: data.video,
        imageUrls: data.image
      })
    }).catch(error => console.error(error));
  }
  
  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.props.onSpanClick();
  }
  handleClick(e) {
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.props.onSpanClick();
  }
  // What to do about an empty video: insert "about_blank" as a video url in the
  // database.
  render () {
    return (
      <div className="service-modal-backdrop" >
        <div className="service-modal-content" ref={node => {this.node = node;}}>
          <button 
            className="service-modal-close"
            type="button"
            onClick={this.handleClick}>
            &times;
          </button>
          <h2>{this.props.name}</h2>
          <p dangerouslySetInnerHTML={{__html: this.state.description}} />
          <h3>Video Example (if available)</h3>
          <div className="video-container">
            <iframe 
              width="420" 
              height="236" 
              src={this.state.videoUrls[0]} 
              title={this.props.name + " Video"} allowFullScreen>
            </iframe>
          </div>
          <h3>Image Gallery (if available)</h3>
          <ModalImages urls={this.state.imageUrls} {...this.state}/>
          
        </div>
      </div>
    );
  }
}
/*
This is for the images that will be populating each modal.
They will work by linking to a image hosting site (most likely
imgur) by way of url's. I'm worried about links dying after
awhile, but that should be a minor problem and requires changing
the url's in the database. 
*/
class ModalImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageTitle: this.props.title + " image"
    };
  }
  render() {
    return(
      <div className="horizontal-list-container">
        <ul className="service-modal-images">
            {this.props.urls.map((url, index) => {
              if (url === "") {
                return (
                  <li className="service-modal-images-crop" key={index}>
                    <img src={none} alt={"This image is unavailable"}/>
                  </li>
                );
              } else {
                return (
                  <li className="service-modal-images-crop" key={index}>
                    <a href={url} target="_blank"><img src={url} alt={this.state.imageTitle + " " + index}/></a>
                  </li>
                );
              }
            })}
        </ul>
      </div>
    );
  }
}
//#endregion Services
//#region Safety
class Safety extends Component {
  render() {
    return (
      <section className="safety" id="safety">
        <div className="safety-parallax">
          <div className="parallax-opacity">
            <p className="safety-pretty">SAFETY</p>
          </div>
        </div>
        <p className="safety-statement">
          Garbitt Contracting Ltd has developed a SECOR Safety Program. A SECOR 
          (Small Employer Certificate of Recognition) shows that our Health and 
          Safety Management System has been evaluated by a certified auditor and
          meets provincial standards established by Alberta Occupational Health 
          and Safety. More about secor can be found <a href="http://www.youracsa.ca/cor-secor/" target="_blank">here</a>.
          <br/><br/>
          Garbitt Contracting Ltd has included the contents of the Occupational 
          Health and Safety Act and Regulations in our program. We ensure that 
          our employees are up to date with all their safety and/or training 
          courses as required. Our company’s program also involves safety 
          training in our everyday work.
          <br/><br/>
          Every operator has all the necessary safety certifications: First Aid, 
          H2S Alive, CSTS, Dangerous Goods Transportation, and WHMIS. All 
          operators are also screened for substance abuse.
          <br/><br/>
          Garbitt Contracting Ltd is part of the ISN and ComplyWorks network and 
          can be viewed upon request.
        </p>
      </section>
    );
  }
}
//#endregion Safety
//#region Fleet
class Fleet extends Component {
  constructor (props) {
    super (props);
    this.state = {
      //url: "http://127.0.0.1:5000/",
      fleet: {}
    }
  }
  componentDidMount () {
    this.getFleet(this.props.url);
  }
  getFleet(url) {
    return fetch(url, {
      cache: 'no-cache',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET'
    }).then(response => {
      console.log(response);
      return response.json();
    }).then(data => {
      this.setState({
        //{"machine 1":["url", "url",...], "machine 2":...}
        fleet: data
      })
    }).catch(error => console.error(error));
  }
  test() {
    console.log(this.props.url);
  }
  render () {
    return (
      <section className="fleet" id="fleet">
        <div className="fleet-parallax">
          <div className="parallax-opacity">
            <p className="fleet-pretty">FLEET</p>
          </div>
        </div>
        <FleetImages fleetList={this.state.fleet}/>
      </section>
    );
  }
}
class FleetImages extends Component {
  render () {
    return (
      <div className="horizonatal-list-container">
        <ul className="fleet-list">
          {Object.keys(this.props.fleetList).map((key, index) => 
            <FleetModalImageButton 
              name={key} 
              key={index} 
              urls={this.props.fleetList[key]}
              />
          )}
        </ul>
      </div>
    );
  }
}
class FleetModalImageButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.backgroundImg = this.backgroundImg.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  backgroundImg () {
    if (this.props.urls[0] === '') {
      return {backgroundImage: 'url(${none})', backgroundSize: 'cover'};
    } else {
      return {backgroundImage: "url(" + this.props.urls[(Math.floor(Math.random() * this.props.urls.length))] + ")"}
    }
    
  }
  handleClick (e) {
    if (this.state.showModal === false) {
      e.preventDefault();
      this.setState({showModal:true});
    } else {
      this.setState({showModal:false});
    }
  }
  render() {
    return (
      <li>
        <p className="fleet-button-title">{this.props.name}</p>
        <button 
          name="fleet-button"
          onClick={this.handleClick}
          style={this.props.urls[0] === '' ? {} : {backgroundImage: "url(" + this.props.urls[(Math.floor(Math.random() * this.props.urls.length))] + ")"}}>
        </button>
        {this.state.showModal ? <FleetModal name={this.props.name} urls={this.props.urls} onSpanClick={this.handleClick}/> : null }
      </li>
    );
  }
}
class FleetModal extends Component {
  constructor(props) {
    super(props);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clicked = this.clicked.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }
  
  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.props.onSpanClick();
  }
  handleClick(e) {
    document.removeEventListener('click', this.handleOutsideClick, false);
    this.props.onSpanClick();
  }
  clicked(e) {
    console.log("Click!");
    return
  }
  render () {
    return (
      <div className="fleet-modal-backdrop" >
        <div className="fleet-modal-content" ref={node => {this.node = node;}}>
          <div className="slider">
            <div className="slides">
              {this.props.urls.map((imgsrc, index) => {
                return (
                  <div className="slide" id={this.props.name + index} 
                  key={this.props.name + index}>
                    <a href={imgsrc} target="_blank">
                      <img src={imgsrc} alt={this.props.name + index} id={this.props.name + index}/></a></div>
                );
              })}
            </div>
            {this.props.urls.map((imgsrc, index) => 
              <a className="slide-buttons" href={"#" + this.props.name + index} onClick={this.clicked}>{index+1}</a>
            )}
          </div>
          <button 
            className="fleet-modal-close"
            onClick={this.handleClick}>
            &times;
          </button>
        </div>
      </div>
    );
  }
}
//#endregion Fleet
class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "http://127.0.0.1:5000/contact",
      name: '',
      organization: '',
      email: '',
      phone: '',
      message: '',
      checked: false,
      warn: false,
      pressed: false,
      sent: false,
      confirmed: false,
      notified: false,
      cols: "50",
      rows: "5"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.warningButton = this.warningButton.bind(this);
    this.okButton = this.okButton.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }
  handleChange(e) {
    const name = e.target.name;
    this.setState({[name]: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.phone === '' && this.state.email === '') {
      if (this.state.checked === false) {
        this.setState({warn: true});
        return;
      }
    }
    this.setState({ sent: true, pressed: true });
    this.sendEmail();
    window.setTimeout(() => {
      this.setState({
        sent: false, pressed: false
      });
    }, 5000);
  }
  sendEmail() {
    var data = 
      "name="+encodeURIComponent(this.state.name)+"&"+
      "organization="+encodeURIComponent(this.state.organization)+"&"+
      "email="+encodeURIComponent(this.state.email)+"&"+
      "phone="+encodeURIComponent(this.state.phone)+"&"+
      "message="+encodeURIComponent(this.state.message);
    console.log(this.state.name);
    return fetch(this.state.url, {
      body: data,
      cache: 'no-cache',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    }).then(response => {
      return response.json();
    }).then(data => {
      this.setState({
        //data = {"confirmed":[true/false]}
        confirmed: data.confirmed
      })
    }).catch(error => console.error(error));
  }
  warningButton(e) {
    e.preventDefault();
    this.setState({
      warn: false,
      checked: true
    });
  }
  okButton(e) {
    e.preventDefault();
    this.setState({
      confirmed: false,
      notified: true
    });
  }
  render() {
    return (
      <section className="contact" id="contact">
        <div className="contact-parallax">
          <div className="parallax-opacity">
            <h1 className="contact-title">CONTACT</h1>
          </div>
        </div>
        <div className="contact-information-area">
          <p>
            Create a message to send to us using the fields below, or
            use the contact information further below to send us a message 
            another time.<br/><br/>
            <i>
              Note: Sending a message using the fields below <b>will not </b> 
              send the message using your email account. Instead it sends an
              email to our own account using our own account.
            </i>
          </p>
          <form className="contact-message-form" onSubmit={this.handleSubmit}>
            <label>
              <input type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Name"/><br/>
              <input type="text" name="organization"  value={this.state.organization} onChange={this.handleChange} placeholder="Organization (optional)"/><br/>
              <input type="text" name="email"  value={this.state.email} onChange={this.handleChange} placeholder="Email (optional)"/><br/>
              <input type="text" name="phone"  value={this.state.phone} onChange={this.handleChange} placeholder="Phone (optional)"/><br/>
              <textarea cols={this.state.cols} rows={this.state.rows} spellcheck="true" className="message" name="message"  value={this.state.message} onChange={this.handleChange} placeholder="Message..."/>
            </label>
            <br/>
            <input className="contact-submit-button" type="submit" value="Send Message" disabled={this.state.pressed}/>
            {this.state.warn ? <Warning warningButton = {this.warningButton}/> : ''}
            {this.state.sent ? <SentPopup/> : ''}
            {this.state.confirmed ? <EmailConfirmation okButton = {this.okButton}/> : ''}
            <br/>
            <br/>
          </form>
          <div className="contact-info">
            <h3>Contact Information</h3>
            <p>
              Owner: <i>(780) 524-8267</i> (Hugh Garbitt)<br/>
              Email: <i>garbitt@telus.net</i><br/>
              Office: <i>(780) 524-4754</i><br/>
              Fax: <i>(780) 524-4753</i><br/>
              Location: SW-21-70-23-W5<br/>
              <span className="background-color-text">Location: </span>Valleyview, AB<br/>
              <span className="background-color-text">Location: </span>T0H 3N0<br/>
            </p>
          </div>
          <br/>
          <br/>
        </div>
      </section>
    );
  }
}
class Warning extends Component {
  constructor (props) {
    super(props);
  }
  render() {
    return(
      <div className="contact-backdrop">
        <div className="contact-box">
          <h3>one time heads up</h3>
          <p>
            Both the email and the phone fields were left blank. If there is not
            enough information in the message we may not be able to get back to
            you. This pop up won't appear again.
          </p>
          <button name="warning-button" onClick={this.props.warningButton}>ok</button>
        </div>
      </div>
    );
  }
}
class EmailConfirmation extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return(
      <div className="contact-backdrop">
        <div className="contact-box">
          <h3>Email has been sent!</h3>
          <button name="ok-button" onClick={this.props.okButton}>ok</button>
        </div>
      </div>
    );
  }
}
class SentPopup extends Component {
  render() {
    return (
      <div className="sent-box">
        <p>
          You're message has been sent! A confirmation popup will appear if
          the email has been successfully sent.
        </p>
      </div>
    );
  }
}
class Homepage extends Component {
  constructor (props) {
    super (props);
    this.state = {
      url: "http://127.0.0.1:5000/"
    };
    this.url_selector = this.url_selector.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.url_selector();
  }
  url_selector() {
    // image size: small = 1, medium = 2, large = 3
    if (window.innerWidth < 768) {
      this.setState ({
        url: "http://127.0.0.1:5000/?size=1"
      })
    } else if (window.innerWidth < 1130) {
      this.setState ({
        url: "http://127.0.0.1:5000/?size=2"
      })
    } else {
      this.setState ({
        url: "http://127.0.0.1:5000/?size=3"
      })
    }
  }
  render() {
    return (
      <div>
        <Navigation />
        <About />
        <Services />
        <Safety />
        <Fleet url={this.state.url}/>
        <Contact />
      </div>
    );
  }
}

export default Homepage;
