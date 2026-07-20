import React, {useState, PureComponent} from 'react';
import * as XLSX from "xlsx";
import DataTable from 'react-data-table-component';
import './design.css'
import { Document, Text, Page, StyleSheet, View } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import Checkbox from '@material-ui/core/Checkbox';

// import { DataGrid } from '@mui/x-data-grid'

// {
// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// const doc = new PDFDocument({
//   layout: 'landscape',
//   size: 'A4',
// });

// // Helper to move to next line
// function jumpLine(doc, lines) {
//   for (let index = 0; index < lines; index++) {
//     doc.moveDown();
//   }
// }

// doc.pipe(fs.createWriteStream('output.pdf'));

// doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

// doc.fontSize(10);

// // Margin
// const distanceMargin = 18;

// doc
//   .fillAndStroke('#0e8cc3')
//   .lineWidth(20)
//   .lineJoin('round')
//   .rect(
//     distanceMargin,
//     distanceMargin,
//     doc.page.width - distanceMargin * 2,
//     doc.page.height - distanceMargin * 2,
//   )
//   .stroke();

// // Header
// const maxWidth = 140;
// const maxHeight = 70;

// doc.image('assets/winners.png', doc.page.width / 2 - maxWidth / 2, 60, {
//   fit: [maxWidth, maxHeight],
//   align: 'center',
// });

// jumpLine(doc, 5)

// doc
//   .font('fonts/NotoSansJP-Light.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Super Course for Awesomes', {
//     align: 'center',
//   });

// jumpLine(doc, 2)

// // Content
// doc
//   .font('fonts/NotoSansJP-Regular.otf')
//   .fontSize(16)
//   .fill('#021c27')
//   .text('CERTIFICATE OF COMPLETION', {
//     align: 'center',
//   });

// jumpLine(doc, 1)

// doc
//   .font('fonts/NotoSansJP-Light.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Present to', {
//     align: 'center',
//   });

// jumpLine(doc, 2)

// doc
//   .font('fonts/NotoSansJP-Bold.otf')
//   .fontSize(24)
//   .fill('#021c27')
//   .text('STUDENT NAME', {
//     align: 'center',
//   });

// jumpLine(doc, 1)

// doc
//   .font('fonts/NotoSansJP-Light.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Successfully completed the Super Course for Awesomes.', {
//     align: 'center',
//   });

// jumpLine(doc, 7)

// doc.lineWidth(1);

// // Signatures
// const lineSize = 174;
// const signatureHeight = 390;

// doc.fillAndStroke('#021c27');
// doc.strokeOpacity(0.2);

// const startLine1 = 128;
// const endLine1 = 128 + lineSize;
// doc
//   .moveTo(startLine1, signatureHeight)
//   .lineTo(endLine1, signatureHeight)
//   .stroke();

// const startLine2 = endLine1 + 32;
// const endLine2 = startLine2 + lineSize;
// doc
//   .moveTo(startLine2, signatureHeight)
//   .lineTo(endLine2, signatureHeight)
//   .stroke();

// const startLine3 = endLine2 + 32;
// const endLine3 = startLine3 + lineSize;
// doc
//   .moveTo(startLine3, signatureHeight)
//   .lineTo(endLine3, signatureHeight)
//   .stroke();

// doc
//   .font('fonts/NotoSansJP-Bold.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('John Doe', startLine1, signatureHeight + 10, {
//     columns: 1,
//     columnGap: 0,
//     height: 40,
//     width: lineSize,
//     align: 'center',
//   });

// doc
//   .font('fonts/NotoSansJP-Light.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Associate Professor', startLine1, signatureHeight + 25, {
//     columns: 1,
//     columnGap: 0,
//     height: 40,
//     width: lineSize,
//     align: 'center',
//   });

// doc
//   .font('fonts/NotoSansJP-Bold.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Student Name', startLine2, signatureHeight + 10, {
//     columns: 1,
//     columnGap: 0,
//     height: 40,
//     width: lineSize,
//     align: 'center',
//   });

