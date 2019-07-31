import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import Radio from "@material-ui/core/Radio";
// import RadioButton from "@material-ui/core/RadioButton";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Typography } from "@material-ui/core";
import { Subscription } from "react-apollo";
import differenceInMinutes from "date-fns/difference_in_minutes";
import PinIcon from "./PinIcon";
import Context from "../context";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import {
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION,
  PIN_ADDED_SUBSCRIPTION
} from "../graphql/subscriptions";
import { useClient } from "../client";
import Blog from "./Blog";

const INITIAL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const INITIAL_MAP_STYLE = {
  style: "streets"
};

const Map = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mapStyle, setMapStyle] = useState(INITIAL_MAP_STYLE);
  const [userPosition, setUserPosition] = useState(null);
  useEffect(() => {
    getUserPosition();
  }, []);
  useEffect(() => {
    getPins();
  }, []);
  const [popup, setPopup] = useState(null);

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);

    dispatch({ type: "GET_PINS", payload: getPins });
  };

  const handleMapClick = ({ lngLat, leftButton, target }) => {
    if (Object.keys(target).some(key => key === "checked")) {
      return;
    }

    if (!leftButton) return;

    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }

    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    });
  };

  const highlightNewPin = pin =>
    differenceInMinutes(Date.now(), pin.createdAt) <= 30
      ? "limegreen"
      : "darkblue";

  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: "SET_PIN", payload: pin });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id };
    await client.request(DELETE_PIN_MUTATION, variables);
    // dispatch({ type: "DELETE_PIN", payload: deletePin });
    setPopup(null);
  };

  const handleMapStyleChange = e => {
    setMapStyle({ style: e.target.value });

    dispatch({ type: "DELETE_DRAFT" });
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        id="other"
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle={`mapbox://styles/mapbox/${mapStyle.style}-v9`}
        mapboxApiAccessToken="pk.eyJ1IjoiaGVybnF1aXN0IiwiYSI6ImNqeW1kNXN2cjBpMGEzY215bXZlODJ3a2IifQ.yj9qFSIpVggDtE51MpeTQg"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            style={{ width: "30px" }}
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>
        <div className={classes.mapStylesControl}>
          <RadioGroup
            id="overwrites"
            aria-label="map-styles"
            name="map-styles"
            className={classes.group}
            value={mapStyle.style}
            onChange={handleMapStyleChange}
          >
            <FormControlLabel
              value="streets"
              control={<Radio />}
              label="Street View"
            />
            <FormControlLabel
              value="satellite"
              control={<Radio />}
              label="Satellite View"
            />
          </RadioGroup>
        </div>
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
        {state.draft && (
          <Marker
            longitude={state.draft.longitude}
            latitude={state.draft.latitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            longitude={pin.longitude}
            latitude={pin.latitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}

        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          console.log({ pinAdded });
          dispatch({ type: "CREATE_PIN", payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          console.log({ pinUpdated });
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdated });
        }}
      />{" "}
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          console.log({ pinDeleted });
          dispatch({ type: "DELETE_PIN", payload: pinDeleted });
        }}
      />
      <Blog />
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
  mapStylesControl: {
    position: "absolute",
    top: 100,
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
