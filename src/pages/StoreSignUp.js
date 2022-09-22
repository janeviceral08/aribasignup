import React, { Component } from "react";

import {
  FcShop,
  FcLock,
  FcManager,
  FcTabletAndroid,
  FcFeedback,
  FcGlobe,
  FcGallery,
} from "react-icons/fc";
import { GoEyeClosed, GoEye } from "react-icons/go";
import {
  Input,
  Icon,
  NativeBaseProvider,
  FlatList,
  Box,
  TextArea,
  HStack,
  Text,
  Pressable,
  Modal,
  Button,
  Checkbox,
  Heading,
} from "native-base";
import axios from "axios";
import Select from "react-select";
import firebase from "./firebase";
import cogoToast from "cogo-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import ReactMapGL, { Marker } from "react-map-gl";
import "./Map.css";
import Pin from "./pin";

function getCursor({ isHovering, isDragging }) {
  return isDragging ? "grabbing" : isHovering ? "pointer" : "default";
}

const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10,
};
const positionOptions = { enableHighAccuracy: true };
const options = [
  { value: "Drivers License", label: "Drivers License" },
  { value: "Passport", label: "Passport" },
  { value: "Voters ID", label: "Voters ID" },
  { value: "Passport", label: "Passport" },
  { value: "NBI", label: "NBI" },
  { value: "Police Clearance", label: "Police Clearance" },
];
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;
const OptionRate = [
  { value: "Municipal Rate", label: "Municipal Rate" },
  { value: "City Rate", label: "City Rate" },
  { value: "Metro City Rate", label: "Metro City Rate" },
];

