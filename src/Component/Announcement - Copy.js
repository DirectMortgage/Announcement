import { useState } from "react";
import { handleAPI } from "./CommonFunctions";

const Announcement = (props) => {
  const { UserId, SessionId } = props;
  const [announcementDetails, setAnnouncementDetails] = useState({
    AnnouncementMsg: "",
    AnnouncedType: "1", // Default value for the radio button
    Subject: "",
  });
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const sendfiletoDatabase = async (files) => {
    files.forEach(async (file) => {
      let formData = new FormData();
      formData.append("", file);

      let requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      await handleAPI({
        name: "UploadFilesdocs",
        params: {},
        requestOptions: requestOptions,
      })
        .then((response) => {})
        .catch((e) => console.error("Error form UploadFilesdocs ====> ", e));
    });
  };
  const onChangeField = (event) => {
    const { name, value } = event.target;
    setAnnouncementDetails((prevAnnouncementDetails) => {
      return { ...prevAnnouncementDetails, [name]: value };
    });
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    setAnnouncementDetails((prevAnnouncementDetails) => {
      return { ...prevAnnouncementDetails, AnnouncedType: value };
    });
  };

  const postAnnouncement = () => {
    setProcessingStatus("Posting..");
    const { Subject, AnnouncementMsg, AnnouncedType, files } =
      announcementDetails;
    const Filepath = files.map(({ name }) => name).join(",");
    handleAPI({
      name: "PostAnnouncement",
      params: {
        AnnouncementMsg,
        AnnouncedBy: UserId,
        AnnouncedType,
        Filepath,
        Subject,
      },
    })
      .then((response) => {
        setSuccessMessageVisible(true);
      })
      .catch((err) => console.error("Error from PostAnnouncement ====> ", err));
    setSuccessMessageVisible(false);
  };
  const closeAnnouncement = () => {
    // Reset the state or navigate away, depending on your needs
    setAnnouncementDetails({
      AnnouncementMsg: "",
      AnnouncedType: "1",
      Subject: "",
      files: [],
    });
    setSuccessMessageVisible(false);
  };
  const handleViewClick = (UserId) => {
    var url =
      "https://www.solutioncenter.biz/DWAnnouncements/index.html?Id=" +
      UserId +
      "&Type=PA&SessionId=" +
      SessionId;
    window.open(
      url,
      "_blank",
      "height=" + 900 + "px,width=" + 900 + "px,resizable=1,scrollbars=yes"
    );
  };

  return (
    <div
      className="col-xs-12 col-sm-12 col-md-12 col-lg-12 container-wrapper"
      id="div2"
      style={{ width: "100%", justifyContent: "center", display: "flex" }}
    >
      <div className="divContainer card-1">
        <div className="Container-Header">
          <div className="Container-Title">Add new Announcement</div>
        </div>
        <div className="Container-Body">
          <div style={{ minWidth: "450px", width: "50%" }}>
            <span className="spnmsg">Subject</span>
            <br />
            <input
              type="text"
              id="txtsubject"
              name="Subject"
              style={{
                width: "100%",
                backgroundColor: "white",
                border: "1px gray solid",
                borderRadius: "0px",
                height: "30px",
              }}
              onChange={onChangeField}
              value={announcementDetails.Subject}
            ></input>
            <br />
            <br />
            <span className="spnmsg">Please enter your message below</span>
            <br />
            <textarea
              id="message"
              name="AnnouncementMsg"
              rows="10"
              cols="50"
              placeholder=""
              style={{
                width: "100%",
                backgroundColor: "white",
                border: "1px gray solid",
                borderRadius: "0px",
              }}
              onChange={onChangeField}
              value={announcementDetails.AnnouncementMsg}
            ></textarea>
            <br />
            <br />
            <input
              type="file"
              id="fileupload"
              multiple
              onChange={(event) => {
                var uploadedfiles = Array.from(event.target.files);
                sendfiletoDatabase(uploadedfiles);
                onChangeField({
                  target: { name: "files", value: uploadedfiles },
                });
              }}
              name="files"
              style={{ display: "none" }}
            />
            <label for="fileupload" id="btnAttachfile">
              Attach File
            </label>
            {(announcementDetails.files || []).length > 0 && (
              <div className="clsfilename">
                {announcementDetails.files.map(({ name }) => {
                  return <div>{name}</div>;
                })}
              </div>
            )}
            <br />
            <span id="spnwhointented">Who is this message intended for?</span>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="AnnouncedType"
                  value="2"
                  checked={announcementDetails.AnnouncedType === "2"}
                  onChange={handleRadioChange}
                />{" "}
                Internal Users
              </label>
              <label>
                <input
                  type="radio"
                  name="AnnouncedType"
                  value="1"
                  checked={announcementDetails.AnnouncedType === "1"}
                  onChange={handleRadioChange}
                />{" "}
                All Users
              </label>
            </div>
            <div className="footerButtonContainer">
              <button type="button" id="btnNext" onClick={postAnnouncement}>
                Post Message
              </button>
              <br />
            </div>
            <br />
            {successMessageVisible && (
              <span id="spnmsg">Announcement Posted Successfully</span>
            )}
            <br />
            <br />
            <a
              href="#"
              style={{ cursor: "pointer", color: "#5b8bc8" }}
              onClick={() => handleViewClick(UserId)}
            >
              View Previous Announcements
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
