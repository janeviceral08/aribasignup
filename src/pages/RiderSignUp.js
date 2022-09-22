import React, { Component } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaUserCog,
  FaMobileAlt,
  FaGlobeAsia,
  FaHome,
  FaUserAlt,
  FaRegAddressCard,
  FaIdCard,
} from "react-icons/fa";
import { GoEyeClosed, GoEye } from "react-icons/go";
import {
  Input,
  Icon,
  NativeBaseProvider,
  HStack,
  Text,
  Modal,
  Button,
  Checkbox,
  Heading,
} from "native-base";
import Select from "react-select";
import firebase from "./firebase";
import cogoToast from "cogo-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

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
class RiderSignUp extends Component {
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
      selectedCountry: null,
      downloadLink: "",
      modalVisible: false,
      selectedCity: null,
      SelectedRate: null,
      newCity: "",
      loading: false,
      CpasswordV: false,
      passwordV: false,
      acceptedTerms: false,
      TermsAndCondition: true,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.unsubscribe = firebase
      .firestore()
      .collection("AvailableOn")
      .where("status", "==", true)
      .orderBy("label", "asc")
      .onSnapshot(this.onDataChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onDataChange(items) {
    let AvailableOn = [];

    items.forEach((item) => {
      let id = item.id;
      let data = item.data();
      AvailableOn.push(item.data());
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
    const collect =
      selectedCountry.label === "Philippines"
        ? "city"
        : selectedCountry.label + ".city";
    firebase
      .firestore()
      .collection(collect)
      .where("country", "==", selectedCountry.label)
      .onSnapshot((items) => {
        //let city = [{value: 'NEW CITY', label: 'NEW CITY', country:selectedCountry.label }];
        let city = [];
        items.forEach((item) => {
          if (item.data().activeReg == true) {
            let id = item.id;
            let data = item.data();
            city.push(item.data());
          }
        });
        this.setState({
          city: city,
        });
      });
    firebase
      .firestore()
      .collection("LinkApp")
      .where("country", "==", selectedCountry.label)
      .onSnapshot((items) => {
        items.forEach((item) => {
          let id = item.id;
          let data = item.data();
          this.setState({ downloadLink: item.data().Operator });
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

  onImageChangePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ imagePhoto: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };

  verifyEmail(email) {
    var reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }
  onSubmit = () => {
    cogoToast.success("Please wait a moment...");
    // const {  title  } = this.state;
    this.setState({ modalVisible: false });
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
      DAddress,
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
      uploadedPhoto,
    } = this.state;

    if (files[0] === undefined) {
      cogoToast.error("Upload Valid Id.");
      return;
    }
    if (selectedOption === null) {
      cogoToast.error("Select valid I.D .");
      return;
    }
    if (uploadedPhoto === undefined) {
      cogoToast.error("Upload your Photo.");
      return;
    }
    if (
      Email === "" ||
      DAddress === "" ||
      Province === "" ||
      Operator === "" ||
      Mobile === "" ||
      Name === "" ||
      selectedCountry === null ||
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
            if (newCity != "") {
              const collect =
                selectedCountry.value === "Philippines"
                  ? "city"
                  : selectedCountry.value + ".city";
              firebase
                .firestore()
                .collection(collect)
                .doc(this.state.newCity)
                .set({
                  label: this.state.newCity,
                  value: this.state.newCity,
                  adminID: authUser.user.uid,
                  typeOfRate: SelectedRate.value,
                });
              firebase
                .firestore()
                .collection("carousel")
                .doc(this.state.newCity)
                .set({ city: this.state.newCity, images: ["AddImage"] });
              firebase
                .firestore()
                .collection("admin_token")
                .doc(this.state.newCity)
                .set({ tokens: [] });
            }
            const datavalue = {
              IDimg: newRes,
              code: selectedCountry.code,
              Country: selectedCountry.value,
              arrayofCity: selectedCity.arrayofCity,
              adminlatitude: 14.599512,
              adminlongitude: 120.984222,
              AccountName: Name,
              name: Operator,
              Mobile: Mobile,
              email: Email.toLowerCase(),
              id: authUser.user.uid,
              status: "process",
              ProcessingStatus: "New",
              address: DAddress,
              city: newCity != "" ? newCity : selectedCity.value,
              province: Province,
              cluster: newCity != "" ? newCity : selectedCity.typeOfRate,
              AdminWallet: 0,
              SuperAdminRiderCommision: 0.035,
              SuperAdminStoreCommision: 0.035,
              amount_base: 20,
              base_dist: 3,
              del_charge: 25,
              driverCharge: 0.02,
              extra_charge: 55,
              labor_charge: 0.015,
              pickup_charge: 9,
              rider_commision: 0.015,
              succeding: 15,
              typeOfRate:
                SelectedRate === null
                  ? selectedCity.typeOfRate
                  : SelectedRate.value,
              mobile: "",
              fb_Help: "",
              email_help: "",
              mobile_help: "",
              Telephone_Help: "",
              image: uploadedPhoto,
            };
            firebase
              .firestore()
              .collection("charges")
              .doc(authUser.user.uid)
              .set({
                IDimg: newRes,
                code: selectedCountry.code,
                Country: selectedCountry.value,
                arrayofCity: selectedCity.arrayofCity,
                adminlatitude: 14.599512,
                adminlongitude: 120.984222,
                AccountName: Name,
                name: Operator,
                Mobile: Mobile,
                email: Email.toLowerCase(),
                id: authUser.user.uid,
                status: "process",
                ProcessingStatus: "New",
                address: DAddress,
                city: newCity != "" ? newCity : selectedCity.value,
                province: Province,
                cluster: newCity != "" ? newCity : selectedCity.typeOfRate,
                AdminWallet: 0,
                SuperAdminRiderCommision: 0.035,
                SuperAdminStoreCommision: 0.035,
                amount_base: 20,
                base_dist: 3,
                del_charge: 25,
                driverCharge: 0.02,
                extra_charge: 55,
                labor_charge: 0.015,
                pickup_charge: 9,
                rider_commision: 0.015,
                succeding: 15,
                typeOfRate:
                  SelectedRate === null
                    ? selectedCity.typeOfRate
                    : SelectedRate.value,
                mobile: "",
                fb_Help: "",
                email_help: "",
                mobile_help: "",
                Telephone_Help: "",
                image: uploadedPhoto,
              });
          })
          .then((sucess) => {
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
          style={{ marginTop: window.innerHeight / 7 }}
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
                    src="images/undraw_remotely_2j6y.svg"
                    alt="Image"
                    className="img-fluid"
                  />
                  <p>&nbsp;</p>
                  <h3>Operator Sign Up</h3>
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
                                <FaUserAlt />
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
                                <FaRegAddressCard />
                              </div>
                              <div className="md-step-title">Personal</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step">
                              <div className="md-step-circle">
                                <FaGlobeAsia />
                              </div>
                              <div className="md-step-title">Addtional</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step">
                              <div className="md-step-circle">
                                <FaIdCard />
                              </div>
                              <div className="md-step-title">Valid I.D</div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                          </div>
                        ) : this.state.current === 1 ? (
                          <div className="md-stepper-horizontal orange">
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FaUserAlt />
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
                                <FaRegAddressCard />
                              </div>
                              <div className="md-step-title">Personal</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step">
                              <div className="md-step-circle">
                                <FaGlobeAsia />
                              </div>
                              <div className="md-step-title">Addtional</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step">
                              <div className="md-step-circle">
                                <FaIdCard />
                              </div>
                              <div className="md-step-title">Valid I.D</div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                          </div>
                        ) : this.state.current === 2 ? (
                          <div className="md-stepper-horizontal orange">
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FaUserAlt />
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
                                <FaRegAddressCard />
                              </div>
                              <div className="md-step-title">Personal</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FaGlobeAsia />
                              </div>
                              <div className="md-step-title">Addtional</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step">
                              <div className="md-step-circle">
                                <FaIdCard />
                              </div>
                              <div className="md-step-title">Valid I.D</div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="md-stepper-horizontal orange">
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FaUserAlt />
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
                                <FaRegAddressCard />
                              </div>
                              <div className="md-step-title">Personal</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FaGlobeAsia />
                              </div>
                              <div className="md-step-title">Addtional</div>
                              <div className="md-step-optional">
                                Information
                              </div>
                              <div className="md-step-bar-left"></div>
                              <div className="md-step-bar-right"></div>
                            </div>
                            <div className="md-step active">
                              <div className="md-step-circle">
                                <FaIdCard />
                              </div>
                              <div className="md-step-title">Valid I.D</div>
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
                            <div className="first">
                              <Select
                                value={this.state.selectedCountry}
                                placeholder={"Select Country"}
                                onChange={this.handleChangeselectedCountry}
                                options={this.state.AvailableOn}
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
                                      <FaEnvelope
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
                                      <FaLock
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
                                      <FaLock
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
                            display:
                              this.state.current === 1 ? "block" : "none",
                          }}
                        >
                          <div className="form-group first">
                            <Input
                              w={{
                                base: "100%",
                                md: "100%",
                              }}
                              InputLeftElement={
                                <Icon
                                  as={
                                    <FaUserShield
                                      style={{ marginLeft: "10", fontSize: 18 }}
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
                                    <FaMobileAlt
                                      style={{ marginLeft: "10", fontSize: 18 }}
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
                                    <FaUserCog
                                      style={{ marginLeft: "10", fontSize: 18 }}
                                    />
                                  }
                                  color="black"
                                />
                              }
                              style={{ marginLeft: "20", fontSize: 18 }}
                              placeholder="Operator Label"
                              onChangeText={(itemValue) =>
                                this.updateTextInput(itemValue, "Operator")
                              }
                              value={this.state.Operator}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display:
                              this.state.current === 2 ? "block" : "none",
                          }}
                        >
                          <div className="form-group first">
                            <Input
                              w={{
                                base: "100%",
                                md: "100%",
                              }}
                              InputLeftElement={
                                <Icon
                                  as={
                                    <FaHome
                                      style={{ marginLeft: "10", fontSize: 18 }}
                                    />
                                  }
                                  color="black"
                                />
                              }
                              style={{ marginLeft: "20", fontSize: 18 }}
                              placeholder="Province / State"
                              onChangeText={(itemValue) =>
                                this.updateTextInput(itemValue, "Province")
                              }
                              value={this.state.Province}
                            />
                          </div>

                          <div className="first">
                            <Select
                              placeholder={"Select City/Municipality"}
                              value={this.state.selectedCity}
                              onChange={this.handleChangeselectedCity}
                              options={this.state.city}
                            />
                          </div>
                          {this.state.selectedCity != null &&
                          this.state.selectedCity.label === "NEW CITY" ? (
                            <div className="form-group first">
                              <Input
                                w={{
                                  base: "100%",
                                  md: "100%",
                                }}
                                InputLeftElement={
                                  <Icon
                                    as={
                                      <FaHome
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
                                placeholder="City"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "newCity")
                                }
                                value={this.state.newCity}
                              />
                            </div>
                          ) : null}

                          {this.state.selectedCity != null &&
                          this.state.selectedCity.label === "NEW CITY" ? (
                            <div className="first">
                              <Select
                                value={this.state.SelectedRate}
                                onChange={this.handleChangeRate}
                                options={OptionRate}
                                placeholder={"Select type of rate"}
                              />
                            </div>
                          ) : null}
                          <div className="form-group first">
                            <Input
                              w={{
                                base: "100%",
                                md: "100%",
                              }}
                              InputLeftElement={
                                <Icon
                                  as={
                                    <FaHome
                                      style={{ marginLeft: "10", fontSize: 18 }}
                                    />
                                  }
                                  color="black"
                                />
                              }
                              style={{ marginLeft: "20", fontSize: 18 }}
                              placeholder="Detailed Address"
                              onChangeText={(itemValue) =>
                                this.updateTextInput(itemValue, "DAddress")
                              }
                              value={this.state.DAddress}
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            display:
                              this.state.current === 3 ? "block" : "none",
                          }}
                        >
                          <div className="form-group first">
                            <p style={{ color: "black", fontSize: 15 }}>
                              <b>Upload I.D</b>
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
                          <div className="first">
                            <Select
                              value={this.state.selectedOption}
                              onChange={this.handleChange}
                              options={options}
                              placeholder={"Choose Any Valid I.D To Attached"}
                            />
                          </div>

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
                        ) : this.state.current === 3 ? (
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
                                onClick={this.NextPage}
                              >
                                Next
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

export default RiderSignUp;
