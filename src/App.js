import React, {useState} from 'react'
import './App.css';

function App() {
const [renderContent, setRenderContent] = useState(null)
const [filesList, setFilesList] = useState(null)
const [selectedOption, setSelectedOption] = useState(null)

const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", file.data);
  //   let blob = file.data.slice(0, file.size, "image/jpeg");
  // let newFile = new File([blob], `hello.jpeg`, { type: "image/jpeg" });
  // Build the form data - You can add other input values to this i.e descriptions, make sure img is appended last
  // formData.append("file", formData);
    fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((resp)=>console.log('result',resp))
  };
  
  const renderFile = (fileType,file) => {
    if (fileType === 'text/plain') {
      let fileReader = new FileReader();
      fileReader.onload=function(){
      setRenderContent(fileReader.result)
     }
     fileReader.readAsText(file);
    }
    else {
          alert('Unsupported file type');
      }
  }
  const handleFileChange = e => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setFile(img);
		let files = e.target.files;
    setFilesList(Array.from(files))
		console.log('details',files)
		for(let i=0;i<files.length;i++){
			let fileName = e.target.files[i].name;
			let fileExtension = e.target.files[i].name.split(".").pop();
			let fileType = e.target.files[i].type;
			let file = e.target.files[i];
			renderFile(fileType, file)
		}
  }
  const handleRemoveFile = item => {
    let result = filesList.filter(ele => ele.name !== item.name);
    setFilesList(result)
    setRenderContent(null)
  }
  return (
    <div className="container">
      <div className="wrapper">
        {/* <div className="box">
          <div className="input-box">
            <h2 className="upload-area-title">Select Role</h2>
            <div className="custom-select" >
              <select id="slectDropdown" onChange={(event) =>setSelectedOption(event.target.value)}>
                <option value="">-Select-</option>
                <option value="Finance">Finance</option>
                <option value="FED">FED</option>
                <option value="BED">BED</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
            <div className="filewrappercontainer">
              <h3 className="uploaded">Seleted Option</h3>
              <div id="selectedOption" className="filewrapper">
                {selectedOption}
            </div>
        </div>
      </div> */}
      <div className="box">
        <div className="input-box">
          <h2 className="upload-area-title">Upload File</h2>
            <form action="" onSubmit={handleSubmit}>
              <input type="file" name="file" id="upload" accept=".doc,.docx,.pdf,.txt" onChange={handleFileChange} multiple hidden/>
              <label htmlFor="upload" className="uploadlabel">
                <span><i className="fa fa-cloud-upload"></i></span>
                <p>Click to Upload</p>
                <button className="submitBtn" type="submit">Submit</button>
              </label>
            </form>
          </div>
          <div className="filewrappercontainer">
          <h3 className="uploaded">Uploaded Documents</h3>
          <div id="filewrapper" className="filewrapper">
            {filesList?.length > 0 && filesList?.map((item, index) => {
              let fileExtension = item.name.split(".").pop()
              return (
                <div className="showfilebox" key={`box-${index}`}>
                  <div className='left'>
                    <span className='filetype'>{fileExtension}</span>
                    <h3>{item.name}</h3>
                  </div>
                  <div className='right' onClick={() => handleRemoveFile(item)}>
                    <span>&#215;</span>
                  </div>
                </div>
              )
            })}
          </div>
      </div>
    </div>
  </div>
  {/* <div id="fileOutput" className={renderContent ? `customStyle fileOutput`:`fileOutput`}>
    {renderContent}
    {renderContent && <><textarea>{`"${renderContent}" is suitable for the role ${selectedOption} ?`}</textarea>
    <button>Send Query</button></>}
  </div> */}
</div>
  );
}

export default App;
