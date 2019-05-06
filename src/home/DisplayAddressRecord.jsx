import React from 'react';

export const DisplayAddressRecord = props => {
  return (
    <tr>
      <td>{props.data.sAddress}</td>
      <td>{props.data.sCityName}</td>
      <td>{props.data.sStateName}</td>
      <td>{props.data.sCountyName}</td>
      <td>{props.data.sStateCode}</td>
      <td>{props.data.sCountyCode}</td>
      <td>{props.data.sStateAbbr}</td>
      <td>{props.data.sTractCode}</td>
      <td>{props.data.sZipCode}</td>
      <td>{props.data.sMSAName}</td>
      <td>{props.data.sMSACode}</td>
      <td>{props.data.iCensusYear}</td>
      <td>{props.data.sLatitude}</td>
      <td>{props.data.sLongitude}</td>
    </tr>
  );
};
