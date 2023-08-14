import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import RegisterScreen from "../pages/Register";
import SplashScreen from "../pages/Splash";
import ChangeForgotPassword from "../pages/Changeforgotpassword";
import LoginScreen from "../pages/Login";
import ForgotPasswordScreen from "../pages/Forgotpassword";
import EmailSentScreen from "../pages/Emailsent";
import ProfilePictureScreen from "../pages/Profilepicture";
import AddBankScreen from "../pages/Addbank";
import SixDigitsPasswordScreen from "../pages/Sixdigitspassword";
import SixDigitsRegisterScreen from "../pages/Sixdigitsregister";
import TransactionpinScreen from "../pages/Transactionpin";
import TransactionDetailsScreen from "../pages/Wallet/Transactiondetails";
import AddMoney from "../pages/Wallet/Addmoney";
import MoneyAddedScreen from "../pages/Moneyadded";
import AllAccountsScreen from "../pages/Wallet/Allaccounts";
import WalletWithdrawScreen from "../pages/Wallet/Walletwithdraw";
import WithdrawPinScreen from "../pages/Wallet/Withdrawpin";
import MainPage from "../pages/Mainpage";
import ListDetailsScreen from "../pages/Listing/Listdetails";
import ProjectDetails from "../pages/Project/Projectdetails";
import SearchResultScreen from "../pages/Listing/Searchresult";
import BidScreen from "../pages/Listing/BidScreen";
import Paypal from "../pages/Wallet/Paypalpage";
import ChangePassword from "../pages/Setting/Changepassword";
import PolicyPage from "../pages/Setting/Policypage";
import ChangePin from "../pages/Setting/Changepin";
import NotFound from "../pages/NotFound";
import ResetPinScreen from "../pages/Setting/Resetpin";
import Onboarding from "../pages/Onboarding";

const Stack = createStackNavigator();
const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={routes.SPLASH}
      component={SplashScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.ONBOARDING}
      component={Onboarding}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.LOGIN}
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.REGISTER}
      component={RegisterScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.SIXDIGITSPASSWORD}
      component={SixDigitsPasswordScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.SIXDIGITSREGISTER}
      component={SixDigitsRegisterScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.CHANGEFORGOTPASSWORD}
      component={ChangeForgotPassword}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.FORGOTPASSWORD}
      component={ForgotPasswordScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.EMAILSENT}
      component={EmailSentScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.PROFILEPICTURE}
      component={ProfilePictureScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.ADDBANK}
      component={AddBankScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.TRANSACTIONPIN}
      component={TransactionpinScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.TRANSACTIONDETAILS}
      component={TransactionDetailsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.CHANGEPIN}
      component={ChangePin}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.ADDMONEY}
      component={AddMoney}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.MONEYADDED}
      component={MoneyAddedScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.ALLACCOUNTS}
      component={AllAccountsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.WALLETWITHDRAW}
      component={WalletWithdrawScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.WITHDRAWPIN}
      component={WithdrawPinScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.MAINPAGE}
      component={MainPage}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.POLICYPAGE}
      component={PolicyPage}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.LISTDETAILS}
      component={ListDetailsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.PROJECTDETAILS}
      component={ProjectDetails}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.LISTSEARCHRESULT}
      component={SearchResultScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.BIDSCREEN}
      component={BidScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.PAYPALPAGE}
      component={Paypal}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.CHANGEPASSWORD}
      component={ChangePassword}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.NOTFOUND}
      component={NotFound}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name={routes.RESETPIN}
      component={ResetPinScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
export default AuthNavigator;
