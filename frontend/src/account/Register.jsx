import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";
import { accountService, alertService } from "@/_services";
import TermsModal from "./TermsModal";
function Register({ history }) {
  const [termsContent, setTermsContent] = useState("");
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  useEffect(() => {
    fetch("http://localhost:4000/files/terms-and-conditions")
      .then((response) => response.text())
      .then((data) => {
        setTermsContent(data);
      });
  }, []);
  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    organization: "",
    designation: "",
    country: "",
  };
  function openTermsModal() {
    setIsTermsModalOpen(true);
  }

  function closeTermsModal() {
    setIsTermsModalOpen(false);
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    organization: Yup.string().required("Organization is required"),
    designation: Yup.string().required("Designation is required"),
    country: Yup.string().required("Country is required"),

    password: Yup.string()
      //   .min(6, "Password must be at least 6 characters")
      .required("Password is required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    acceptTerms: Yup.bool().oneOf(
      [true],
      "Accept Terms & Conditions is required"
    ),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    accountService
      .register(fields)
      .then(() => {
        alertService.success(
          "Registration successful, please check your email for verification instructions",
          { keepAfterRouteChange: true }
        );
        history.push("login");
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      });
  }

  return (
    <div className="content-wrapper-register">
      <div className="object-laptop ">
        <div className="screen">
          <div className="lcd">
            <img src="https://picsum.photos/800/500" alt="" />
          </div>
          <div className="gloss"></div>
          <div className="reflexion"></div>
          <div className="highlight one"></div>
          <div className="highlight two"></div>
        </div>
        <div className="keyboard one"></div>
        <div className="keyboard two"></div>
        <div className="text">
          <center>
          <br></br>Computer Vison based AI-technology for detecting
          corrosion-mediated damges
          </center>
        </div>
        </div>
      <div className="register_info">
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      
      {({ errors, touched, isSubmitting }) => (
        
        

        <Form >
          <h3 className="card-header">Register</h3>
          <div className="card-body-register">
            <div className="form-row">
              <div className="form-group col">
                <label>Title</label>
                <Field
                  name="title"
                  as="select"
                  className={
                    "form-control" +
                    (errors.title && touched.title ? " is-invalid" : "")
                  }
                >
                  <option value=""></option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                </Field>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col-5">
                <label>First Name</label>
                <Field
                  name="firstName"
                  type="text"
                  className={
                    "form-control" +
                    (errors.firstName && touched.firstName ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col-5">
                <label>Last Name</label>
                <Field
                  name="lastName"
                  type="text"
                  className={
                    "form-control" +
                    (errors.lastName && touched.lastName ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
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
            <div className="form-row">
              <div className="form-group col">
                <label>Organization</label>
                <Field
                  name="organization"
                  type="text"
                  className={
                    "form-control" +
                    (errors.organization && touched.organization
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="organization"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col">
                <label>Designation</label>
                <Field
                  name="designation"
                  type="text"
                  className={
                    "form-control" +
                    (errors.designation && touched.designation
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="designation"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
              <div className="form-group col">
                <label>Country</label>
                <Field
                  name="country"
                  type="text"
                  className={
                    "form-control" +
                    (errors.country && touched.country ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="country"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
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
              <div className="form-group col">
                <label>Confirm Password</label>
                <Field
                  name="confirmPassword"
                  type="password"
                  className={
                    "form-control" +
                    (errors.confirmPassword && touched.confirmPassword
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="invalid-feedback"
                />
              </div>
            </div>
            <div className="form-group form-check">
              <Field
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                className={
                  "form-check-input " +
                  (errors.acceptTerms && touched.acceptTerms
                    ? " is-invalid"
                    : "")
                }
              />
              <label htmlFor="acceptTerms" className="form-check-label">
                Accept{" "}
                <span className="terms-link" onClick={openTermsModal}>
                  Terms & Conditions
                </span>
              </label>
              <TermsModal
                isOpen={isTermsModalOpen}
                toggleModal={closeTermsModal}
                content={termsContent}
              />
              <ErrorMessage
                name="acceptTerms"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn_register"
              >
                {isSubmitting && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
                Register
              </button>
              <Link to="login" className="btn btn-link">
                Cancel
              </Link>
            </div>
          </div>
        </Form>
      
      )}
    </Formik>
    </div>
    </div>
  );
}

export { Register };