// doc
//   .font('fonts/NotoSansJP-Light.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Student', startLine2, signatureHeight + 25, {
//     columns: 1,
//     columnGap: 0,
//     height: 40,
//     width: lineSize,
//     align: 'center',
//   });

// doc
//   .font('fonts/NotoSansJP-Bold.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Jane Doe', startLine3, signatureHeight + 10, {
//     columns: 1,
//     columnGap: 0,
//     height: 40,
//     width: lineSize,
//     align: 'center',
//   });

// doc
//   .font('fonts/NotoSansJP-Light.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text('Director', startLine3, signatureHeight + 25, {
//     columns: 1,
//     columnGap: 0,
//     height: 40,
//     width: lineSize,
//     align: 'center',
//   });

// jumpLine(doc, 4);

// // Validation link
// const link =
//   'https://validate-your-certificate.hello/validation-code-here';

// const linkWidth = doc.widthOfString(link);
// const linkHeight = doc.currentLineHeight();

// doc
//   .underline(
//     doc.page.width / 2 - linkWidth / 2,
//     448,
//     linkWidth,
//     linkHeight,
//     { color: '#021c27' },
//   )
//   .link(
//     doc.page.width / 2 - linkWidth / 2,
//     448,
//     linkWidth,
//     linkHeight,
//     link,
//   );

// doc
//   .font('fonts/NotoSansJP-Light.otf')
//   .fontSize(10)
//   .fill('#021c27')
//   .text(
//     link,
//     doc.page.width / 2 - linkWidth / 2,
//     448,
//     linkWidth,
//     linkHeight
//   );

// // Footer
// const bottomHeight = doc.page.height - 100;

// doc.image('assets/qr.png', doc.page.width / 2 - 30, bottomHeight, {
//   fit: [60, 60],
// });

// doc.end();
// }

