import './Footer.css';

const Footer = () => {
  return (
    <div className="main-footer">
      <div className="container">
        <div className="row" style={{ justifyContent: 'center' }}>
          {/* column 1 */}
          <div className="col-md-3 col-sm-6">
            <h4>footer 1 is here</h4>
            <ul className="list-unstyled">
              <li>footer 1</li>
              <li>footer 2</li>
            </ul>
          </div>
          {/* column 2 */}
          <div className="col-md-3 col-sm-6">
            <h4>footer 2 is here</h4>
            <ul className="list-unstyled">
              <li>footer 1</li>
              <li>footer 2</li>
            </ul>
          </div>
        </div>
        {/* Footer Bottom */}
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="col-md-3 col-sm-6">
            <p className="text-xs-center">this is the footer bottom</p>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="col-md-3">
            <a href="https://www.flaticon.com/free-icons/shipwreck" title="shipwreck icons" style={{ textDecoration: 'none', fontSize: '.75em' }}>Shipwreck icons created by Eucalyp - Flaticon</a>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Footer;