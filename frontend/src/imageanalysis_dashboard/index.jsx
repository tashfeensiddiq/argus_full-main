import React, { useState, PureComponent, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import DataTable, { createTheme } from "react-data-table-component";
import "./design.css";
import { useLocation, useHistory } from "react-router-dom";
import {
 Document,
 Text,
 Page,
 StyleSheet,
 View,
 PDFViewer,
} from "@react-pdf/renderer";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import {
 Line,
 XAxis,
 YAxis,
 Tooltip,
 Cell,
 Legend,
 ResponsiveContainer,
 Brush,
 ComposedChart,
 Scatter,
 BarChart,
 Bar,
 Label,
} from "recharts";
import logo from "../logo.png";
import { GoogleGenerativeAI } from "@google/generative-ai";


function dashboard_analysis() {
 function add_chart_pdf() {
   return;
 }
 const styles = StyleSheet.create({
   page: {
     flexDirection: "row",
     // backgroundColor: '#E4E4E4'
   },
   section: {
     margin: 10,
     padding: 10,
     flexGrow: 1,
   },
 });
 function generate_pdf() {
   return;
 }


 const current = new Date();
 const date = `${current.getDate()}/${
   current.getMonth() + 1
 }/${current.getFullYear()}`;
 const [selectedData, setSelectedData] = React.useState([]);
 const [postContent, setPostContent] = useState("");
 const [postCompay, setPostCompany] = useState("qualITEAS inc.");
 const [postName, setPostName] = useState("qualITEAS inc.");
 const [postTitle, setPostTitle] = useState("Corrosion Analysis report");
 const [isChecked, setIsChecked] = useState(false);
 const [isChecked_chart, setIsChecked_chart] = useState(false);
 const [isChecked_table, setIsChecked_table] = useState(false);
 const [data_finals, setData] = useState([]);
 const [report, setReport] = useState(generate_pdf());
 const location = useLocation();
 const history = useHistory();
 const [chart_type, setchart] = useState("Bar_Chart");
 const [records, setRecords] = useState(data_finals);
 const [orirecords, setoriRecords] = useState();
 const [records_name, setRecords_name] = useState(data_finals);
 const [pngBlob, setPngBlob] = useState(null);
 const genAI = new GoogleGenerativeAI(
   "AIzaSyAZjPGeGA5IFpAECBJRCIbPgwCvtbxP_as"
 );


 const onOptionChange = (e) => {
   setchart(e.target.value);
 };
 const pdfRef = useRef();
 var chart_add = false;


 const captureElementToPng = async (elementId) => {
   try {
     const element = document.getElementById(elementId);
     if (!element) {
       throw new Error("Element not found");
     }


     const canvas = await html2canvas(element, {
       scale: 1, // Adjust the scale for better resolution
       useCORS: true, // This is important if your content includes images from external sources
     });


     // Convert the canvas to a blob
     return new Promise((resolve, reject) => {
       canvas.toBlob((blob) => {
         if (blob) {
           resolve(blob);
         } else {
           reject(new Error("Failed to convert canvas to blob"));
         }
       }, "image/png");
     });
   } catch (error) {
     console.error("Error capturing element as PNG:", error);
     throw error; // Re-throw the error if needed
   }
 };


 const handleCaptureClick = () => {
   captureElementToPng("innerdiv")
     .then((blob) => {
       setPngBlob(blob);
       console.log("PNG Blob is ready:", blob);
       // Handle the blob further here (e.g., send it via API or process it)
     })
     .catch((error) => {
       console.error("Failed to capture PNG:", error);
     });
 };


 const downloadImage = () => {
   if (!pngBlob) {
     alert("Please capture the image first.");
     return;
   }
   // Create a URL for the blob
   const url = URL.createObjectURL(pngBlob);
   const link = document.createElement("a");
   link.href = url;
   link.download = "captured-content.png"; // Name of the file to be downloaded
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   URL.revokeObjectURL(url); // Clean up
 };


 async function fileToGenerativePart(file) {
   const base64EncodedDataPromise = new Promise((resolve) => {
     const reader = new FileReader();
     reader.onloadend = () => resolve(reader.result.split(",")[1]);
     reader.readAsDataURL(file);
   });
   return {
     inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
   };
 }


 async function aiImageRun() {
   if (!pngBlob) {
     alert("Please capture the image first.");
     return;
   }


   try {
     // const base64Image = await blobToBase64(pngBlob);
     const imageInlineData = await fileToGenerativePart(pngBlob);


     const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
     const promt = "What's in this photo?";
     const result = await model.generateContent([promt, imageInlineData]);
     const response = await result.response;
     const text = await response.text();
     console.log(text);
     setPostContent(text); // Displaying the AI result in the Note section
   } catch (error) {
     console.error("Error in AI image analysis:", error);
     alert("Failed to analyze image.");
   }
 }


 const downloadPdfDocument = () => {
   // console.log("inside download");\
   var element = document.getElementById("innerdiv");
   var opt = {
     margin: [15, 15, 15, 15],
     filename: "report.pdf",
     image: { type: "jpeg", quality: 0.98 },
     html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
     jsPDF: { unit: "mm", format: "a4", orientation: "p" },
     pagebreak: { mode: "css", after: [".files_table"] },
     // before: ['.date_text_header']
   };


   html2pdf()
     .from(element)
     .set(opt)
     .toPdf()
     .get("pdf")
     .then(function (pdf) {
       var totalPages = pdf.internal.getNumberOfPages();


       for (let i = 1; i <= totalPages; i++) {
         pdf.setPage(i);
         pdf.setFontSize(8);
         pdf.setTextColor(150);
         // pdf.text(15, 15, '[SULIT]');
         pdf.addImage(logo, "png", 180, 5, 5, 5);
         pdf.text(
           "Page :" + i + "/" + totalPages + "",
           pdf.internal.pageSize.getWidth() - 40,
           pdf.internal.pageSize.getHeight() - 8
         );
       }
     })
     .save();
 };


 function handleFilter(value) {
   const newData = data_finals.filter((row) => {
     return row.Calculated_Percentage >= value;
   });
   setRecords(newData);
   // console.table(newData, ["Image", "Calculated_Percentage"]);
 }
 function handleFilter_name(event) {
   const newData_name = orirecords.filter((row) =>
     row.Image.toLowerCase().includes(event.target.value.toLowerCase())
   );
   setData(newData_name);
   console.table(newData_name, ["Image", "Calculated_Percentage"]);
 }


 const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
     return (
       <div className="custom-tooltip">
         <p className="label">{`${label} : ${payload[0].value}`}</p>
         <p className="desc">
           <img
             height="84px"
             width="56px"
             src={"http://localhost:4000/folders/image/" + label}
           />
         </p>
       </div>
     );
   }


   return null;
 };


 const handlegobackClick = () => {
   history.push({
     pathname: "/imageanalysis",
   });
 };
 useEffect(() => {
   if (location.state && location.state.uploadedFileData) {
     const fileData = location.state.uploadedFileData[0]?.data; // assuming it's the first item


     if (fileData instanceof Blob) {
       const reader = new FileReader();
       reader.onload = function (e) {
         const binaryString = e.target.result;
         const workbook = XLSX.read(binaryString, { type: "binary" });
         const sheetName = workbook.SheetNames[0];
         const sheet = workbook.Sheets[sheetName];
         const parseData = XLSX.utils.sheet_to_json(sheet);
         setData(parseData);
         setoriRecords(parseData);
       };
       reader.readAsBinaryString(fileData);
     }
   }
 }, [location.state]);


 const MyDocument = () => (
   <Document>
     <Page size="A4" style={styles.page}>
       <View style={styles.section}>
         <Text>Section #1</Text>
       </View>
       <View style={styles.section}>
         <Text>Section #2</Text>
       </View>
     </Page>
   </Document>
 );


 const conditionalRowStyles = [
   {
     when: (row) =>
       row.Calculated_Percentage >= 100 ||
       row.Calculated_Percentage >=
         document.getElementById("input_percentage").value,
     style: {
       backgroundColor: "red",
       color: "white",
       "&:hover": {
         cursor: "pointer",
       },
     },
   },
   // You can also pass a callback to style for additional customization
 ];


 // console.table(selectedData, ["Image", "Calculated_Percentage"]);
 const handleChange = (state) => {
   setSelectedData(state.selectedRows);
 };


 const columns = [
   {
     name: "Name",
     id: "Image",
     selector: (row) => row.Image,
     minWidth: "40px",
     sortable: true,
     wrap: true,
     filterable: true,
   },
   {
     name: "Image_Display",
     grow: 0,
     cell: (row) => <img height="84px" width="56px" src={row.image_logo} />,
     wrap: true,
   },
   {
     name: "Calculated Percentage",
     id: "calculated_percentage",
     selector: (row) => row.Calculated_Percentage,
     sortable: true,
     wrap: true,
     filterable: true,
   },
 ];


 const downloadTxtFile = () => {
   // text content
   const texts = ["line 1", "line 2", "line 3"];
   // file object
   const file = new Blob(PDFViewer, { type: "text/plain" });
   // anchor link
   const element = document.createElement("a");
   element.href = URL.createObjectURL(file);
   element.download = "100ideas-" + Date.now() + ".txt";
   // simulate link click
   document.body.appendChild(element);
   // document.body.appendChild(data_finals);


   // Required for this to work in FireFox
   element.click();
 };
 createTheme(
   "solarized",
   {
     text: {
       primary: "#ffffff",
       secondary: "#2aa198",
     },
     background: {
       default: "rgba(10, 10, 10,0.2)",
     },
     context: {
       background: "rgba(10, 10, 10,0.2)",
       text: "#FFFFFF",
     },
     divider: {
       default: "rgba(10, 10, 10,0.2)",
     },
     action: {
       button: "rgba(0,0,0,.54)",
       hover: "rgba(0,0,0,.08)",
       disabled: "rgba(0,0,0,.12)",
     },
     width: "100%",
   },
   "dark"
 );
 const checkHandler = () => {
   setIsChecked(!isChecked);
 };
 const checkHandler_chart = () => {
   setIsChecked_chart(!isChecked_chart);
 };
 const checkHandler_table = () => {
   setIsChecked_table(!isChecked_table);
 };


 return (
   <div className="all">
     <div className="numbers">
       <label className="number_label font_label">
         Value of percentage to filter:
         <input
           id="input_percentage"
           type="number"
           max="100"
           min="0"
           defaultValue="60"
           onChange={handleFilter}
         />
       </label>
       <label className="number_label font_label">
         <input
           id="input_percentage"
           type="text"
           placeholder="Filter with image name"
           onChange={handleFilter_name}
         />
       </label>
       <label className="font_label">
         <input
           className="checkbox_table"
           type="checkbox"
           id="checkbox_table"
           checked={isChecked_table}
           onChange={checkHandler_table}
           disabled={selectedData.length >= 11 ? true : false}
         />{" "}
         Add Selected Table
       </label>
     </div>


     <div className="table_layout">
       <DataTable
         columns={columns}
         data={data_finals}
         conditionalRowStyles={conditionalRowStyles}
         selectableRows
         onSelectedRowsChange={handleChange}
         fixedHeader
         fixedHeaderScrollHeight="100%"
         fixedHeaderScrollWidth="100%"
         theme="solarized"
       ></DataTable>
       {/* {selectedData[0] ? selectedData[0].name : ''} */}
     </div>


     <div>
       <div className="radio_btn">
         <Text className="font_label">Select Chart Type :</Text>
         <input
           className="radio_button"
           id="Line_Chart"
           type="radio"
           value="Line_Chart"
           name="chart"
           checked={chart_type === "Line_Chart"}
           onChange={onOptionChange}
         />
         <label className="font_label" for="Line_Chart">
           Line Chart
         </label>
         <input
           className="radio_button"
           id="Bar_Chart"
           type="radio"
           value="Bar_Chart"
           name="chart"
           checked={chart_type === "Bar_Chart"}
           onChange={onOptionChange}
         />
         <label className="font_label" for="Bar_Chart">
           Bar Chart
         </label>
         <label className="font_label">
           <input
             className="checkbox_chart"
             type="checkbox"
             id="checkbox_chart"
             checked={isChecked_chart}
             onChange={checkHandler_chart}
             disabled={
               selectedData.length >= 1
                 ? selectedData.length >= 11
                   ? true
                   : false
                 : false
             }
           />
           Add Selected Chart
         </label>


         <ResponsiveContainer
           backgroundColor="green"
           height="40%"
           width="100%"
         >
           <div className="chart_layout">
             {/* <div onChange={this.onChangeValue}> */}


             {/* {console.console.log(getElementById)} */}
             {/* </div> */}
             {/* {this.onChangeValue} */}
             {chart_type == "Line_Chart" ? (
               <ComposedChart
                 className="line_graph"
                 width={600}
                 height={300}
                 data={selectedData}
                 // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
               >
                 <Legend />
                 <Line
                   dataKey="Calculated_Percentage"
                   stroke="#0095FF"
                   fill="white"
                   legendType="none"
                 />
                 <Scatter
                   dataKey="Calculated_Percentage"
                   stroke="#0095FF"
                   fill="white"
                   legendType="none"
                 >
                   {selectedData.map((entry, index) => (
                     <Cell
                       fill={
                         entry.Calculated_Percentage <
                         document.getElementById("input_percentage").value
                           ? "white"
                           : "red"
                       }
                     />
                   ))}
                 </Scatter>
                 <XAxis
                   dataKey="Image"
                   padding={{ left: 30, right: 30 }}
                   interval={0}
                   letterSpacing={0}
                   tickLine={true}
                   tick={{
                     textAnchor: "start",
                     dominantBaseline: "ideographic",
                     stroke: "white",
                   }}
                 />
                 <YAxis
                   unit="%"
                   type="number"
                   label={{
                     value: "Corrosion Percentage",
                     fill: "white",
                     angle: -90,
                     position: "insideBottomLeft",
                   }}
                   ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                   tick={{
                     stroke: "white",
                   }}
                 />
                 <Tooltip cursor={<CustomTooltip />} />
                 <Brush />
               </ComposedChart>
             ) : (
               <BarChart
                 className="line_graph"
                 width={750}
                 height={300}
                 data={selectedData}
                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
               >
                 <Legend />


                 <XAxis
                   dataKey="Image"
                   interval={0}
                   letterSpacing={0}
                   tickLine={false}
                   tick={{
                     angle: 0,
                     textAnchor: "start",
                     dominantBaseline: "ideographic",
                     stroke: "white",
                   }}
                 />
                 <YAxis
                   unit="%"
                   type="number"
                   label={{
                     value: "Corrosion Percentage",
                     fill: "white",
                     angle: -90,
                     position: "insideBottomLeft",
                   }}
                   ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                   tick={{
                     stroke: "white",
                   }}
                 />
                 <Tooltip content={<CustomTooltip />} />
                 <Brush />
                 <Bar dataKey="Calculated_Percentage" legendType="none">
                   {selectedData.map((entry, index) => (
                     <Cell
                       fill={
                         entry.Calculated_Percentage <
                         document.getElementById("input_percentage").value
                           ? "white"
                           : "red"
                       }
                     />
                   ))}
                 </Bar>
               </BarChart>
             )}
           </div>
         </ResponsiveContainer>
       </div>
     </div>


     <div className="pdf_render">
       <div className="input_field">
         <label className="font_label">
           Add Title:
           <input
             className="size"
             id="Title"
             type="text"
             placeholder="Corrosion Analysis report"
             onChange={(e) => setPostTitle(e.target.value)}
           />
         </label>
         <label className="font_label">
           Add Company Name:
           <input
             className="size"
             id="company_name"
             type="text"
             placeholder="qualITEAS inc."
             onChange={(e) => setPostCompany(e.target.value)}
           />
         </label>
         <label className="font_label">
           Add User Name:
           <input
             className="size"
             id="user_name"
             type="text"
             placeholder="qualITEAS inc."
             onChange={(e) => setPostName(e.target.value)}
           />
         </label>
       </div>


       <div className="pdf_view" id="pdf_view" ref={pdfRef}>
         <div className="innerdiv" id="innerdiv">
           <Document>
             <Page>
               {/* <img className="page_header" src={logo} /> */}
               <View className="display_view">
                 {/* style={styles.layout} */}
                 {/* <View className='display'> */}
                 <div className="report_header text_styles">
                   <Text className="date_Title">
                     <center>
                       <b>Title : {postTitle}</b>
                     </center>
                   </Text>
                   <br />
                   <Text className="date_text">
                     <b>Company Name : {postCompay}</b>
                   </Text>
                   <br />
                   <Text className="date_text">
                     <b>User Name : {postName}</b>
                   </Text>
                   <br />
                   <Text className="date_text">
                     <b>Date : {date}</b>
                   </Text>
                   <br />
                   <p></p>
                   <br />
                   {/* </View> */}
                   {/* <View className='display'> */}
                   <b>
                     <u>Analysis Outcome :</u>
                   </b>{" "}
                   <br />
                   <br />
                   Number of Processed Images : {data_finals.length} <br />
                   <br />
                   {/* Number of images with higer corrosion: {(data_finals.Calculated_Percentage>10).length} */}
                 </div>
                 {/* </View> */}
                 <br />
                 <center>
                   <table className="files_table_pdf">
                     <thead>
                       <tr>
                         <th>Image Name</th>
                         <th>Corrosion Percentage</th>
                         {/* <th>{selectedData.length}</th> */}
                       </tr>
                     </thead>
                     <tbody>
                       {data_finals.length > 0 ? (
                         data_finals.map(
                           ({ Image, Calculated_Percentage }) => (
                             <tr>
                               <td className="Name">{Image}</td>
                               <td className="Calculated Percentage">
                                 {Calculated_Percentage}
                               </td>
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
                   </table>
                 </center>
               </View>
             </Page>
             <div>
               <br />
               <p className="date_text_header">
                 <b>
                   <u>
                     {isChecked_table
                       ? "Comparison Table of selected images : "
                       : ""}
                   </u>
                 </b>
               </p>
               <center>
                 <p>
                   {isChecked_table ? (
                     <table className="files_table">
                       <thead>
                         <tr>
                           <th>Image Name</th>
                           <th>Corrosion Percentage</th>


                           {/* <th>{selectedData.length}</th> */}
                         </tr>
                       </thead>
                       <tbody>
                         {selectedData.length > 0 ? (
                           selectedData.map(
                             ({ Image, Calculated_Percentage }) => (
                               <tr>
                                 <td className="Name">{Image}</td>
                                 <td className="Calculated Percentage">
                                   {Calculated_Percentage}
                                 </td>
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
                     </table>
                   ) : (
                     ""
                   )}
                 </p>
               </center>
               <br />
               <p className="date_text_header">
                 <b>
                   <u>{isChecked_chart ? "Chart : " : ""}</u>
                 </b>
               </p>
               <center>
                 <p>
                   {isChecked_chart ? (
                     chart_type == "Line_Chart" ? (
                       <ComposedChart
                         className="line_graph"
                         width={500}
                         height={200}
                         data={selectedData}
                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                       >
                         <Legend />
                         <Line
                           dataKey="Calculated_Percentage"
                           stroke="#0095FF"
                           fill="black"
                           legendType="none"
                         />
                         <Scatter
                           dataKey="Calculated_Percentage"
                           stroke="#0095FF"
                           fill="black"
                           legendType="none"
                         >
                           {selectedData.map((entry, index) => (
                             <Cell
                               fill={
                                 entry.Calculated_Percentage <
                                 document.getElementById("input_percentage")
                                   .value
                                   ? "black"
                                   : "red"
                               }
                             />
                           ))}
                         </Scatter>
                         <XAxis
                           dataKey="Image"
                           padding={{ left: 30, right: 30 }}
                           interval={0}
                           letterSpacing={0}
                           tickLine={true}
                           tick={{
                             textAnchor: "start",
                             dominantBaseline: "ideographic",
                             stroke: "black",
                           }}
                         />
                         <YAxis
                           unit="%"
                           type="number"
                           label={{
                             value: "Corrosion Percentage",
                             fill: "black",
                             angle: -90,
                             position: "insideBottomLeft",
                           }}
                           ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                           tick={{
                             stroke: "black",
                           }}
                         />
                       </ComposedChart>
                     ) : (
                       <BarChart
                         className="line_graph"
                         width={500}
                         height={200}
                         data={selectedData}
                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                       >
                         <Legend />


                         <XAxis
                           dataKey="Image"
                           interval={0}
                           letterSpacing={0}
                           tickLine={false}
                           tick={{
                             angle: 0,
                             textAnchor: "start",
                             dominantBaseline: "ideographic",
                             stroke: "black",
                           }}
                         />
                         <YAxis
                           unit="%"
                           type="number"
                           label={{
                             value: "Corrosion Percentage",
                             fill: "black",
                             angle: -90,
                             position: "insideBottomLeft",
                           }}
                           ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                           tick={{
                             stroke: "black",
                           }}
                         />
                         <Bar
                           dataKey="Calculated_Percentage"
                           legendType="none"
                         >
                           {selectedData.map((entry, index) => (
                             <Cell
                               fill={
                                 entry.Calculated_Percentage <
                                 document.getElementById("input_percentage")
                                   .value
                                   ? "black"
                                   : "red"
                               }
                             />
                           ))}
                         </Bar>
                       </BarChart>
                     )
                   ) : (
                     ""
                   )}
                 </p>
               </center>
               <p></p>
               <p></p>
               <p></p>
               <p className="note_text_header">{isChecked ? "Note:" : ""} </p>
               <p className="note_text">{isChecked ? postContent : ""} </p>
             </div>
           </Document>
         </div>
       </div>


       <label className="add_note">
         <input
           className="checkbox_data"
           type="checkbox"
           id="checkbox"
           checked={isChecked}
           onChange={checkHandler}
         />
         <label className="labelforcheckbox" for="checkbox">
           {" "}
           Add Note To Your Document:{" "}
         </label>


         <textarea
           className="note_section"
           name="postContent"
           onChange={(e) => setPostContent(e.target.value)}
         />
       </label>
       <div className="download_position">
         <div>
           <button onClick={handleCaptureClick}>Capture as PNG</button>
           <button onClick={downloadImage} disabled={!pngBlob}>
             Download Image
           </button>
           {pngBlob && (
             <p>Image captured. Check console for the blob object.</p>
           )}
           <button onClick={aiImageRun} className="ai_analysis_button">
             Analyze Image with AI
           </button>
         </div>
         <button
           className="download_button"
           id="downloadBtn"
           onClick={downloadPdfDocument}
           value="download"
         >
           Download
         </button>
       </div>
     </div>
     <div className="btnDiv">
       <div className="App">
         {/* <input  className="file_upload"
               type="file"
               accept=".xlsx, .xls"
               onChange={handleFileUpload}
               />       
           <button className="add_chart_button" onClick={addchartpdf} disabled={selectedData.length >= 11 ? true : false}>
           Add chart
           </button> */}


         <button
           className="goback_button"
           id="go_back_button"
           onClick={handlegobackClick}
         >
           Go Back
         </button>
       </div>
     </div>
   </div>
 );
}


export { dashboard_analysis };
