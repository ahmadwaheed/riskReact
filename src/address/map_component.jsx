import React from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';

export const GoogleMapsWrapper = withGoogleMap(props => {
  return (
    <GoogleMap {...props} ref={props.onMapMounted}>
      {props.children}{' '}
    </GoogleMap>
  );
});
