import React from 'react';

export const DisplayRecord = props => {
  return (
    <tr>
      <td>{props.data.zip_code}</td>
      <td>{props.data.yyyymm}</td>
      <td>{props.data.home_price_index}</td>
      <td>{props.data.std_deviation}</td>
      <td>{props.data.percent_diff_in_housing_prices_month_to_month}</td>
    </tr>
  );
};