function dashboard_analysis() {
  const [selectedData, setSelectedData] = React.useState([]);
const [postContent, setPostContent] = useState("")
const [isChecked, setIsChecked] = useState(false)
const [data_finals, setData] = useState([]);
const [name, setName] = useState("");
//   const pdfGenerator = require('pdfkit')
//   const fs = require('fs')

// // instantiate the library
// let theOutput = new PDFGenerator 

// // pipe to a writable stream which would save the result into the same directory
// theOutput.pipe(fs.createWriteStream('TestDocument.pdf'))

// // write out file
// theOutput.end()
  const styles = StyleSheet.create({
    page: {
        marginTop: 30,
        fontSize: 30,
        padding: 20,
    },
    layout: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
  const conditionalRowStyles = [
    {
      when: row => row.Calculated_Percentage >= 20,
      style: {
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    // You can also pass a callback to style for additional customization
  ];
  
  console.table(selectedData,["Image","Calculated_Percentage"]);
  const handleChange = (state) => {
    setSelectedData(state.selectedRows);
    
  };
    // const reader = require('xlsx');
    // const file = reader.readFile('C:/Users/deepm/Desktop/data_read.xlsx');
    // let data = []
    // const sheets = file.SheetNames
    // for(let i = 0; i < sheets.length; i++)
    // {
    // const temp = reader.utils.sheet_to_json(
    //       file.Sheets[file.SheetNames[i]])
    // temp.forEach((res) => {
    //     data.push(res)
    // })
    // }
    // console.log(data)
    
    const columns = [
    {
      name: 'Name',
      id: 'Image',
      selector:row =>row.Image,  
      minWidth: "40px",
      sortable: true,
      wrap: true,
    },
    {
      name: 'Calculated Percentage',
      id:'calculated_percentage',
      selector:row =>row.Calculated_Percentage,
      sortable: true,
    },
  ]
  const downloadTxtFile = () => {
    // text content
    const texts = ["line 1", "line 2", "line 3"]
    // file object
    const file = new Blob(pdf_view, {type: 'text/plain'});
    // anchor link
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "100ideas-" + Date.now() + ".txt";
    // simulate link click
    document.body.appendChild(element);
    // document.body.appendChild(data_finals);

    // Required for this to work in FireFox
    element.click();
}

  
  const checkHandler = () => {
      setIsChecked(!isChecked)
    }
  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {type:"binary"});
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parseData = XLSX.utils.sheet_to_json(sheet);
      // data_chart=console.log({parseData});
      setData(parseData);
    };
    const DataGrid = (data_finals)
    // console.log(data_finals)
    
  }
  
    return (
      <div className="App">
        <input  
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        />
        <div className='all'>
          <div className='table_layout'>
          <DataTable 
            columns = {columns}
            data = {data_finals}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows
            onSelectedRowsChange={handleChange}
            fixedHeader
            fixedHeaderScrollHeight="300px">          
          </DataTable>  
          {/* {selectedData[0] ? selectedData[0].name : ''}    */}
          </div>
          
            {/* {columns} */}
            <ResponsiveContainer height='100%' width='100%'>
            <div className='chart_layout'  >
            <LineChart className='line_graph' width={1000} height={350} data={selectedData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Legend />
                <Line dataKey="Calculated_Percentage" stroke="#0095FF" />
              <XAxis dataKey="Image" interval={0} letterSpacing={0} tickLine={false} tick={{ angle: 0, textAnchor: 'start', 'dominantBaseline': 'ideographic' }}/>
              <YAxis />
              <Tooltip />
              <Brush />
            </LineChart>
            </div >
            </ResponsiveContainer>
            {/* <table className="files-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Calculated Percentage</th>
                <th>{data_finals.length}</th>
              </tr>
            </thead>
            <tbody>
              {data_finals.length > 0 ? (
                data_finals.map(
                  ({
                    Image,
                    Calculated_Percentage,
                  }) => (
                    <tr>
                      <td className="Name">{Image}</td>
                      <td className="Calculated Percentage">{Calculated_Percentage}</td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={3} style={{ fontWeight: "300" }}>
                    No files found. Please add some.
                  </td>
                </tr>
              )}
            </tbody>
          </table> */}
          
          <div className='pdf_view' id='pdf_view'>
          {/* <PDFViewer > */}
            {/* <MyDocument /> */}
            <Page style={styles.page}>
            <View style={styles.layout}>
              <View>
                <Text>Hello There</Text>
              </View>
              <View>
                <Text>Welcome!!!</Text>
                <img src="C:\Users\deepm\Desktop\new_argus\Argus 1.21 Front August 16,2023\logo.png"  />
              </View>
            {/* </View> */}
            {/* </Page> */}
            {/* <Page className='page_layout'> */}
            {/* <View className='view_page'> */}
            {/* <Text>Section #1</Text> */}
            <table className="files-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Calculated Percentage</th>
                {/* <th>{selectedData.length}</th> */}
              </tr>
            </thead>
            <tbody>
              {data_finals.length > 0 ?(
                <tr>
                  <td colSpan={3} style={{ fontWeight: "300" }}>
                   files found. Please add some.
                  </td>
                </tr>
              ):(
                data_finals.map(
                  ({
                    Image,
                    Calculated_Percentage,
                  }) => (
                    <tr>
                      <td className="Name">{Image}</td>
                      <td className="Calculated Percentage">{Calculated_Percentage}</td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
          </View>
          </Page>
          
          {/* <Checkbox label="Subscribe to newsletter?" /> */}
          
          {/* </PDFViewer> */}
          <p></p>
          <p></p>
          <p></p>
          <p>{isChecked ? "Note:" +  postContent : ""} </p>
          
          {/* <label>Enter your name:
            <input
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label> */}
          {/* <textarea
              value={textareaContent}
              onChange={(e) => setName(e.target.value)}
            ></textarea>
            <button onClick={downloadText}>Download Text</button> */}
          </div>
          <label className='add_note'>
          <input
          type="checkbox"
          id="checkbox"
          checked={isChecked}
          onChange={checkHandler}/>Add note to your document:
            <textarea className='note_section'
              name="postContent"
              onChange={e => setPostContent(e.target.value)}
            />
          </label>
          <div className="btnDiv">
            <button id="downloadBtn" onClick={downloadTxtFile} value="download">Download</button>
          </div>      
        </div>
      </div>
    );
  }

export {dashboard_analysis};

