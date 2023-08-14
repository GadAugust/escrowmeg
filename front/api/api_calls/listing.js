import Helper from "../../utilities/helper";
import AuthApi from "../listing";

const fetchMyListings = async ({ user_id }) => {
  const response = await AuthApi.fetchListings({ user_id });
  console.log("Listing response", response.data);
  return response.data ? response.data.data : [];
};

const fetchMySummary = async ({ user_id }) => {
  const response = await AuthApi.fetchMySummary({ user_id });
  // console.log(response.data);
  return response.data.data;
};

const createNewListing = async (listing) => {
  console.log("New listing", listing);
  let status = "error";
  const response = await AuthApi.createListing(listing);
  if (response.status == 500) {
    Helper.toast("An error occured. Try again");
  } else if (response.status == 201) {
    Helper.toast("Listing added successfully");
    status = "success";
  } else {
    Helper.toast(response.data.message);
  }

  return status;
};

const fetchListingsWithBids = async ({ user_id }) => {
  const response = await AuthApi.fetchListingsWithBids({ user_id });
  // console.log("Listings with bids", response.data.data);
  return response.data ? response.data.data : [];
};

export {
  fetchMyListings,
  createNewListing,
  fetchMySummary,
  fetchListingsWithBids,
};
