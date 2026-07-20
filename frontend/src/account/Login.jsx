// import React from "react";
// import { Link } from "react-router-dom";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";

// import { accountService, alertService } from "@/_services";
// import Alert from "react-bootstrap/Alert";
// import "./Login.css";

// function Login({ history, location }) {
//   const initialValues = {
//     email: "",
//     password: "",
//   };

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Email is invalid").required("Email is required"),
//     password: Yup.string().required("Password is required"),
//   });

//   function onSubmit({ email, password }, { setSubmitting }) {
//     alertService.clear();
//     accountService
//       .login(email, password)
//       .then(() => {
//         const { from } = location.state || { from: { pathname: "/" } };
//         history.push(from);
//       })
//       .catch((error) => {
//         setSubmitting(false);
//         alertService.error(error);
//       });
//   }

//   return (
//     <div className="content-wrapper">
//       {/* <div className="object-laptop">
//         <div className="screen">
//           <div className="lcd">
//             <img src="https://picsum.photos/800/500" alt="" />
//           </div>
//           <div className="gloss"></div>
//           <div className="reflexion"></div>
//           <div className="highlight one"></div>
//           <div className="highlight two"></div>
//         </div>
//         <div className="keyboard one"></div>
//         <div className="keyboard two"></div>
//       </div> */}
//       <div className="form-section">
//         <Alert variant="success">
//           <Alert.Heading>
//             <b>
//               {" "}
//               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome
//               to Argus1.21 (Above-the-Water)
//             </b>
//           </Alert.Heading>
//         </Alert>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={onSubmit}
//         >
//           {({ errors, touched, isSubmitting }) => (
//             <Form>
//               <h3 className="card-header">Login</h3>
//               <div className="card-body">
//                 <div className="form-group">
//                   <label>Email</label>
//                   <Field
//                     name="email"
//                     type="text"
//                     className={
//                       "form-control" +
//                       (errors.email && touched.email ? " is-invalid" : "")
//                     }
//                   />
//                   <ErrorMessage
//                     name="email"
//                     component="div"
//                     className="invalid-feedback"
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Password</label>
//                   <Field
//                     name="password"
//                     type="password"
//                     className={
//                       "form-control" +
//                       (errors.password && touched.password ? " is-invalid" : "")
//                     }
//                   />
//                   <ErrorMessage
//                     name="password"
//                     component="div"
//                     className="invalid-feedback"
//                   />
//                 </div>
//                 <div className="form-row">
//                   <div className="form-group col">
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="btn btn-primary"
//                     >
//                       {isSubmitting && (
//                         <span className="spinner-border spinner-border-sm mr-1"></span>
//                       )}
//                       Login
//                     </button>
//                     <Link to="register" className="btn btn-link">
//                       Register
//                     </Link>
//                   </div>
//                   <div className="form-group col text-right">
//                     <Link to="forgot-password" className="btn btn-link pr-0">
//                       Forgot Password?
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Formik>

//         <Alert variant="success">
//           <Alert.Heading>
//             <b>About Argus (version 1.21)</b>
//           </Alert.Heading>
//           <p>
//             Argus is a cloud-based SaaS application, powered by a machine
//             learning based computer vision technology, capable of analyzing
//             structural images and detecting corrosion that may be taking place
//             in the structure
//           </p>
//         </Alert>
//       </div>
//     </div>
//   );
// }

// export { Login };

import React from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { accountService, alertService } from "@/_services";
import Alert from "react-bootstrap/Alert";
import "./Login.css";
import image from "../q0123.png";
function Login({ history, location }) {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  function onSubmit({ email, password }, { setSubmitting }) {
    alertService.clear();
    accountService
      .login(email, password)
      .then(() => {
        const { from } = location.state || { from: { pathname: "/" } };
        history.push(from);
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  return (
    <div className="content-wrapper">
      <div className="object-laptop">
        <div className="screen">
          <div className="lcd">
            <img src={image} className="image_size"/>
          </div>
          <div className="gloss"></div>
          <div className="reflexion"></div>
          <div className="highlight one"></div>
          <div className="highlight two"></div>
        </div>
        <div className="keyboard one"></div>
        <div className="keyboard two"></div>
        <div className="text">
          <br></br>Computer Vison based AI-technology for detecting
          corrosion-mediated damges
        </div>
      </div>
      <div className="form-section">
        {/* <Alert variant="success">
          <Alert.Heading>
            <b>
              {" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome
              to Argus1.21 (Above-the-Water)
            </b>
          </Alert.Heading>
        </Alert> */}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="login_info">
              <h3 className="card-header">Login</h3>
              <div className="card-body">
                <div className="form-group">
                  <label>Email</label>
                  <Field
                    name="email"
                    type="text"
                    className={
                      "form-control" +
                      (errors.email && touched.email ? " is-invalid" : "")
                    }
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <Field
                    name="password"
                    type="password"
                    className={
                      "form-control" +
                      (errors.password && touched.password ? " is-invalid" : "")
                    }
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="invalid-feedback"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group col">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn_login"
                    >
                      {isSubmitting && (
                        <span className="spinner-border spinner-border-sm mr-1"></span>
                      )}
                      Login
                    </button>
                    <Link to="register" className="btn btn-link">
                      Register
                    </Link>
                  </div>
                  <div className="form-group col text-right">
                    <Link to="forgot-password" className="btn btn-link pr-0">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {/* <Alert variant="success">
          <Alert.Heading>
            <b>About Argus (version 1.21)</b>
          </Alert.Heading>
          <p>
            Argus is a cloud-based SaaS application, powered by a machine
            learning based computer vision technology, capable of analyzing
            structural images and detecting corrosion that may be taking place
            in the structure
          </p>
        </Alert> */}
      </div>
    </div>
  );
}

export { Login };
