window.addEventListener("load",()=>{
	const input = document.getElementById('upload')
	const filewrapper = document.getElementById('filewrapper')
	const fileOutput = document.getElementById("fileOutput");
	const slectDropdown = document.getElementById("slectDropdown");
	const selectedOption = document.getElementById("selectedOption")
	const textarea = document.createElement('textarea');
	const sendQuery = document.createElement('button');
	sendQuery.innerHTML = "Send Query"
	
	slectDropdown.addEventListener("change", (e) => {
		selectedOption.innerHTML = e.target.value;
	})
	input.addEventListener("change",(e)=>{
		//let fileName = e.target.files[0].name;
		let files = e.target.files;
		//let filetype = e.target.value.split(".").pop();
		console.log('details',files)
		for(let i=0;i<files.length;i++){
			let fileName = e.target.files[i].name;
			let fileExtension = e.target.files[i].name.split(".").pop();
			let fileType = e.target.files[i].type;
			let file = e.target.files[i];
			fileshow(fileName, fileExtension)
			renderFile(fileType, file)
		}
		//fileshow(fileName, filetype)
	})
	const renderFile = (fileType,file) => {
		if (fileType === 'application/pdf') {
        readPDF(file).then(function(text) {
			fileOutput.textContent = text;
			if(text){
				fileOutput.classList.add('customStyle')
				fileOutput.appendChild(textarea)
				fileOutput.appendChild(sendQuery)
				textarea.value='"'+ text + '"' + "is suitable for the role " + slectDropdown.value
			}
            console.log(text);
            // Prompt or process the text here
        }).catch(function(error) {
            console.error(error);
        });
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        readWord(file).then(function(text) {
			fileOutput.textContent = text
			if(text){
				fileOutput.classList.add('customStyle')
				fileOutput.appendChild(textarea)
				fileOutput.appendChild(sendQuery)
				textarea.value='"'+ text + '"' + 'is suitable for the role ' + slectDropdown.value
			}
            console.log('text',text);
			
            // Prompt or process the text here
        }).catch(function(error) {
            console.error(error);
        });
    } 
	else if (fileType === 'text/plain') {
		var fileReader=new FileReader();

   fileReader.onload=function(){

      fileOutput.textContent=fileReader.result;
	fileOutput.appendChild(textarea)
	textarea.value='"'+ fileReader.result + '"' + " is suitable for the role " + slectDropdown.value
	fileOutput.appendChild(sendQuery)
   }
   fileReader.readAsText(file);
	if(file){
				fileOutput.classList.add('customStyle')
			}
   
	}
	else {
        alert('Unsupported file type');
    }
	}
	const fileshow = (fileName, filetype) => {
		console.log('Hello',fileName, filetype)
		const showfileboxElem = document.createElement("div");
		showfileboxElem.classList.add('showfilebox');
		const leftElem = document.createElement("div");
		leftElem.classList.add('left');
		const fileTypeElem = document.createElement("span");
		fileTypeElem.classList.add('filetype');
		fileTypeElem.innerHTML = filetype;
		leftElem.append(fileTypeElem);
		const filetitleElem = document.createElement("h3");
		filetitleElem.innerHTML = fileName;
		leftElem.append(filetitleElem);
		showfileboxElem.append(leftElem);
		const rightElem = document.createElement("div");
		rightElem.classList.add("right");
		showfileboxElem.append(rightElem);
		const crossElem =  document.createElement("span");
		crossElem.innerHTML = "&#215;";
		rightElem.append(crossElem);
		filewrapper.append(showfileboxElem);
		
		crossElem.addEventListener("click",() => {
			filewrapper.removeChild(showfileboxElem);
			fileOutput.innerHTML="";
			fileOutput.classList.remove('customStyle')
		})
	}
})

function readWord(file) {
    return new Promise((resolve, reject) => {
        mammoth.extractRawText({arrayBuffer: file}).then(function(result){
            resolve(result.value);
        }).catch(reject);
    });
}


  function readPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event) {
            const typedArray = new Uint8Array(event.target.result);
            pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
                let fullText = '';
                const numPages = pdf.numPages;
                const promises = [];
                for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                    promises.push(pdf.getPage(pageNum).then(function(page) {
                        return page.getTextContent().then(function(textContent) {
                            const textItems = textContent.items;
                            let pageText = '';
                            for (let i = 0; i < textItems.length; i++) {
                                pageText += textItems[i].str + ' ';
                            }
                            return pageText;
                        });
                    }));
                }
                Promise.all(promises).then(function(pageTexts) {
                    resolve(pageTexts.join('\n'));
                });
            }, reject);
        };

        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
    });
}