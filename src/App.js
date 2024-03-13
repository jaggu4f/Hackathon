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
      {/* <!-- Widget JavaScript bundle --> */}
      {/* <!-- Search widget element is not visible by default --> */}
      <gen-search-widget
        configId="bbea664c-cc7e-4da3-b912-afa2a71e88d2"
        triggerId="searchWidgetTrigger">
      </gen-search-widget>
      {/* <!-- Element that opens the widget on click. It does not have to be an input --> */}
      <input placeholder="Search here" id="searchWidgetTrigger" className="inputSearch" />
      <div className="wrapper">
      <div className="box">
        <div className="input-box">
          <h2 className="upload-area-title">Upload File</h2>
            <form action="" onSubmit={handleSubmit}>
              <input type="file" name="file" id="upload" accept=".doc,.docx,.pdf,.txt" onChange={handleFileChange} multiple hidden/>
              <label htmlFor="upload" className="uploadlabel">
                <span><i className="fa fa-cloud-upload"></i></span>
                <p>Click here</p>
                <button className="submitBtn" type="submit">Upload</button>
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
