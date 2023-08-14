import { Paystack } from "react-native-paystack-webview";
import AuthApi from "../api/wallet";
import routes from "../navigation/routes";
import { StatusBar } from "expo-status-bar";

const PaymentPage = (props) => {
  return (
    <Paystack
      paystackKey="pk_live_b7849959dbe6837f283c3853b5a6b81c914b6bce"
      amount={props.route.params.amount}
      billingEmail={"oladepo.olushina@gmail.com"}
      activityIndicatorColor="#3A4D8F"
      onCancel={(e) => {
        // handle response here
        props.navigation.navigate(routes.MAINPAGE);
      }}
      onSuccess={async (res) => {
        // handle response here
        console.log(res);
        let paymentDetails = props.route.params;
        let user_id = paymentDetails.user_id;
        let amount = paymentDetails.amount;
        let transaction_type = paymentDetails.transaction_type;
        // let payment_ref = res+user_id
        // const response = await AuthApi.addMoney({user_id, amount, transaction_type, payment_ref});
        // let newResponse = response.data;
        // console.log(newResponse)
      }}
      autoStart={true}
    />
  );
};

export default PaymentPage;
