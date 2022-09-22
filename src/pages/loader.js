import React from "react";
import Loader from "react-loader-spinner";

const Loaders = (props) => {
  const { loading } = props;

  return (
    <Loader
      visible={loading}
      type="Puff"
      color="#00BFFF"
      height={100}
      width={100}
      timeout={3000} //3 secs
    />
  );
};

export default Loaders;
