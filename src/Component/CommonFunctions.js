const API_CONTROLLER_NAME = "GenericAPI",
  API_URL = `../../../${API_CONTROLLER_NAME}/api/`;

const handleAPI = async ({
  name,
  params,
  method,
  requestOptions = null,
  apiName = null,
}) => {
  let url = API_URL;

  params = Object.keys(params)
    .map(
      (key) => `${key}=${params[key]?.toString()?.replaceAll("&", "U00026")}`
    )
    .join("&");

  if (window.location.host.includes("localhost")) {
    url = url.replace("../../..", "https://www.solutioncenter.biz");
  }
  if (apiName) {
    url = url.replace(API_CONTROLLER_NAME, apiName);
  }
  try {
    return fetch(
      `${url}${name}?${params}`,
      requestOptions
        ? requestOptions
        : {
            method: method || "POST",
            mode: "cors",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
    )
      .then(async function (response) {
        return await response.json();
      })
      .catch(function (err) {
        console.error(`Error from handleAPI (${name}) ====>  ${err}`);
      });
  } catch (error) {}
};
const queryStringToObject = (queryString) => {
  if (!queryString) queryString = window.location.href;
  queryString = queryString.split("?")[1];
  const params = new URLSearchParams(queryString),
    result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};
const handleSessionCheck = async (SessionId, handleSessionOut = () => {}) => {
  if (SessionId) {
    const response = await handleAPI({
      name: "GetUsersDetails",
      params: { SessionId: SessionId },
      apiName: "LoginCredentialsAPI",
    })
      .then(function (iResponse) {
        return iResponse;
      })
      .catch(function (err) {
        console.error(`Error from handleSessionCheck ====>  ${err}`);
      });
    let iResponse = response.split("~");

    if (iResponse[0] <= 0) {
      handleSessionOut();
    }

    return iResponse[0];
  }
};
const handleSaveWindowSize = async ({
  Type,
  SessionId,
  Flag,
  callBack = () => {},
}) => {
  let {
    innerWidth: Width,
    innerHeight: Height,
    screenX: Left,
    screenY: Top,
  } = window;
  let viewPosition = {
    Width,
    Height,
    CurrentView: 0,
    Left,
    Top,
  };
  var obj = {
    SessionId,
    ViewJson: JSON.stringify(viewPosition),
    UpdateFlag: Flag,
    FormID: 0,
    FormName:
      Type == "A"
        ? "/Announcement"
        : Type == "VA"
        ? "/ViewAnnouncement"
        : Type == "PA"
        ? "/PreviousAnnouncement"
        : "",
  };
  return await handleAPI({
    name: "SaveWindowSize",
    params: obj,
  }).then((response) => {
    callBack();
    return response;
    // JSON.parse(JSON.parse(response)["Table"][0].Column1);
  });
};
export {
  handleAPI,
  queryStringToObject,
  handleSessionCheck,
  handleSaveWindowSize,
};
