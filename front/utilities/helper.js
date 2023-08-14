import Toast from "react-native-root-toast";
const Helper = {
  validateListingData: ({ user_id, role, amount, payment_type, product }) => {
    let error = 0;
    error += payment_type == "" && Helper.errors("Choose a payment type");
    error += role == "" && Helper.errors("Select selling or buying");
    error += (user_id == "" || user_id == 0) && Helper.errors("Invalid User");
    error +=
      (amount == "" || amount <= 0) && Helper.errors("Amount is required");
    error += product == "" && Helper.errors("Product name is required");
    // console.log("error", error);
    return error;
  },

  toast: (message, position = "center") => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: position == "center" ? Toast.positions.CENTER : position,
    });
  },

  errors: (message) => {
    Helper.toast(message);
    return 1;
  },
};

export default Helper;
