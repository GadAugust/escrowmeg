const clientId =
  "<ATRMDSoODYTRMc4VUTemdpGOJHd1_GhpZPfYWG5EU-Ac_i9shLtKZIviToOHxl-osC7ixAkLGNfoatfG>";
const clientSecret =
  "<EIwlNHo_L8VEml9emqfZmvPTxYeE9mEqtfl3Ehjho7_J4sUcnLpmbhmoMmMEXrjZyZ5sP76BZZeU3ueo>";

const getToken = async () => {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString("base64");

  const requestBody = "grant_type=client_credentials";

  try {
    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        },
        body: requestBody,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to obtain PayPal token");
    }

    const data = await response.json();
    const accessToken = data.access_token;

    // Use the access token for further PayPal API requests
    console.log("Access Token:", accessToken);
  } catch (error) {
    console.error("Error:", error);
  }
};

getToken();
