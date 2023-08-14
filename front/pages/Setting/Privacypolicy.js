import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import routes from "../../navigation/routes";
import lightTheme from "../../config/lightmodecolors";
import darkTheme from "../../config/darkmodecolors";
import frontStorage from "../../utilities/storage";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default class PrivacyPolicy extends Component {
  constructor(props) {
    super(props), (this.state = { theme: "dark" });
  }

  async componentDidMount() {
    const getTheme = await frontStorage.asyncGet("mode");
    let currentTheme = getTheme ? JSON.parse(getTheme) : this.state.theme;
    this.setState({ ...this.state, theme: currentTheme });
  }
  back = () => {
    this.props.navigation.navigate(routes.MAINPAGE);
  };

  render() {
    const { theme } = this.state;

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme == "dark" ? darkTheme.dark : lightTheme.dark,
          },
        ]}
      >
        <StatusBar style="light" animated={true} backgroundColor="#141414" />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
        >
          <TouchableOpacity onPress={this.back}>
            <Ionicons name="chevron-back-outline" size={30} color="#3A4D8F" />
          </TouchableOpacity>
          <Text
            style={[
              styles.privacy,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Privacy Policy
          </Text>
        </View>
        <ScrollView>
          <Text
            style={[
              styles.text,
              {
                color: theme == "dark" ? darkTheme.primary : lightTheme.primary,
              },
            ]}
          >
            Please read this privacy policy (the “Policy”) carefully to
            understand how EskroBytes LLC., 3247 SugarCreek trceSE, Atlanta. GA.
            30316 (“EskroBytes”, “we”) uses personal information. By accessing
            or using www.EskroBytes.com, the EskroBytes mobile app, or any other
            related sites, applications, services and goods, or any other
            website operated by EskroBytes that links to this policy (each, the
            “Site”), you acknowledge that you have read and understood this
            Policy. This Policy may change from time to time; any changes we
            make to this Policy will be posted on this Site, we will also take
            any other steps, to the extent required by applicable law, including
            notifying you about material changes. Changes to this Policy are
            effective as of the stated "Last Updated" date. We recommend that
            you check the Policy periodically for any updates or changes. •The
            short version •The longer version •Information We Collect •Our Legal
            Basis for Using Your Personal Information •How Do We Use The
            Information Collected? •How Long Do We Keep Personal Information?
            •Children •Where We Store Your Personal Information •Cookies •Do Not
            Track •External Links •Security •Rights of EU, EEA and UK Users
            •Specific Provisions for California Residents •Updating Personal
            Information Our Legal Basis for Using Your Personal Information -
            Where relevant under applicable laws, all processing of your
            personal information will be justified by a "lawful ground" for
            processing as detailed below. How Do We Use the Information
            Collected? – We use personal information to provide you with quality
            service and security, to operate the Site, understand how people use
            the Site, and to perform our obligations to you; to ensure
            marketplace integrity and security; to prevent fraud; to contact you
            and send you direct marketing communications; to promote and
            advertise the Site, our services and the EskroBytes marketplace; to
            comply with lawful requests by public authorities and to comply with
            applicable laws and regulations. How Long Do We Keep Personal
            Information – We will keep personal information only for as long as
            is required to fulfil the purpose for which it was collected.
            However, in some cases we will retain personal information for
            longer periods of time. Children - This Site is offered and
            available to users who are at least 18 years of age and of legal age
            to form a binding contract. Minors under 18 and at least 13 years of
            age, are only permitted to use the Site through an account owned by
            a parent or legal guardian with their appropriate permission. Minors
            under 13 are not permitted to use the Site or the EskroBytes
            services. We do not knowingly collect personal information from
            children under 13. Sharing Personal Information with Third Parties –
            We share personal information with third parties in order to operate
            the Site, provide our services to you, fulfil obligations imposed on
            us by applicable laws and regulations, and prevent fraud,
            infringements and illegal activities. Where We Store Personal
            Information - Some of the personal information you provide to us
            will be stored or processed on our behalf by third party suppliers
            and data processors and may be located in other jurisdictions, such
            as the United States and Israel. Cookies - We use cookies and
            similar technologies (such as web beacons, pixels, tags, and
            scripts) to improve and personalize your experience, provide our
            services, analyze website performance and for marketing purposes. Do
            Not Track (DNT) – Our Site does not respond to Do Not Track (DNT)
            signals. External Links - the Site contains links to third party
            sites and if you link to a third party site from the Site, any data
            you provide to that site and any use of that data by the third party
            are not under the control of EskroBytes and are not subject to this
            Policy. Security – We implement technical and organizational
            measures to maintain the security of the Site and your personal
            information and in preventing unauthorized access, loss, misuse,
            alteration, destruction or damage to it through industry standard
            technologies and internal procedures.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  privacy: {
    fontSize: 16,
    fontFamily: "ClarityCity-Bold",
  },
  text: {
    fontSize: 16,
    fontFamily: "ClarityCity-Regular",
    textAlign: "justify",
  },
});
