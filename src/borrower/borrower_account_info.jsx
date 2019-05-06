import React from 'react';

export const BorrowerAccountInfo = props => {
  return (
    <ul
      className="details-list col-xs-12 list-unstyled no-max-height margin-bottom"
      style={{ backgroundColor: 'white' }}
    >
      <li className="dot col-xs-12 green-dot">
        <div>Name</div>
        <div>{props.accountInfo && props.accountInfo.borrower_name ? props.accountInfo.borrower_name : null}</div>
      </li>
      <li className="dot col-xs-12 blue-dot">
        <div>Mailing Address</div>
        <div>{props.accountInfo && props.accountInfo.mailingaddress}</div>
      </li>
      <li className="dot col-xs-12 red-dot">
        <div>Mortgage servicer’s name</div>
        <div>{props.accountInfo && props.accountInfo.mortgage_servicer_name}</div>
      </li>
      <li className="dot col-xs-12 sky-blue-dot">
        <div>Mortgage servicer balance</div>
        <div>
          {props.accountInfo && props.accountInfo.mortgage_servicer_balance
            ? '$' +
              Number(props.accountInfo.mortgage_servicer_balance).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : null}
        </div>
      </li>
      <li className="dot col-xs-12 yellow-dot">
        <div>Property address</div>
        <div>{props.accountInfo && props.accountInfo.property_address}</div>
      </li>
      <li className="dot col-xs-12 blue-dot">
        <div>Initial value of the local index at time of origination </div>
        <div>
          {props.accountInfo && props.accountInfo.initial_local_index
            ? Number(props.accountInfo.initial_local_index).toFixed(2)
            : null}
        </div>
      </li>
      <li className="dot col-xs-12 green-dot">
        <div>Initial value of the national index at time of origination</div>
        <div>
          {props.accountInfo && props.accountInfo.initial_national_index
            ? Number(props.accountInfo.initial_national_index).toFixed(2)
            : null}
        </div>
      </li>
      <li className="dot col-xs-12 blue-dot">
        <div>Current value of the local index</div>
        <div>
          {props.accountInfo && props.accountInfo.current_local_index
            ? Number(props.accountInfo.current_local_index).toFixed(2)
            : null}
        </div>
      </li>
      <li className="dot col-xs-12 red-dot">
        <div>Current value of the national index</div>
        <div>
          {props.accountInfo && props.accountInfo.currenr_national_index
            ? Number(props.accountInfo.currenr_national_index).toFixed(2)
            : null}
        </div>
      </li>
      <li className="dot col-xs-12 sky-blue-dot">
        <div>Total swap balance</div>
        <div>
          {props.accountInfo && props.accountInfo.swapbalance
            ? '$' +
              Number(props.accountInfo.swapbalance).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : null}
        </div>
      </li>

      {props.viewSwapHistory || !props.handleAccountInfo ? null : (
        <li className="dot col-xs-12 sky-blue-dot">
          <div
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => props.handleAccountInfo(props.accountInfo.propertyid)}
          >
            Go To Swap Balance History screen
          </div>
        </li>
      )}
    </ul>
  );
};
