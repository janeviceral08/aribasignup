import React, { Component } from "react";
import { NativeBaseProvider, Modal, Button } from "native-base";
import firebase from "./firebase";
import cogoToast from "cogo-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import moment from "moment";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class joinRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cname: "",
      email: "",
      city: "",
      mobile: "",
      fb: "",
      loading: false,
    };
  }

  verifyEmail(email) {
    var reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }

  handleChangeText = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit = () => {
    const { email, city, cname, mobile, fb } = this.state;
    if (cname === "") {
      cogoToast.error("Enter your name");
      return;
    }
    if (city === "") {
      cogoToast.error("Enter your city/municipality");
      return;
    }
    if (mobile === "") {
      cogoToast.error("Enter your mobile number");
      return;
    }
    if (!this.verifyEmail(email)) {
      cogoToast.error("Please enter a valid email address.");

      return;
    }
    this.setState({ loading: true });
    const newDocumentID = firebase
      .firestore()
      .collection("AskedtoJoin")
      .doc().id;

    firebase
      .firestore()
      .collection("AskedtoJoin")
      .doc(newDocumentID)
      .set({
        id: newDocumentID,
        email,
        city,
        cname,
        mobile,
        fb,
        typeof: "Restaurant",
        dateSent: moment().unix(),
      })
      .then((sucess) => {
        this.setState({ loading: false, modalVisible: true });
      })
      .catch((error) => {
        cogoToast.error("Failed to sign up");
        this.setState({ loading: false, modalVisible: false });
      });
  };
  render() {
    return (
      <NativeBaseProvider>
        <Modal
          isOpen={this.state.modalVisible}
          onClose={() => console.log("Log")}
        >
          <Modal.Content>
            <Modal.Header>Success!</Modal.Header>
            <Modal.Body>
              Your application has been sent. We will reach out to process your
              application. Thank you!
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  onPress={() => {
                    window.location.replace("/");
                  }}
                >
                  Okay
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <div>
          <header
            id="header"
            class="fixed-top d-flex align-items-center"
          ></header>
          <section id="contact" class="contact">
            <div class="container">
              <div
                class="section-title"
                data-aos="fade-up"
                style={{ marginTop: 60 }}
              >
                <h2>Join My Fast Food/Restaurant/Eatery/Store</h2>
                <p>
                  I’m interested to partner my Fast Food/Restaurant/Eatery/Store
                  using ARIBA gateway portal.
                </p>
              </div>

              <div class="row">
                <div
                  class="col-lg-4"
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <div class="info">
                    <img
                      src="images/Store.png"
                      alt="Image"
                      className="img-fluid"
                    />
                  </div>
                </div>

                <div
                  class="col-lg-8 mt-5 mt-lg-0"
                  data-aos="fade-left"
                  data-aos-delay="200"
                >
                  {this.state.loading === true ? (
                    <ClipLoader
                      color={"#396ba0"}
                      loading={this.state.loading}
                      css={override}
                      size={150}
                    />
                  ) : (
                    <div class="php-email-form">
                      <div class="row">
                        <div class="col-md-6 form-group">
                          <h5>Name:</h5>
                          <input
                            type="text"
                            name="cname"
                            class="form-control"
                            id="cname"
                            placeholder="Your Name"
                            onChange={this.handleChangeText}
                            required
                          />
                        </div>

                        <div class="col-md-6 form-group mt-3 mt-md-0">
                          <h5>City/Municipality:</h5>
                          <input
                            type="text"
                            class="form-control"
                            name="city"
                            id="city"
                            placeholder="Your City/Municipality"
                            onChange={this.handleChangeText}
                            required
                          />
                        </div>
                      </div>
                      <div class="form-group mt-3">
                        <h5>Mobile Number:</h5>
                        <input
                          type="text"
                          class="form-control"
                          name="mobile"
                          id="mobile"
                          placeholder="Mobile Number"
                          onChange={this.handleChangeText}
                          required
                        />
                      </div>
                      <div class="row">
                        <div class="col-md-6 form-group">
                          <h5>Facebook Account:</h5>
                          <input
                            type="text"
                            name="fb"
                            class="form-control"
                            id="fb"
                            placeholder="Your Facebook Account"
                            onChange={this.handleChangeText}
                          />
                        </div>

                        <div class="col-md-6 form-group mt-3 mt-md-0">
                          <h5>Email Address: </h5>
                          <input
                            type="email"
                            class="form-control"
                            name="email"
                            id="email"
                            placeholder="Your Email"
                            onChange={this.handleChangeText}
                            required
                          />
                        </div>
                      </div>

                      <div class="text-center">
                        <button type="submit" onClick={this.onSubmit}>
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </NativeBaseProvider>
    );
  }
}

export default joinRestaurant;
