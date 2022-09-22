import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import RiderSignUp from "./pages/RiderSignUp";
import StoreSignUp from "./pages/StoreSignUp";
import HotelAndRentalsSignUp from "./pages/HotelAndRentalsSignUp";
import joinServiceProvider from "./pages/joinServiceProvider";
import joinDeliveryRider from "./pages/joinDeliveryRider";
import joinCarRental from "./pages/joinCarRental";
import joinTruckingServices from "./pages/joinTruckingServices";
import joinHotel from "./pages/joinHotel";
import joinRestaurant from "./pages/joinRestaurant";
import joinBackloadServices from "./pages/joinBackloadServices";
import joinEquipementRentals from "./pages/joinEquipementRentals";
import joinServices from "./pages/joinServices";
import RidersSignUp from "./pages/RidersSignUp";
import index from "./pages/index";

function App() {
  return (
    <Router>
      <Route path="/" exact component={index} />
      <Route path="/RiderSignUp" exact component={RiderSignUp} />
      <Route path="/StoreSignUp" component={StoreSignUp} />
      <Route path="/HotelAndRentalsSignUp" component={HotelAndRentalsSignUp} />
      <Route path="/joinServiceProvider" component={joinServiceProvider} />
      <Route path="/joinDeliveryRider" component={joinDeliveryRider} />
      <Route path="/joinCarRental" component={joinCarRental} />
      <Route path="/joinTruckingServices" component={joinTruckingServices} />
      <Route path="/joinHotel" component={joinHotel} />
      <Route path="/joinRestaurant" component={joinRestaurant} />
      <Route path="/joinBackloadServices" component={joinBackloadServices} />
      <Route path="/joinEquipementRentals" component={joinEquipementRentals} />
      <Route path="/joinServices" component={joinServices} />
      <Route path="/RidersSignUp" component={RidersSignUp} />
    </Router>
  );
}

export default App;