class StoreSignUp extends Component {
  constructor(props) {
    super(props);
    this.onDataChange = this.onDataChange.bind(this);
    this.state = {
      current: 0,
      selectedOption: null,
      inputFile: null,
      Email: "",
      DAddress: "",
      Province: "",
      Operator: "",
      Mobile: "",
      Name: "",
      CPassword: "",
      Password: "",
      AvailableOn: [],
      datasFlatlist: [],
      selectedCountry: null,
      selectedCity: null,
      SelectedRate: null,
      modalVisible: false,
      newCity: "",
      downloadLink: "",
      loading: false,
      storeRadio: false,
      CpasswordV: false,
      passwordV: false,
      latitude: 8.951549,
      longitude: 125.527725,
      showList: false,
      setViewport: {
        latitude: 8.951549,
        longitude: 125.527725,
        width: "100vw",
        height: "100vh",
        zoom: 15,
        bearing: 0,
        pitch: 0,
      },
      acceptedTerms: false,
      TermsAndCondition: true,
      res_data: [],
      phone: "",
      markup: false,
      selectedCity: { value: null },
      SubCat: "",
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const { lng, lat, zoom } = this.state;
    navigator.geolocation.getCurrentPosition((position) =>
      this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,

        setViewport: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          width: "100vw",
          height: "100vh",
          zoom: 15,
          bearing: 0,
          pitch: 0,
        },
      })
    );
    /*const map = new mapboxgl.Map({
container: this.mapContainer.current,
style: 'mapbox://styles/mapbox/streets-v11',
center: [lng, lat],
zoom: zoom
});*/
    this.unsubscribe = firebase
      .firestore()
      .collection("charges")
      .where("ProcessingStatus", "==", "Approved")
      .onSnapshot(this.onDataChange);
    firebase
      .firestore()
      .collection("categories")
      .where("charge", "==", 0)
      .onSnapshot((items) => {
        let city = [];

        items.forEach((item) => {
          let id = item.id;
          let data = item.data();
          city.push({
            label: item.data().title,
            value: item.data().title,
            SubCat: item.data().SubCat,
          });
        });
        this.setState({
          city: city,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onDataChange(items) {
    let AvailableOn = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      AvailableOn.push({
        label: item.data().email,
        value: item.data().email,
        name: item.data().Country,
        Country: item.data().Country,
        code: item.data().code,
        id: item.data().id,
        typeOfRate: item.data().typeOfRate,
        province: item.data().province,
        city: item.data().city,
        arrayofCity: item.data().arrayofCity,
      });
    });
    this.setState({
      AvailableOn: AvailableOn,
      loading: false,
    });
  }

  handleChangeRate = (SelectedRate) => {
    this.setState({ SelectedRate });
  };
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };

  handleChangeselectedCountry = (selectedCountry) => {
    firebase
      .firestore()
      .collection("LinkApp")
      .where("country", "==", selectedCountry.Country)
      .onSnapshot((items) => {
        items.forEach((item) => {
          let id = item.id;
          let data = item.data();
          this.setState({ downloadLink: item.data().Store });
        });
      });

    this.setState({ selectedCountry, selectedCity: null });
  };

  handleChangeselectedCity = (selectedCity) => {
    this.setState({ selectedCity });
  };

  NextPage = () => {
    if (this.state.current < 3) {
      this.setState({
        current: this.state.current + 1,
      });
      return;
    } else {
      return;
    }
  };

  PrevPage = () => {
    if (this.state.current > 0) {
      this.setState({
        current: this.state.current - 1,
      });
      return;
    } else {
      return;
    }
  };

  onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };
  updateTextInputSearchPlace = (text) => {
    this.setState({ SearchPlace: text, showList: true });
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=sk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxNW5iODBoa2kzMXBnMGRjNXRwNHUifQ.KefOQn1CBBNu-qw1DhPblA&country=${this.state.selectedCountry.code.toLowerCase()}`
      )
      .then((res) => {
        let str = res.data.features[0].place_name;

        let arr = str.split(",");


        this.setState({ datasFlatlist: res.data.features });
      })
      .catch((err) => {
      });
  };
  verifyEmail(email) {
    var reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }
  onSubmit = () => {
    cogoToast.success("Please wait a moment...");
    // const {  title  } = this.state;
    const { files } = document.querySelector("#uploaded");
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "bgzuxcoc");
    const options = {
      method: "POST",
      body: formData,
    };
    const {
      Email,
      Province,
      Operator,
      Mobile,
      Name,
      CPassword,
      newCity,
      Password,
      selectedCountry,
      selectedCity,
      selectedOption,
      SelectedRate,
      detailedAddress,
      storeRadio,
      phone,
      uploadedPhoto,
    } = this.state;

    if (files[0] === undefined) {
      cogoToast.error("Upload Valid Id.");
      return;
    }
    if (selectedCountry === null) {
      cogoToast.error("Select Operator.");
      return;
    }
    if (uploadedPhoto === undefined) {
      cogoToast.error("Upload your Photo.");
      return;
    }
    if (
      Email === "" ||
      detailedAddress === "" ||
      storeRadio === "" ||
      Operator === "" ||
      Mobile === "" ||
      Name === "" ||
      selectedCity === null
    ) {
      cogoToast.error("Please fill all fields.");
      return;
    }
    if (!this.verifyEmail(Email)) {
      cogoToast.error("Please enter a valid email address.");

      return;
    }
    if (!Password.length > 7) {
      cogoToast.error("Weak Password.");
      this.setState({
        hasError: true,
        errorText: "Weak Password",
        loading: false,
      });
      return;
    }
    if (Password != CPassword) {
      cogoToast.error("Password not matched.");
      return;
    }
    this.setState({ loading: true });
    fetch("https://api.cloudinary.com/v1_1/kusinahanglan/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        const newRes = res.secure_url;
        firebase
          .auth()
          .createUserWithEmailAndPassword(Email, Password)
          .then((authUser) => {

            firebase
              .firestore()
              .collection("charges")
              .doc(this.state.selectedCountry.id)
              .update({
                storeCount: firebase.firestore.FieldValue.increment(1),
              });
            const dataValue = {
              markup: this.state.markup,
              nameSearch: this.state.Operator.toLocaleLowerCase(),
              Namekeywords: this.state.Operator.split(" "),
              phone: Mobile,
              userTransactionCancelled: 0,
              Transactionprocessing: 0,
              TransactionPending: 0,
              TransactionCancelled: 0,
              TransactionCompleted: 0,
              CountryWikiData:
                this.state.res_data.length > 0
                  ? this.state.res_data[this.state.res_data.length - 1].wikidata
                  : "",
              CityWikiData:
                this.state.res_data.length > 0
                  ? this.state.res_data[this.state.res_data.length - 2].wikidata
                  : "",
              Password: Password,
              IdOrPermit: newRes,
              storeRadio: storeRadio,
              Account: "Food Delivery",
              storeOwner: Name,
              code: this.state.selectedCountry.code,
              Country: this.state.selectedCountry.Country,
              ProcessingStatus: "New",
              slatitude: this.state.latitude,
              slongitude: this.state.longitude,
              name: this.state.Operator,
              email: this.state.Email,
              id: authUser.user.uid,
              status: true,
              address: this.state.detailedAddress,
              city: this.state.selectedCountry.city,
              province: this.state.selectedCountry.province,
              cluster: this.state.Email,
              foreground: "",
              arrange: 0,
              admin_control: true,
              keywords: [this.state.Operator],
              notification_token: "",
              labor_charge: parseFloat(0) / 100,
              section: this.state.selectedCity.value,
              SubCat: this.state.SubCat,
              subcategory: [
                {
                  key: "None",
                  title: "All",
                },
              ],
              wallet: parseFloat(0),
              AlwaysOpen: true,
              withAddons: true,
              startDate: null,
              endDate: null,
              adminID: this.state.selectedCountry.id,
              arrayofCity: this.state.selectedCountry.arrayofCity,
              star1: 0,
              star2: 0,
              start3: 0,
              star4: 0,
              start5: 0,
              NumberofDeliveries: 0,
              image: uploadedPhoto,
            };
            firebase
              .firestore()
              .collection("stores")
              .doc(authUser.user.uid)
              .set(dataValue);
          })
          .then((sucess) => {
            cogoToast.success("Sucessfully Logged In");
            this.setState({ loading: false, modalVisible: true });
          })
          .catch((error) => {
            cogoToast.error("Failed to sign up");
            this.setState({ loading: false, modalVisible: false });
          });
      })
      .catch((error) => {
        cogoToast.error("Failed to upload Valid I.D image");
        this.setState({ loading: false, modalVisible: false });
      });

    //	event.preventDefault();
  };

  onSubmituploadedPhoto = () => {
    const { files } = document.querySelector("#uploadedPhoto");
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "bgzuxcoc");
    const options = {
      method: "POST",
      body: formData,
    };
    if (files[0] === undefined) {
      cogoToast.error("Upload Certificate of Registration.");
      return;
    }
    this.setState({ uploadedPhotoUploading: "uploading" });

    fetch("https://api.cloudinary.com/v1_1/kusinahanglan/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        const newRes = res.secure_url;

        this.setState({
          uploadedPhotoUploading: "Done",
          uploadedPhoto: res.secure_url,
        });
      })
      .catch((error) => {
        cogoToast.error("Failed to upload Certificate of Registration");
        this.setState({ uploadedPhotoUploading: "Try Again" });
      });
  };

  render() {
    return (
      <NativeBaseProvider>
        <Modal
          isOpen={this.state.modalVisible}
          onClose={() => console.log("Log")}
          //initialFocusRef={initialRef}
          //finalFocusRef={finalRef}
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Sign Up Success!</Modal.Header>
            <Modal.Body>
              Congratulations! You can download the App now
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  onPress={() => {
                    window.location.replace(this.state.downloadLink);
                    // this.props.history.push(`${this.state.downloadLink}`)
                  }}
                >
                  Download Now
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Modal
          isOpen={this.state.TermsAndCondition}
          onClose={() => console.log("Log")}
          style={{ marginTop: window.innerHeight/7 }}
        >
          <Modal.Content style={{ marginBottom: "auto", marginTop: 0 }}>
            <Modal.Header>Terms and Conditions</Modal.Header>
            <Modal.Body>
              <Heading> Terms and Conditions </Heading>
              <Text mt="3" fontWeight="medium">
                Please read these terms and conditions ("terms and conditions",
                "terms") carefully before using [website] website (“website”,
                "service") operated by [name] ("us", 'we", "our").
              </Text>

              <Text bold>Conditions of use</Text>

              <Text>
                By using this website, you certify that you have read and
                reviewed this Agreement and that you agree to comply with its
                terms. If you do not want to be bound by the terms of this
                Agreement, you are advised to leave the website accordingly.
                [name] only grants use and access of this website, its products,
                and its services to those who have accepted its terms.
              </Text>

              <Text bold>Privacy policy</Text>

              <Text>
                Before you continue using our website, we advise you to read our
                privacy policy [link to privacy policy] regarding our user data
                collection. It will help you better understand our practices.
              </Text>

              <Text bold>Age restriction</Text>

              <Text>
                You must be at least 18 (eighteen) years of age before you can
                use this website. By using this website, you warrant that you
                are at least 18 years of age and you may legally adhere to this
                Agreement. [name] assumes no responsibility for liabilities
                related to age misrepresentation.
              </Text>

              <Text bold>Intellectual property</Text>

              <Text>
                You agree that all materials, products, and services provided on
                this website are the property of [name], its affiliates,
                directors, officers, employees, agents, suppliers, or licensors
                including all copyrights, trade secrets, trademarks, patents,
                and other intellectual property. You also agree that you will
                not reproduce or redistribute the [name]’s intellectual property
                in any way, including electronic, digital, or new trademark
                registrations. You grant [name] a royalty-free and non-exclusive
                license to display, use, copy, transmit, and broadcast the
                content you upload and publish. For issues regarding
                intellectual property claims, you should contact the company in
                order to come to an agreement.
              </Text>

              <Text bold>User accounts</Text>

              <Text>
                As a user of this website, you may be asked to register with us
                and provide private information. You are responsible for
                ensuring the accuracy of this information, and you are
                responsible for maintaining the safety and security of your
                identifying information. You are also responsible for all
                activities that occur under your account or password. If you
                think there are any possible issues regarding the security of
                your account on the website, inform us immediately so we may
                address them accordingly. We reserve all rights to terminate
                accounts, edit or remove content and cancel orders at our sole
                discretion.
              </Text>

              <Text bold>Applicable law</Text>

              <Text>
                By visiting this website, you agree that the laws of the
                [location], without regard to principles of conflict laws, will
                govern these terms and conditions, or any dispute of any sort
                that might come between [name] and you, or its business partners
                and associates.
              </Text>

              <Text bold>Disputes</Text>

              <Text>
                Any dispute related in any way to your visit to this website or
                to products you purchase from us shall be arbitrated by state or
                federal court [location] and you consent to exclusive
                jurisdiction and venue of such courts.
              </Text>

              <Text bold>Indemnification</Text>

              <Text>
                You agree to indemnify [name] and its affiliates and hold [name]
                harmless against legal claims and demands that may arise from
                your use or misuse of our services. We reserve the right to
                select our own legal counsel.
              </Text>

              <Text bold>Limitation on liability</Text>

              <Text>
                [name] is not liable for any damages that may occur to you as a
                result of your misuse of our website. [name] reserves the right
                to edit, modify, and change this Agreement at any time. We shall
                let our users know of these changes through electronic mail.
                This Agreement is an understanding between [name] and the user,
                and this supersedes and replaces all prior agreements regarding
                the use of this website.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <HStack space={2}>
                <Checkbox
                  value="test"
                  size="sm"
                  onChange={() =>
                    this.setState({ acceptedTerms: !this.state.acceptedTerms })
                  }
                  value={this.state.acceptedTerms}
                >
                  {" "}
                  <Text style={{ fontSize: 10, marginTop: 5 }}>
                    I agree to the terms and condition
                  </Text>
                </Checkbox>
                <Button
                  isDisabled={!this.state.acceptedTerms}
                  onPress={() => {
                    if (this.state.acceptedTerms === false) {
                      cogoToast.error("Check the checkbox to proceed");
                    } else {
                      this.setState({ TermsAndCondition: false });
                    }
                  }}
                >
                  Accept & Continue
                </Button>
              </HStack>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <div>
          <header
            id="header"
            class="fixed-top d-flex align-items-center"
          ></header>

          <div className="content">
            <div className="container">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src="images/Store.png"
                    alt="Image"
                    className="img-fluid"
                  />
                  <p>&nbsp;</p>
                  <h1>
                    <b>Store Sign Up</b>
                  </h1>
                  <p className="mb-4">
                    Lorem ipsum dolor sit amet elit. Sapiente sit aut eos
                    consectetur adipisicing.
                  </p>
                </div>
                <div className="col-md-8 contents">
                  <div className="row justify-content-center">
                    <div className="col-md-11">
                      <div className="mb-4">
                        {this.state.current === 0 ? (
                          <div className="md-stepper-horizontal orange">
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FcManager />
                              </div>
                              <div className="md-step-title">Account</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step">
                              <div className="md-step-circle">
                                <FcShop />
                              </div>
                              <div className="md-step-title">Store</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step">
                              <div className="md-step-circle">
                                <FcGallery />
                              </div>
                              <div className="md-step-title">Attachments</div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                          </div>
                        ) : this.state.current === 1 ? (
                          <div className="md-stepper-horizontal orange">
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FcManager />
                              </div>
                              <div className="md-step-title">Account</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FcShop />
                              </div>
                              <div className="md-step-title">Store</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>

                            <div className="md-step">
                              <div className="md-step-circle">
                                <FcGallery />
                              </div>
                              <div className="md-step-title">Attachments</div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="md-stepper-horizontal orange">
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FcManager />
                              </div>
                              <div className="md-step-title">Account</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FcShop />
                              </div>
                              <div className="md-step-title">Store</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>

                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FcGallery />
                              </div>
                              <div className="md-step-title">Attachments</div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        {this.state.loading === true ? (
                          <ClipLoader
                            color={"#396ba0"}
                            loading={this.state.loading}
                            css={override}
                            size={150}
                          />
                        ) : (
                          <div
                            style={{
                              display:
                                this.state.current === 0 ? "block" : "none",
                            }}
                          >
                            <div className="form-group first">
                              <input
                                type="radio"
                                onChange={() =>
                                  this.setState({ storeRadio: true })
                                }
                                checked={
                                  this.state.storeRadio === true ? true : false
                                }
                              />{" "}
                              Have Physical Store
                              <p></p>
                              <input
                                type="radio"
                                value="Doesn't"
                                name="gender"
                                onChange={() =>
                                  this.setState({ storeRadio: false })
                                }
                                checked={
                                  this.state.storeRadio === false ? true : false
                                }
                              />{" "}
                              Doesn't Have Physical Store
                            </div>

                            <div className="first">
                              <Select
                                value={this.state.selectedCountry}
                                placeholder={"Search Operator Email"}
                                onChange={this.handleChangeselectedCountry}
                                options={this.state.AvailableOn}
                                style={{ width: "80%" }}
                              />
                            </div>
                            <div className="form-group first">
                              <Input
                                w={{
                                  base: "100%",
                                  md: "100%",
                                }}
                                InputLeftElement={
                                  <Icon
                                    as={
                                      <FcFeedback
                                        style={{
                                          marginLeft: "10",
                                          fontSize: 18,
                                        }}
                                      />
                                    }
                                    color="black"
                                  />
                                }
                                style={{ marginLeft: "20", fontSize: 18 }}
                                placeholder="Email"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "Email")
                                }
                                value={this.state.Email}
                              />
                            </div>
                            <div className="form-group first">
                              <Input
                                w={{
                                  base: "100%",
                                  md: "100%",
                                }}
                                InputLeftElement={
                                  <Icon
                                    as={
                                      <FcManager
                                        style={{
                                          marginLeft: "10",
                                          fontSize: 18,
                                        }}
                                      />
                                    }
                                    color="black"
                                  />
                                }
                                style={{ marginLeft: "20", fontSize: 18 }}
                                placeholder="Complete Name"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "Name")
                                }
                                value={this.state.Name}
                              />
                            </div>
                            <div className="form-group first">
                              <Input
                                w={{
                                  base: "100%",
                                  md: "100%",
                                }}
                                InputLeftElement={
                                  <Icon
                                    as={
                                      <FcTabletAndroid
                                        style={{
                                          marginLeft: "10",
                                          fontSize: 18,
                                        }}
                                      />
                                    }
                                    color="black"
                                  />
                                }
                                style={{ marginLeft: "20", fontSize: 18 }}
                                placeholder="Mobile Number"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "Mobile")
                                }
                                value={this.state.Mobile}
                              />
                            </div>
                            <div className="form-group first">
                              <Input
                                w={{
                                  base: "100%",
                                  md: "100%",
                                }}
                                InputLeftElement={
                                  <Icon
                                    as={
                                      <FcLock
                                        style={{
                                          marginLeft: "10",
                                          fontSize: 18,
                                        }}
                                      />
                                    }
                                    color="black"
                                  />
                                }
                                type={
                                  this.state.passwordV ? "text" : "password"
                                }
                                InputRightElement={
                                  <Icon
                                    as={
                                      this.state.passwordV === true ? (
                                        <GoEye
                                          style={{
                                            marginLeft: "10",
                                            fontSize: 18,
                                          }}
                                          onClick={() =>
                                            this.setState({ passwordV: false })
                                          }
                                        />
                                      ) : (
                                        <GoEyeClosed
                                          style={{
                                            marginLeft: "10",
                                            fontSize: 18,
                                          }}
                                          onClick={() =>
                                            this.setState({ passwordV: true })
                                          }
                                        />
                                      )
                                    }
                                    color="black"
                                  />
                                }
                                style={{ marginLeft: "20", fontSize: 18 }}
                                placeholder="Password"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "Password")
                                }
                                value={this.state.Password}
                              />
                            </div>
                            <div className="form-group first">
                              <Input
                                w={{
                                  base: "100%",
                                  md: "100%",
                                }}
                                InputLeftElement={
                                  <Icon
                                    as={
                                      <FcLock
                                        style={{
                                          marginLeft: "10",
                                          fontSize: 18,
                                        }}
                                      />
                                    }
                                    color="black"
                                  />
                                }
                                type={
                                  this.state.CpasswordV ? "text" : "password"
                                }
                                InputRightElement={
                                  <Icon
                                    as={
                                      this.state.CpasswordV === true ? (
                                        <GoEye
                                          style={{
                                            marginLeft: "10",
                                            fontSize: 18,
                                          }}
                                          onClick={() =>
                                            this.setState({ CpasswordV: false })
                                          }
                                        />
                                      ) : (
                                        <GoEyeClosed
                                          style={{
                                            marginLeft: "10",
                                            fontSize: 18,
                                          }}
                                          onClick={() =>
                                            this.setState({ CpasswordV: true })
                                          }
                                        />
                                      )
                                    }
                                    color="black"
                                  />
                                }
                                style={{ marginLeft: "20", fontSize: 18 }}
                                placeholder="Confirm Password"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "CPassword")
                                }
                                value={this.state.CPassword}
                              />
                            </div>
                          </div>
                        )}
                        <div
                          style={{
                            display: this.state.current === 1 ? "block" : "none",
                          }}
                        >
                          <div className="form-group first">
                            <p style={{ color: "black", fontSize: 15 }}>
                              <b>Store Location</b>
                            </p>

                            <Input
                              w={{
                                base: "100%",
                                md: "100%",
                              }}
                              InputLeftElement={
                                <Icon
                                  as={
                                    <FcGlobe
                                      style={{ marginLeft: "10", fontSize: 18 }}
                                    />
                                  }
                                  color="black"
                                />
                              }
                              style={{ marginLeft: "20", fontSize: 18 }}
                              placeholder="Search Location"
                              onChangeText={(itemValue) =>
                                this.updateTextInputSearchPlace(itemValue)
                              }
                              value={this.state.SearchPlace}
                            />
                            {this.state.showList === true ? (
                              <FlatList
                                data={this.state.datasFlatlist}
                                renderItem={({ item }) => (
                                  <Pressable
                                    onPress={() => {
                                      this.setState({
                                        res_data: item.context,
                                        latitude: item.center[1],
                                        longitude: item.center[0],
                                        showList: false,
                                        SearchPlace: item.place_name,
                                        detailedAddress: item.place_name,
                                      });
                                    }}
                                  >
                                    <Box
                                      borderBottomWidth="1"
                                      _dark={{
                                        borderColor: "gray.600",
                                      }}
                                      borderColor="coolGray.200"
                                      pl="4"
                                      pr="5"
                                      py="2"
                                    >
                                      <Text
                                        _dark={{
                                          color: "warmGray.50",
                                        }}
                                        color="coolGray.800"
                                        bold
                                      >
                                        {item.place_name}
                                      </Text>
                                      <Text
                                        color="coolGray.600"
                                        _dark={{
                                          color: "warmGray.200",
                                        }}
                                      >
                                        {item.text}
                                      </Text>
                                    </Box>
                                  </Pressable>
                                )}
                                keyExtractor={(item) => item.id}
                              />
                            ) : null}

                            <ReactMapGL
                              {...this.state.setViewport}
                              mapStyle={"mapbox://styles/mapbox/streets-v9"}
                              mapboxApiAccessToken={
                                "pk.eyJ1IjoiY3l6b294IiwiYSI6ImNrdmFxMWJpdTAxYW0yd242djhtcjc1YzIifQ.BTxkDRhc30SwUShSfw1ILw"
                              }
                              onViewportChange={(viewport) =>
                                this.setState({ setViewport: viewport })
                              }
                              width="100%"
                              height="400px"
                              attributionControl={false}
                              getCursor={getCursor}
                            >
                              <Marker
                                longitude={this.state.longitude}
                                latitude={this.state.latitude}
                                draggable
                                onDragEnd={(info) =>
                                  this.setState({
                                    latitude: info.lngLat[1],
                                    longitude: info.lngLat[0],
                                  })
                                }
                              >
                                <Pin size={50} />
                              </Marker>
                            </ReactMapGL>
                          </div>
                          <div className="form-group first">
                            <TextArea
                              w={{
                                base: "100%",
                                md: "100%",
                              }}
                              InputLeftElement={
                                <Icon
                                  as={
                                    <FcGlobe
                                      style={{ marginLeft: "10", fontSize: 18 }}
                                    />
                                  }
                                  color="black"
                                />
                              }
                              style={{ marginLeft: "20", fontSize: 18 }}
                              placeholder="Detailed Location"
                              onChangeText={(itemValue) =>
                                this.updateTextInput(
                                  itemValue,
                                  "detailedAddress"
                                )
                              }
                              value={this.state.detailedAddress}
                            />
                          </div>
                          <div className="form-group first">
                            <Input
                              w={{
                                base: "100%",
                                md: "100%",
                              }}
                              InputLeftElement={
                                <Icon
                                  as={
                                    <FcShop
                                      style={{ marginLeft: "10", fontSize: 18 }}
                                    />
                                  }
                                  color="black"
                                />
                              }
                              style={{ marginLeft: "20", fontSize: 18 }}
                              placeholder="Store Name"
                              onChangeText={(itemValue) =>
                                this.updateTextInput(itemValue, "Operator")
                              }
                              value={this.state.Operator}
                            />
                          </div>
                          <div className="first">
                            <Select
                              placeholder={"Select Category"}
                              value={this.state.selectedCity}
                              onChange={this.handleChangeselectedCity}
                              options={this.state.city}
                            />
                          </div>
                          
                          {this.state.selectedCity === null ? null : this.state
                              .selectedCity.value === "Fastfood" ? (
                            <div className="form-group first">
                              <input
                                type="radio"
                                onChange={() => this.setState({ markup: true })}
                                checked={this.state.markup}
                              />{" "}
                              Markup
                              <p></p>
                              <input
                                type="radio"
                                onChange={() =>
                                  this.setState({ markup: false })
                                }
                                checked={this.state.markup}
                              />
                              No Markup
                            </div>
                          ) : this.state.selectedCity.value ===
                            "General Merchandise" ? (
                            <div className="form-group first">
                              {this.state.selectedCity.SubCat.map(
                                (item, index) => (
                                  <div>
                                    <input
                                      type="radio"
                                      onChange={() =>
                                        this.setState({ SubCat: item.value })
                                      }
                                      checked={
                                        item.value === this.state.SubCat
                                          ? true
                                          : false
                                      }
                                    />{" "}
                                    {item.value}
                                    <p></p>
                                  </div>
                                )
                              )}
                            </div>
                          ) : //SubCat
                          null}
                        </div>
                        <div
                          style={{
                            display: this.state.current === 2 ? "block" : "none",
                          }}
                        >
                          {this.state.storeRadio === true ? (
                            <div className="form-group first">
                              <p style={{ color: "black", fontSize: 15 }}>
                                <b>Upload Business Permit</b>
                              </p>
                              <img
                                src={
                                  this.state.image === undefined
                                    ? "images/business-license.png"
                                    : this.state.image
                                }
                                alt="Image"
                                className="img-fluid"
                              />
                              <input
                                type="file"
                                id="uploaded"
                                onChange={this.onImageChange}
                              />
                            </div>
                          ) : (
                            <div className="form-group first">
                              <p style={{ color: "black", fontSize: 15 }}>
                                <b>Upload Valid I.d</b>
                              </p>
                              <img
                                src={
                                  this.state.image === undefined
                                    ? "images/id.png"
                                    : this.state.image
                                }
                                alt="Image"
                                className="img-fluid"
                              />
                              <input
                                type="file"
                                id="uploaded"
                                onChange={this.onImageChange}
                              />
                            </div>
                          )}

                          <div className="form-group first">
                            <p style={{ color: "black", fontSize: 15 }}>
                              <b>Upload Your Photo</b>
                            </p>
                            <input type="file" id="uploadedPhoto" />
                           
                            {this.state.uploadedPhotoUploading === "" ||
                            this.state.uploadedPhotoUploading === undefined ? (
                              <button
                                className="btn btn-block btn-primary col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                                onClick={this.onSubmituploadedPhoto}
                              >
                                Upload
                              </button>
                            ) : this.state.uploadedPhotoUploading ===
                              "uploading" ? (
                              <button
                                className="btn btn-block btn-warning col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                              >
                                Uploading..
                              </button>
                            ) : this.state.uploadedPhotoUploading === "Done" ? (
                              <button
                                className="btn btn-block btn-success col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                              >
                                Completed
                              </button>
                            ) : (
                              <button
                                className="btn btn-block btn-danger col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                                onClick={this.onSubmituploadedPhoto}
                              >
                                Try Again
                              </button>
                            )}{" "}
                          </div>
                        </div>

                        <div className="d-flex mb-5 align-items-center"></div>
                        {this.state.loading === true ? (
                          <button className="btn btn-block btn-primary">
                            Please Wait
                          </button>
                        ) : this.state.current === 0 ? (
                          <button
                            className="btn btn-block btn-primary"
                            onClick={this.NextPage}
                          >
                            Next
                          </button>
                        ) : this.state.current === 1 ? (
                          <div className="container">
                            <div className="row">
                              <button
                                className="btn btn-block btn-primary col-lg-5"
                                style={{ marginRight: "7%" }}
                                onClick={this.PrevPage}
                              >
                                Prev
                              </button>
                              <button
                                className="btn btn-block btn-primary col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                                onClick={this.NextPage}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="container">
                            <div className="row">
                              <button
                                className="btn btn-block btn-primary col-lg-5"
                                style={{ marginRight: "7%" }}
                                onClick={this.PrevPage}
                              >
                                Prev
                              </button>
                              <button
                                className="btn btn-block btn-primary col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                                onClick={this.onSubmit}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </NativeBaseProvider>
    );
  }
}

export default StoreSignUp;
