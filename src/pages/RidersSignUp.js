import React, { Component } from "react";
import {
  FcShop,
  FcLock,
  FcManager,
  FcTabletAndroid,
  FcFeedback,
  FcGlobe,
  FcGallery,
  FcDiploma1,
  FcCalendar,
  FcAutomotive,
  FcDiploma2,
  FcInTransit,
} from "react-icons/fc";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { FaFacebookSquare } from "react-icons/fa";
import {
  Input,
  Icon,
  NativeBaseProvider,
  TextArea,
  HStack,
  Text,
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

class RidersSignUp extends Component {
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
      AdminsList: [],
      VehicleList: [],
      selectedCountry: null,
      selectedCity: null,
      SelectedRate: null,
      selectedAccount: null,
      selectedAdmin: null,
      selectedVehicle: null,
      selectedYearModel: null,
      newCity: "",
      downloadLink: "",
      modalVisible: false,
      loading: false,
      photoLoading: false,
      selectedDeliveryApp: null,
      storeRadio: true,
      latitude: 8.951549,
      longitude: 125.527725,
      imagesVehicle: ["AddImage"],
      CpasswordV: false,
      passwordV: false,
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
      ownVehicle: true,
      DeliveryApps: [],
      license: "",
      uploadedVehicleORUploading: "",
      uploadedVehicleCRUploading: "",
      uploadedVehicleALUploading: "",
      uploadedLicenseUploading: "",
      AuthorizationLetter: "",
      Motorcycle: true,
      HelmetNo: "",
      HelmetColor: "",
      ListofCities: [],
      selectedCity: null,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    const { lng, lat, zoom } = this.state;

    this.unsubscribe = firebase
      .firestore()
      .collection("AvailableOn")
      .where("status", "==", true)
      .orderBy("label", "asc")
      .onSnapshot(this.onDataChange);

    firebase
      .firestore()
      .collection("categories")
      .where("charge", "==", 0)
      .onSnapshot((items) => {
        let city = [];

        items.forEach((item) => {
          let id = item.id;
          city.push({ label: item.data().title, value: item.data().title });
        });
        this.setState({
          city: city,
        });
      });

    firebase
      .firestore()
      .collection("DeliveryApps")
      .onSnapshot((items) => {
        let DeliveryApps = [];

        items.forEach((item) => {
          DeliveryApps.push({
            label: item.data().label,
            value: item.data().label,
          });
        });
        this.setState({ DeliveryApps });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  onDataChange(items) {
    let AvailableOn = [];

    items.forEach((item) => {
      let id = item.id;
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
        let ListofCities = [];
        items.forEach((item) => {
          if (item.data().activeReg === true) {
            let id = item.id;
            let data = item.data();
            ListofCities.push(item.data());
          }
        });
        this.setState({
          ListofCities: ListofCities,
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
          this.setState({ downloadLink: item.data().Rider });
        });
      });

    this.setState({ selectedCountry, selectedCity: null });
  };

  handleChangeselectedAdmin = (selectedAdmin) => {
    this.setState({ selectedAdmin });
  };

  handleChangeselectedVehicle = (selectedVehicle) => {
    this.setState({ selectedVehicle });
  };
  handleChangeselectedCity = (selectedCity) => {
    this.setState({ selectedCity });
    firebase
      .firestore()
      .collection("charges")
      .where("arrayofCity", "array-contains-any", [selectedCity.label])
      .onSnapshot((items) => {
        let AdminsList = [];

        items.forEach((item) => {
          AdminsList.push({
            label: item.data().email,
            value: item.data().email,
            arrayofCity: item.data().arrayofCity,
            name: item.data().Country,
            Country: item.data().Country,
            code: item.data().code,
            id: item.data().id,
            typeOfRate: item.data().typeOfRate,
            province: item.data().province,
            city: item.data().city,
          });
        });
        this.setState({
          AdminsList: AdminsList,
        });
      });
    if (
      this.state.selectedAccount != null &&
      this.state.selectedAccount.value === "Transport"
    ) {
      const collect =
        this.state.selectedCountry.label === "Philippines"
          ? "city"
          : this.state.selectedCountry.label + ".city";
      firebase
        .firestore()
        .collection(collect)
        .doc(selectedCity.label)
        .collection("vehicles")
        .onSnapshot((items) => {
          let VehicleList = [];

          items.forEach((item) => {
            VehicleList.push({
              label: item.data().vehicle,
              value: item.data().vehicle,
            });
          });
          this.setState({
            VehicleList: VehicleList,
          });
        });
    }
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

  onImageChangeVehicle = (event) => {
    if (this.state.imagesVehicle.length >= 4) {
      cogoToast.error("You can Only Upload 3 image");

      return;
    }
    this.setState({ photoLoading: true });
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        const formData = new FormData();
        formData.append("file", e.target.result);
        formData.append("upload_preset", "bgzuxcoc");
        const options = {
          method: "POST",
          body: formData,
        };
        fetch(
          "https://api.cloudinary.com/v1_1/kusinahanglan/image/upload",
          options
        )
          .then((res) => res.json())
          .then((res) => {
            this.setState({
              imagesVehicle: this.state.imagesVehicle.concat(res.secure_url),
              photoLoading: false,
            });
          })
          .catch((error) => {
            cogoToast.error("Failed to upload Vehicle Photo");
            this.setState({ loading: false });
          });
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
      .catch((err) => {});
  };
  handleChangeselectedAccount = (selectedAccount) => {
    this.setState({ selectedAccount: selectedAccount });
  };
  verifyEmail(email) {
    var reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }

  onSubmituploadedVehicleOR = () => {
    const { files } = document.querySelector("#uploadedVehicleOR");
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "bgzuxcoc");
    const options = {
      method: "POST",
      body: formData,
    };
    if (files[0] === undefined) {
      cogoToast.error("Upload Official Receipt.");
      return;
    }
    this.setState({ uploadedVehicleORUploading: "uploading" });

    fetch("https://api.cloudinary.com/v1_1/kusinahanglan/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        const newRes = res.secure_url;
        this.setState({
          uploadedVehicleORUploading: "Done",
          OR: res.secure_url,
        });
      })
      .catch((error) => {
        cogoToast.error("Failed to upload Official Receipt");
        this.setState({ uploadedVehicleCRUploading: "Try Again" });
      });
  };

  onSubmituploadedVehicleCR = () => {
    const { files } = document.querySelector("#uploadedVehicleCR");
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
    this.setState({ uploadedVehicleCRUploading: "uploading" });

    fetch("https://api.cloudinary.com/v1_1/kusinahanglan/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        const newRes = res.secure_url;
        this.setState({
          uploadedVehicleCRUploading: "Done",
          COR: res.secure_url,
        });
      })
      .catch((error) => {
        cogoToast.error("Failed to upload Certificate of Registration");
        this.setState({ uploadedVehicleCRUploading: "Try Again" });
      });
  };

  onSubmituploadedLicense = () => {
    const { files } = document.querySelector("#uploadedLicense");
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "bgzuxcoc");
    const options = {
      method: "POST",
      body: formData,
    };
    if (files[0] === undefined) {
      cogoToast.error("Upload License.");
      return;
    }
    this.setState({ uploadedLicenseUploading: "uploading" });

    fetch("https://api.cloudinary.com/v1_1/kusinahanglan/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        const newRes = res.secure_url;
        this.setState({
          uploadedLicenseUploading: "Done",
          license: res.secure_url,
        });
      })
      .catch((error) => {
        cogoToast.error("Failed to upload license");
        this.setState({ uploadedLicenseUploading: "Try Again" });
      });
  };

  onSubmituploadedVehicleAL = () => {
    const { files } = document.querySelector("#uploadedVehicleAL");
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "bgzuxcoc");
    const options = {
      method: "POST",
      body: formData,
    };
    if (files[0] === undefined) {
      cogoToast.error("Upload Authorization Letter.");
      return;
    }
    this.setState({ uploadedVehicleALUploading: "uploading" });

    fetch("https://api.cloudinary.com/v1_1/kusinahanglan/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        const newRes = res.secure_url;
        this.setState({
          uploadedVehicleALUploading: "Done",
          AuthorizationLetter: res.secure_url,
        });
      })
      .catch((error) => {
        cogoToast.error("Failed to upload license");
        this.setState({ uploadedVehicleALUploading: "Try Again" });
      });
  };

  onSubmit = () => {
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
      selectedCountry,
      selectedAccount,
      selectedAdmin,
      Email,
      Name,
      FBAccount,
      Mobile,
      detailedAddress,
      COR,
      OR,
      VDesc,
      VModel,
      VBrand,
      VColor,
      PlateNo,
      ExpDate,
      LicenseNo,
      CPassword,
      Password,
      selectedVehicle,
      license,
      AuthorizationLetter,
      ownVehicle,
      storeRadio,
      selectedDeliveryApp,
      selectedYearModel,
      Motorcycle,
      HelmetNo,
      HelmetColor,
    } = this.state;

    if (files[0] === undefined) {
      cogoToast.error("Upload Valid Id.");
      return;
    }
    if (ownVehicle === false && AuthorizationLetter === "") {
      cogoToast.error("Upload Authorization Letter.");
      return;
    }
    if (selectedCountry === null) {
      cogoToast.error("Select Country.");
      return;
    }
    if (selectedAccount === null) {
      cogoToast.error("Select Account Type.");
      return;
    }
    if (
      selectedAccount.label === "Transport" &&
      this.state.selectedCity === null
    ) {
      cogoToast.error("Select City.");
      return;
    }
    if (selectedAccount.label === "Transport" && selectedYearModel === null) {
      cogoToast.error("Select Year Model.");
      return;
    }
    if (selectedAccount.value != "Transport" && selectedAdmin === null) {
      cogoToast.error("Select Admin.");
      return;
    }

    if (
      Email === "" ||
      detailedAddress === "" ||
      Mobile === "" ||
      Name === "" ||
      FBAccount === ""
    ) {
      cogoToast.error("Please fill all fields.");
      return;
    }
    if (Motorcycle === false && license === "") {
      cogoToast.error("Please upload ID.");
      return;
    }
    if (
      (Motorcycle === true && license === "") ||
      COR === "" ||
      OR === "" ||
      VDesc === "" ||
      VModel === "" ||
      VBrand === "" ||
      VColor === "" ||
      PlateNo === "" ||
      ExpDate === "" ||
      LicenseNo === ""
    ) {
      cogoToast.error("Please fill all vehicle information.");
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
    cogoToast.success("Please wait a moment...");
    this.setState({ loading: true });
    fetch("https://api.cloudinary.com/v1_1/kusinahanglan/image/upload", options)
      .then((res) => res.json())
      .then((res) => {
        const newRes = res.secure_url;
        firebase
          .auth()
          .createUserWithEmailAndPassword(Email, Password)
          .then((authUser) => {
            const dataValue = {
              userTransactionCancelled: 0,
              Transactionprocessing: 0,
              TransactionPending: 0,
              TransactionCancelled: 0,
              TransactionCompleted: 0,
              helmet: HelmetNo,
              helmetNo: HelmetColor,
              selectedVehicle:
                selectedVehicle === null ? null : selectedVehicle.value,
              image: newRes,
              Origimage: newRes,
              Motorcycle: this.state.Motorcycle,
              city: this.state.selectedCity.label,
              province: this.state.selectedCity.province,
              arrayofCity: this.state.selectedCity.arrayofCity,
              Name: Name,
              Username: Name,
              Mobile: Mobile,
              ownerRider: storeRadio,
              selectedDeliveryApp:
                storeRadio === false ? selectedDeliveryApp.label : "",
              ownVehicle: ownVehicle,
              YearModel:
                selectedAccount.label === "Transport"
                  ? selectedYearModel.label
                  : "",
              AuthorizationLetter:
                Motorcycle === false ? "" : AuthorizationLetter,
              Email: Email,
              Password: Password,
              license: license,
              Lat: "",
              Long: "",
              userId: authUser.user.uid,
              token: [],
              wallet: parseFloat(0),
              status: false,
              FBAccount: FBAccount,
              MotorCR: Motorcycle === false ? "" : COR,
              MotorOR: Motorcycle === false ? "" : OR,
              MBrand: Motorcycle === false ? "" : VBrand,
              ColorMotor: Motorcycle === false ? "" : VColor,
              PlateNo: Motorcycle === false ? "" : PlateNo,
              Exp: Motorcycle === false ? "" : ExpDate,
              License: Motorcycle === false ? "" : LicenseNo,
              imagesVehicle: this.state.imagesVehicle,
              VModel: Motorcycle === false ? "" : VModel,
              adminID:
                selectedAccount.label === "Transport"
                  ? "nfEVrdtvGiNjyAu9Q2fqVCIGmYb2"
                  : selectedAdmin.id,
              star1: 0,
              star2: 0,
              start3: 0,
              star4: 0,
              start5: 0,
              NumberofDeliveries: 0,
              ProcessingStatus: "New",
              Country: selectedCountry.label,
              code: selectedCountry.code,
              Account: selectedAccount.value,
              Address: detailedAddress,
              VDesc: Motorcycle === false ? "" : VDesc,
            };

            firebase
              .firestore()
              .collection("riders")
              .doc(authUser.user.uid)
              .set(dataValue);
          })
          .then((sucess) => {
            cogoToast.success("Sucessfully Logged In");
            this.setState({ loading: false, modalVisible: true });
          })
          .catch((error) => {
            cogoToast.error("Failed to sign up");
            this.setState({ loading: false });
          });
      })
      .catch((error) => {
        cogoToast.error("Failed to upload Valid I.D image");
        this.setState({ loading: false });
      });

    //	event.preventDefault();
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
                    src="images/Delivery.png"
                    alt="Image"
                    className="img-fluid"
                  />
                  <p>&nbsp;</p>
                  <h1>
                    <b>Rider Sign Up</b>
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
                          <div className="col-md-8 md-stepper-horizontal orange">
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
                                <FcInTransit />
                              </div>
                              <div className="md-step-title">Vehicle</div>
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
                                <FcInTransit />
                              </div>
                              <div className="md-step-title">Vehicle</div>
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
                                <FcInTransit />
                              </div>
                              <div className="md-step-title">Vehicle</div>
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
                            <div className="SelectDropdown-form-group first">
                              <Select
                                value={this.state.selectedAccount}
                                placeholder={"Select Account Type"}
                                onChange={this.handleChangeselectedAccount}
                                options={[
                                  { label: "Food Delivery", value: "Foods" },
                                  { label: "Transport", value: "Transport" },
                                ]}
                                style={{ width: "80%" }}
                              />
                            </div>

                            {this.state.selectedAccount === null ? null : this
                                .state.selectedAccount.label ===
                              "Food Delivery" ? (
                              <div className="form-group first">
                                <input
                                  type="radio"
                                  onChange={() =>
                                    this.setState({ storeRadio: true })
                                  }
                                  checked={
                                    this.state.storeRadio === true
                                      ? true
                                      : false
                                  }
                                />
                                ARIBA Rider
                                <p></p>
                                <input
                                  type="radio"
                                  value="Doesn't"
                                  name="gender"
                                  onChange={() =>
                                    this.setState({ storeRadio: false })
                                  }
                                  checked={
                                    this.state.storeRadio === false
                                      ? true
                                      : false
                                  }
                                />{" "}
                                Others
                              </div>
                            ) : null}

                            {this.state.storeRadio === true ? null : (
                              <div className="SelectDropdown-form-group first">
                                <Select
                                  placeholder={"Delivery App"}
                                  value={this.state.selectedDeliveryApp}
                                  onChange={(selectedDeliveryApp) =>
                                    this.setState({ selectedDeliveryApp })
                                  }
                                  options={this.state.DeliveryApps}
                                />
                              </div>
                            )}
                            <div className="SelectDropdown-form-group first">
                              <Select
                                value={this.state.selectedCountry}
                                placeholder={"Select Country you will drive in"}
                                onChange={this.handleChangeselectedCountry}
                                options={this.state.AvailableOn}
                              />
                            </div>
                            <div className="SelectDropdown-form-group first">
                              <Select
                                placeholder={"Select City/Municipality"}
                                value={this.state.selectedCity}
                                onChange={this.handleChangeselectedCity}
                                options={this.state.ListofCities}
                              />
                            </div>

                            {this.state.selectedAccount === null ? null : this
                                .state.selectedAccount.label ===
                              "Transport" ? null : (
                              <div className="SelectDropdown-form-group first">
                                <Select
                                  value={this.state.selectedAdmin}
                                  placeholder={"Search Operator Email"}
                                  onChange={this.handleChangeselectedAdmin}
                                  options={this.state.AdminsList}
                                  style={{ width: "80%" }}
                                />
                              </div>
                            )}
                            {this.state.selectedAccount === null ? null : this
                                .state.selectedAccount.label === "Transport" ? (
                              <div className="SelectDropdown-form-group first">
                                <Select
                                  value={this.state.selectedVehicle}
                                  placeholder={"Select Type of Vehicle"}
                                  onChange={this.handleChangeselectedVehicle}
                                  options={this.state.VehicleList}
                                  style={{ width: "80%" }}
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
                                      <FaFacebookSquare
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
                                placeholder="Facebook Account"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "FBAccount")
                                }
                                value={this.state.FBAccount}
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
                              <TextArea
                                w={{
                                  base: "100%",
                                  md: "100%",
                                }}
                                InputLeftElement={
                                  <Icon
                                    as={
                                      <FcGlobe
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
                                placeholder="Home Address"
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
                            display:
                              this.state.current === 1 ? "block" : "none",
                          }}
                        >
                          {this.state.selectedAccount === null ? null : this
                              .state.selectedAccount.value === "Transport" ? (
                            <div>
                              <div
                                className="SelectDropdown-form-group first"
                                style={{ flexDirection: "row" }}
                              >
                                <FcAutomotive
                                  style={{ marginLeft: "10", fontSize: 18 }}
                                />
                                <Select
                                  value={this.state.selectedYearModel}
                                  placeholder={"Select Year Model"}
                                  onChange={(selectedYearModel) =>
                                    this.setState({ selectedYearModel })
                                  }
                                  options={[
                                    { label: "2010", value: "2010" },
                                    { label: "2011", value: "2011" },
                                    { label: "2012", value: "2012" },
                                    { label: "2013", value: "2013" },
                                    { label: "2014", value: "2014" },
                                    { label: "2015", value: "2015" },
                                    { label: "2016", value: "2016" },
                                    { label: "2017", value: "2017" },
                                    { label: "2018", value: "2018" },
                                    { label: "2019", value: "2019" },
                                    { label: "2020", value: "2020" },
                                    { label: "2021", value: "2021" },
                                    { label: "2022", value: "2022" },
                                    { label: "2023", value: "2023" },
                                    { label: "2024", value: "2024" },
                                    { label: "2025", value: "2025" },
                                    { label: "2026", value: "2026" },
                                    { label: "2027", value: "2027" },
                                    { label: "2028", value: "2028" },
                                    { label: "2029", value: "2029" },
                                    { label: "2030", value: "2030" },
                                    { label: "2031", value: "2031" },
                                    { label: "2032", value: "2032" },
                                    { label: "2033", value: "2033" },
                                  ]}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="form-group first">
                              <input
                                type="radio"
                                onChange={() =>
                                  this.setState({ Motorcycle: true })
                                }
                                checked={
                                  this.state.Motorcycle === true ? true : false
                                }
                              />
                              Motorcycle
                              <p></p>
                              <input
                                type="radio"
                                onChange={() =>
                                  this.setState({ Motorcycle: false })
                                }
                                checked={
                                  this.state.Motorcycle === false ? true : false
                                }
                              />{" "}
                              Bicycle
                            </div>
                          )}
                          <div
                            style={{
                              display:
                                this.state.Motorcycle === true
                                  ? "block"
                                  : "none",
                            }}
                          >
                            <div className="form-group first">
                              <input
                                type="radio"
                                onChange={() =>
                                  this.setState({ ownVehicle: true })
                                }
                                checked={
                                  this.state.ownVehicle === true ? true : false
                                }
                              />
                              Own Vehicle
                              <p></p>
                              <input
                                type="radio"
                                onChange={() =>
                                  this.setState({ ownVehicle: false })
                                }
                                checked={
                                  this.state.ownVehicle === false ? true : false
                                }
                              />{" "}
                              Others
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
                                      <FcGlobe
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
                                placeholder="License Number"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "LicenseNo")
                                }
                                value={this.state.LicenseNo}
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
                                      <FcCalendar
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
                                placeholder="License Expiration Date"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "ExpDate")
                                }
                                value={this.state.ExpDate}
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
                                      <FcDiploma1
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
                                placeholder="Plate Number"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "PlateNo")
                                }
                                value={this.state.PlateNo}
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
                                      <FcAutomotive
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
                                placeholder="Vehicle Color"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "VColor")
                                }
                                value={this.state.VColor}
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
                                      <FcAutomotive
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
                                placeholder="Vehicle Brand"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "VBrand")
                                }
                                value={this.state.VBrand}
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
                                      <FcAutomotive
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
                                placeholder="Vehicle Model"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "VModel")
                                }
                                value={this.state.VModel}
                              />
                            </div>

                            {this.state.selectedAccount === null ? null : this
                                .state.selectedAccount.label ===
                              "Food Delivery" ? (
                              <div className="form-group first">
                                <Input
                                  w={{
                                    base: "100%",
                                    md: "100%",
                                  }}
                                  InputLeftElement={
                                    <Icon
                                      as={
                                        <FcGlobe
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
                                  placeholder="Helmet Color"
                                  onChangeText={(itemValue) =>
                                    this.updateTextInput(
                                      itemValue,
                                      "HelmetColor"
                                    )
                                  }
                                  value={this.state.LicenseNo}
                                />
                              </div>
                            ) : null}

                            {this.state.selectedAccount === null ? null : this
                                .state.selectedAccount.label ===
                              "Food Delivery" ? (
                              <div className="form-group first">
                                <Input
                                  w={{
                                    base: "100%",
                                    md: "100%",
                                  }}
                                  InputLeftElement={
                                    <Icon
                                      as={
                                        <FcGlobe
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
                                  placeholder="Helmet No. (optional)"
                                  onChangeText={(itemValue) =>
                                    this.updateTextInput(itemValue, "HelmetNo")
                                  }
                                  value={this.state.LicenseNo}
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
                                      <FcAutomotive
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
                                placeholder="Vehicle Description"
                                onChangeText={(itemValue) =>
                                  this.updateTextInput(itemValue, "VDesc")
                                }
                                value={this.state.VDesc}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display:
                              this.state.current === 2 ? "block" : "none",
                          }}
                        >
                          <div className="form-group first">
                            <p style={{ color: "black", fontSize: 15 }}>
                              <b>Upload your Photo</b>
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
                          <div className="form-group first">
                            <p style={{ color: "black", fontSize: 15 }}>
                              <b>Upload Vehicle Photo</b>
                            </p>
                            <input
                              type="file"
                              id="uploadedVehicle"
                              onChange={this.onImageChangeVehicle}
                            />

                            <img
                              src={this.state.imagesVehicle[1]}
                              alt="Image"
                              className="img-fluid"
                            />
                            <img
                              src={this.state.imagesVehicle[2]}
                              alt="Image"
                              className="img-fluid"
                            />
                            <img
                              src={this.state.imagesVehicle[3]}
                              alt="Image"
                              className="img-fluid"
                            />
                          </div>
                          {this.state.ownVehicle === true ? null : (
                            <div className="form-group first">
                              <p style={{ color: "black", fontSize: 15 }}>
                                <b>Upload Authorization Letter</b>
                              </p>
                              <input type="file" id="uploadedVehicleAL" />

                              {this.state.uploadedVehicleALUploading === "" ? (
                                <button
                                  className="btn btn-block btn-primary col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                  onClick={this.onSubmituploadedVehicleAL}
                                >
                                  Upload
                                </button>
                              ) : this.state.uploadedVehicleALUploading ===
                                "uploading" ? (
                                <button
                                  className="btn btn-block btn-warning col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                >
                                  Uploading..
                                </button>
                              ) : this.state.uploadedVehicleALUploading ===
                                "Done" ? (
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
                                  onClick={this.onSubmituploadedVehicleAL}
                                >
                                  Try Again
                                </button>
                              )}
                            </div>
                          )}
                          {this.state.Motorcycle === false ? null : (
                            <div className="form-group first">
                              <p style={{ color: "black", fontSize: 15 }}>
                                <b>Upload Official Receipt</b>
                              </p>
                              <input type="file" id="uploadedVehicleOR" />

                              {this.state.uploadedVehicleORUploading === "" ? (
                                <button
                                  className="btn btn-block btn-primary col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                  onClick={this.onSubmituploadedVehicleOR}
                                >
                                  Upload
                                </button>
                              ) : this.state.uploadedVehicleORUploading ===
                                "uploading" ? (
                                <button
                                  className="btn btn-block btn-warning col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                >
                                  Uploading..
                                </button>
                              ) : this.state.uploadedVehicleORUploading ===
                                "Done" ? (
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
                                  onClick={this.onSubmituploadedVehicleOR}
                                >
                                  Try Again
                                </button>
                              )}
                            </div>
                          )}

                          {this.state.Motorcycle === false ? null : (
                            <div className="form-group first">
                              <p style={{ color: "black", fontSize: 15 }}>
                                <b>Upload Certificate of Registration</b>
                              </p>
                              <input type="file" id="uploadedVehicleCR" />
                              {this.state.uploadedVehicleCRUploading === "" ? (
                                <button
                                  className="btn btn-block btn-primary col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                  onClick={this.onSubmituploadedVehicleCR}
                                >
                                  Upload
                                </button>
                              ) : this.state.uploadedVehicleCRUploading ===
                                "uploading" ? (
                                <button
                                  className="btn btn-block btn-warning col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                >
                                  Uploading..
                                </button>
                              ) : this.state.uploadedVehicleCRUploading ===
                                "Done" ? (
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
                                  onClick={this.onSubmituploadedVehicleCR}
                                >
                                  Try Again
                                </button>
                              )}{" "}
                            </div>
                          )}

                          <div className="form-group first">
                            <p style={{ color: "black", fontSize: 15 }}>
                              <b>
                                Upload{" "}
                                {this.state.Motorcycle === false
                                  ? "Valid ID"
                                  : "License"}
                              </b>
                            </p>
                            <input type="file" id="uploadedLicense" />
                            {this.state.uploadedLicenseUploading === "" ? (
                              <button
                                className="btn btn-block btn-primary col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                                onClick={this.onSubmituploadedLicense}
                              >
                                Upload
                              </button>
                            ) : this.state.uploadedLicenseUploading ===
                              "uploading" ? (
                              <button
                                className="btn btn-block btn-warning col-lg-5"
                                style={{ marginTop: 0, marginLeft: "7%" }}
                              >
                                Uploading..
                              </button>
                            ) : this.state.uploadedLicenseUploading ===
                              "Done" ? (
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
                                onClick={this.onSubmituploadedLicense}
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
                              {this.state.photoLoading === true ? (
                                <button
                                  className="btn btn-block btn-primary col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                >
                                  Uploading...
                                </button>
                              ) : this.state.uploadedLicenseUploading !=
                                "Done" ? (
                                <button
                                  className="btn btn-block btn-secondary col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                >
                                  Submit
                                </button>
                              ) : this.state.photoLoading === true ? (
                                <button
                                  className="btn btn-block btn-secondary col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                >
                                  Uploading...
                                </button>
                              ) : (
                                <button
                                  className="btn btn-block btn-primary col-lg-5"
                                  style={{ marginTop: 0, marginLeft: "7%" }}
                                  onClick={this.onSubmit}
                                >
                                  Submit
                                </button>
                              )}
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

export default RidersSignUp;
