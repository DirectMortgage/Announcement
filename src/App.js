import { useEffect } from "react";
import "./App.css";
import Announcement from "./Component/Announcement";
import {
  handleSessionCheck,
  queryStringToObject,
} from "./Component/CommonFunctions";
import Footer from "./Component/Footer";
import PreviousAnnouncement from "./Component/PreviousAnnouncement";
import ViewAnnouncement from "./Component/ViewAnnouncement";
let { Type, UserId, SessionId, Id, sType } = queryStringToObject(
  window.location?.href || ""
);
SessionId = SessionId.replace("#", "");
const components = {
  A: <Announcement UserId={UserId} SessionId={SessionId} Type={Type} />,
  PA: (
    <PreviousAnnouncement UserId={UserId} SessionId={SessionId} Type={Type} />
  ),
  VA: <ViewAnnouncement Id={Id} SessionId={SessionId} sType={sType} />,
};

function App() {
  useEffect(() => {
    const chkInterval = setInterval(() => {
      handleSessionCheck(SessionId, () => {
        window.location.href = "www.directmortgage.com";
      });
    }, 3000);
    return () => {
      clearInterval(chkInterval);
    };
  }, []);
  return (
    <div className="clsMainDiv">
      {components[Type]}
      <Footer SessionId={SessionId} Type={Type} />
    </div>
  );
}

export default App;
