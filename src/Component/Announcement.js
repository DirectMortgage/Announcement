import { useState } from "react";
import { handleAPI, handleSaveWindowSize } from "./CommonFunctions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useEffect } from "react";

const Announcement = (props) => {
  const { UserId, SessionId, Type } = props;
  const [announcementDetails, setAnnouncementDetails] = useState({
    AnnouncementMsg: "",
    AnnouncedType: "1", // Default value for the radio button
    Subject: "",
    files: [], // Added this to handle files
  });
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  useEffect(() => {
    document.title = "Add New Announcement";
  }, []);
  const sendFileToDatabase = async (files) => {
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

  const handleEditorChange = (content) => {
    setAnnouncementDetails((prevAnnouncementDetails) => {
      return { ...prevAnnouncementDetails, AnnouncementMsg: content };
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
    setAnnouncementDetails({
      AnnouncementMsg: "",
      AnnouncedType: "1",
      Subject: "",
      files: [],
    });
    setSuccessMessageVisible(false);
  };

  const handleViewClick = async (UserId) => {
    const windowPosition = await handleSaveWindowSize({
      Type: "PA",
      SessionId,
      Flag: 0,
    });

    const positionData = JSON.parse(
      JSON.parse(windowPosition)["Table"][0].Column1
    );
    const width = positionData["Width"];
    const height = positionData["Height"];
    const currentView = positionData["CurrentView"];

    // console.log(positionData);
    // console.log(width + "//" + height + "//" + currentView);

    let url =
      "https://www.solutioncenter.biz/DWAnnouncements/index.html?Id=" +
      UserId +
      "&Type=PA&SessionId=" +
      SessionId;

    window.open(
      url,
      "_blank",
      `height=${height}px,width=${width}px,resizable=1,scrollbars=yes`
    );
  };

  const renderAttachments = (filePath) => {
    if (!filePath) return null;
    return filePath.split(",").map((file, index) => (
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        key={index}
        style={{ display: "block" }}
      >
        {file.split("/").pop()}
      </a>
    ));
  };
  const RemoveIcon = ({ onClick = () => {}, size = 20 }) => {
    return (
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAbCAYAAABiFp9rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOdSURBVHgB7VY9aBRBFJ6Zvdud+zHkRGNOQ0SMIilEPSxCVIJgJSFaJLEwP/iDomApqAmJGhvTqIX4U2gkjSTBYEgpKCJIlESjHpFrLCKoJ0bM7+7d7vje3azMbS5HChvBBx8zO/PNfO/tznuzhPy3v2kdHR0MGpYIBrdji2NCCJqPi+PIf+v375BcKlHQkKjFYjH/BOeXEpyLd5wfhTGfnFMNN2P19fUacI8g9yPnF2tqajJccGBJkczCyspK/T3nXbjQxRjnx2FOlxu4HqMwco+p3Djnl2Hcjw4TJTJNjQYi0a4nErGVhPSoHoBCbauuT95Jpcbj8TgpKSlhwWBQezI93cIJuatyYcM9Bykd7nGcL/DoqFGorw3DDjw1jOZ1lN7whvxLiBMx03xQVlZGh5LJpjClt72cz0KcqTHN+9A1AWlXzCvkj0QifGpqKjhkGIe3UHrVu9F3IU7ha4hQetM7N0Hp2UZKe+fA4HEBkFpKCCMyAEFAqE/XD21j7ApZhr1xnAv1lvUQurMSphTKnAotzxpWVFTE0AYISVQJ8TVK6d5CImOEtDWY5oCMAgUsgE2Ub6QKudEJ0zRpOp0Wtm2zPttO7GJsSbFRx2lvJqQfuCgyj2JwclPJZNJ2o8l4r6wR0gNbeoVY4JxbPsWzReFn51LhcDgjgn04mTnReIVUQxKemPSwEHVbC3wn/IaPGaubmZlJw2nENTbk2iLHaH4nM+P6iGG05jtd+eybEKerTfMeyX4fFBKFhNys942BSL48eeE4XdhWM9bmnfspxMmd2RxKe8W8rw5LkG+c85Z8IiOEdLZa1iDg0YjjdHrniym99QochArDoNDmFFdvHrHngUCsVIiX3k1GCWlvcpxB9NayLKrrOusl5MB2xrq83E+2XbUvlXotI/uzeU5Eu+fn4z+E6M4RgSPcuLDQDwKziEAgMA1pNtdgWf2YQyoX14LIB1LgukBRrApFgOgzw7iG1Riqw3l43gwohyNcAu1KCeyXG4axaUDXzyEX14RCoVK5h15ICCdX4IaQP+u7Na0WNtoIY2WA1TgHCACgaJMwYBXOAXcDcPdDWy4dQJ6fFLgA/dFoFOtcMWANXAVrsZURrJCO+PCykxuFABHJKZUixdKZnPJGPf3M0ZbQZJR4RNMKhMLXvFxM2snJSZdLiCefsiPZ29Ot4npFRYXhRiH/I3KcRL4SnUHy3KwFTRFc1s+Gy5fOLOvn5N+339VLWdnMAWKYAAAAAElFTkSuQmCC"
        className="close-img"
        alt="Remove"
        width={`${size}px`}
        height={`${size}px`}
        onClick={onClick}
      ></img>
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
          <div style={{ minWidth: "850px", width: "50%" }}>
            <span className="spnMsg">Subject</span>
            <br />
            <input
              type="text"
              id="txtSubject"
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
            <span className="spnMsg">Please enter your message below</span>
            <br />
            <SunEditor
              name="AnnouncementMsg"
              onChange={handleEditorChange}
              setContents={announcementDetails.AnnouncementMsg}
              height="600px"
              setOptions={{
                buttonList: [
                  ["undo", "redo"],
                  ["font", "fontSize", "formatBlock"],
                  ["paragraphStyle", "blockquote"],
                  [
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "subscript",
                    "superscript",
                  ],
                  ["fontColor", "hiliteColor", "textStyle"],
                  ["removeFormat"],
                  ["outdent", "indent"],
                  ["align", "horizontalRule", "list", "lineHeight"],
                  ["table", "link", "image", "video"],
                  ["fullScreen", "showBlocks", "codeView"],
                  ["preview"],
                  ["save"],
                ],
              }}
            />
            <br />
            <br />
            <input
              type="file"
              id="fileUpload"
              multiple
              onChange={(event) => {
                var uploadedFiles = Array.from(event.target.files);
                sendFileToDatabase(uploadedFiles);
                onChangeField({
                  target: { name: "files", value: uploadedFiles },
                });
              }}
              name="files"
              style={{ display: "none" }}
            />
            <label htmlFor="fileUpload" id="btnAttachFile">
              Attach File
            </label>
            {(announcementDetails?.files || []).length > 0 && (
              <div className="clsFilename">
                {announcementDetails.files.map(({ name }, index) => {
                  {
                    return (
                      <div key={name} className="clsFileList">
                        <a
                          style={{ marginRight: 5 }}
                          href="#"
                          onClick={() => {
                            window.open(
                              "../../../PDF/tempAnnouncement/" + name,
                              "_blank",
                              "_blank"
                            );
                          }}
                        >
                          {name}
                        </a>
                        <RemoveIcon
                          onClick={() => {
                            setAnnouncementDetails(
                              (prevAnnouncementDetails) => {
                                let { files } = prevAnnouncementDetails;
                                files.splice(index, 1);
                                prevAnnouncementDetails.files = files;
                                return { ...prevAnnouncementDetails };
                              }
                            );
                          }}
                        />
                      </div>
                    );
                  }
                })}
              </div>
            )}
            <br />
            <span id="spnWhoIntended">Who is this message intended for?</span>
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
              <span id="spnMessage">Announcement Posted Successfully</span>
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
