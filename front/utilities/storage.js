import AsyncStorage from "@react-native-async-storage/async-storage";

const frontStorage = {
  asyncStore: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  },

  asyncGet: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      // error reading value
    }
  },

  asyncRemove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {}
  },

  getUserData: async (type) => {
    const getData = await frontStorage.asyncGet("userData");
    let userData = getData && JSON.parse(getData);
    // console.log("Userdata", userData);
    if (type == "full") {
      return userData;
    }
    userData = {
      user_id: userData.id,
      firstname: userData.first_name,
      lastname: userData.last_name,
      image: userData.image
        ? "https://eskro-bucket.ams3.cdn.digitaloceanspaces.com/profile_pic/" +
          userData.image.img_url
        : null,
    };
    return userData;
  },
};

export default frontStorage;
