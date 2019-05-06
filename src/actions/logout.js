export const logout = (selectedMortgageData, paymentsData) => {
  return {
    type: 'ON_LOGOUT',
    selectedMortgageData,
    paymentsData
  };
};
