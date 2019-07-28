import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import PinIcon from "./PinIcon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const INITIAL_MAP_STYLE = {
  style: "streets"
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState(INITIAL_MAP_STYLE);
  const [userPosition, setUserPosition] = useState(null);
  useEffect(() => {
    getUserPosition();
  }, []);

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle={`mapbox://styles/mapbox/${mapStyle.style}-v9`}
        mapboxApiAccessToken="pk.eyJ1IjoiaGVybnF1aXN0IiwiYSI6ImNqeW1kNXN2cjBpMGEzY215bXZlODJ3a2IifQ.yj9qFSIpVggDtE51MpeTQg"
        onViewportChange={newViewport => setViewport(newViewport)}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* Pin for current position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
      </ReactMapGL>
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
