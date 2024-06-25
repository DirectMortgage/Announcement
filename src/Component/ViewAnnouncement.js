import { useEffect, useState } from "react";
import { handleAPI } from "./CommonFunctions";

const ViewAnnouncement = (props) => {
  const { Id, SessionId, sType = 0 } = props;
  const [announcementDetails, setAnnouncementDetails] = useState({
    from: "",
    subject: "",
    announcedWhen: "",
    announcementMsg: "",
    filePath: "",
    type: "",
    CC: "",
  });

  useEffect(() => {
    document.title = "View Announcement";
    getAnnouncement(); // Call GetPrevAnnouncement on component mount
  }, []);

  const getAnnouncement = () => {
    handleAPI({
      name: "getAnnouncement",
      params: {
        Id,
        SessionId,
        sType,
      },
    })
      .then((response) => {
        setAnnouncementDetails(JSON.parse(response)[0]);
      })
      .catch((err) => console.error("Error from GetAnnouncement ====> ", err));
  };
  const getInitials = (name) => {
    if (!name) return "";
    else if (name == "DirectWare") return "DW";
    const nameParts = name.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.toUpperCase();
  };
  const {
    from = "",
    subject = "",
    announcedWhen = "",
    announcementMsg = "",
    filePath = "",
    type = "",
    CC = "",
  } = announcementDetails;
  const renderAttachments = (filePath) => {
    if (!filePath) return null;
    return filePath.split(",").map((file, index) => (
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        key={index}
        style={{ display: "block" }}
        onClick={() => {
          handleAPI({
            name: "OpenAttachments",
            params: {
              Id,
              file,
            },
          })
            .then((response) => {
              window.open("../../../../PDF/" + response, "_blank", "_blank");
            })
            .catch((err) =>
              console.error("Error from PostAnnouncement ====> ", err)
            );
        }}
      >
        {file.split("/").pop()}
      </a>
    ));
  };
  return (
    <div
      className="col-xs-12 col-sm-12 col-md-12 col-lg-12 container-wrapper"
      style={{ width: "100%", justifyContent: "center", display: "flex" }}
    >
      <div className="divContainer-1 card-1">
        <div className="clsDivTop border">
          <div
            className="clsName"
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              backgroundColor: "#2672cb",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 16,
              color: "#fff",
              fontWeight: 600,
              marginRight: 16,
            }}
          >
            {getInitials(from)}
          </div>
          <div style={{ flex: 1 }}>
            <div className="announcement-field">
              <span className="field-label">From:</span>
              <span className="field-value">{from}</span>
            </div>
            <div className="announcement-field">
              <span className="field-label">To:</span>
              <span className="field-value">{type}</span>
            </div>
            {sType == 1 && (
              <div className="announcement-field">
                <span className="field-label">CC:</span>
                <span className="field-value">{CC}</span>
              </div>
            )}
            <div
              className="announcement-field"
              style={{ justifyContent: "space-between" }}
            >
              <span>
                <span className="field-label">Subject:</span>
                <span className="field-value">{subject}</span>
              </span>
              <span className="field-label-2">{announcedWhen}</span>
            </div>
            <div
              className="announcement-field"
              style={{ margin: "25px 0 10px 0" }}
            >
              <span className="field-label">Attachments:</span>
              <span className="field-value">{renderAttachments(filePath)}</span>
            </div>
          </div>
        </div>
        <div
          className="divMessage"
          dangerouslySetInnerHTML={{ __html: announcementMsg }}
        ></div>
      </div>
    </div>
  );
};

export default ViewAnnouncement;
