
import React from "react";
import HomeForm from "../../forms/home-form";


const call_to_action_data = {
    action: "Call To Action",
    title: "Any Project On Your Mind. Let Us Know.",
    phone: "+123 488 9652",
    address: "25 West 21th Street, Miami FL, US",
    email:"info@gencio-itsolutions.com",
    date: "Mon-Fri: 10:00 - 18:0"
}

const {action, title, phone, address, email, date} = call_to_action_data
const Lead_Form = () => {
  return (
    <>
      <div className="it-cta-area mb-50 mt-50">
        <div className="container">
          <div className="tp-border-top pt-50"></div>
          <div className="row">
            <div className="col-lg-6 wow tpfadeUp" data-wow-delay=".3s">
              <div className="it-cta__title">
                <div className="section-title-wraper">
                  <div className="tp-section">
                    <span className="tp-section__subtitle vogue-text-color white-bg mb-15">
                      <i className="before-border"></i>
                       {action}
                    </span>
                    <h2 className="tp-section__title vogue-text-color mb-45">
                      {title}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="it-cta__info">
                <span>
                  <i className="fas fa-phone"></i>
                  <a href={`tel:${phone}`}>{phone}</a>
                </span>
                <span>
                  <i className="fas fa-map-marker-alt"></i>  {address}
                </span>
                <span>
                  <i className="fas fa-envelope-open"></i>
                  <a href={email}>
                     {email}
                  </a>
                </span>
                <span>
                  <i className="fas fa-clock"></i> {date}
                </span>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="it-cta-form wow tpfadeUp" data-wow-delay=".4s">
                <HomeForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lead_Form;
