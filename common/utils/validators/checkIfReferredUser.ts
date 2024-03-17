export const checkIfReferredUser = () => {
  const refLink = localStorage.getItem("Etherway_referralCode");
  return refLink === null
    ? { isReferred: false, refLink: null }
    : { isReferred: true, refLink };
};
