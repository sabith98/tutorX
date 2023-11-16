import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../state";
import Dropzone from "react-dropzone";
import axios from "axios";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("firstname is required"),
  lastName: yup.string().required("lastname is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  // password: yup.string().required("Password is required"),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  // location: yup.string().required("required"),
  // occupation: yup.string().required("required"),
  // picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  // location: "",
  // occupation: "",
  // picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const TutorSignIn = () => {
  const [pageType, setPageType] = useState("register");
  const [authError, setAuthError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  useEffect(() => {
    let timer;
    if (authError) {
      timer = setTimeout(() => {
        setAuthError(null);
      }, 3000);
    }

    // Cleanup the timer if the component unmounts or if authError changes
    return () => clearTimeout(timer);
  }, [authError]);

  const register = async (values, { resetForm }) => {
    // this allows us to send form info with image
    await axios.post('/auth/register', JSON.stringify(values))
      .then(() => {
        resetForm();
        setPageType('login')
      })
      .catch((error) => {
        console.log(error)
        setAuthError(error.response.data.msg)
      })
  };

  const login = async (values, { resetForm }) => {
    // const loggedInResponse = await fetch("http://localhost:6001/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(values),
    // });
    await axios.post('/auth/login', JSON.stringify(values))
      .then((loggedIn) => {
        resetForm();
        dispatch(
          setLogin({
            user: loggedIn.data.user,
            token: loggedIn.data.token,
          })
        );
        navigate("/home");
      })
      .catch((error) => {
        console.log(error.response.data.msg)
        setAuthError(error.response.data.msg)
      })

    // const loggedIn = await loggedInResponse.json();
    // onSubmitProps.resetForm();
    // if (loggedIn) {
    //   dispatch(
    //     setLogin({
    //       user: loggedIn.user,
    //       token: loggedIn.token,
    //     })
    //   );
    //   navigate("/home");
    // }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <div className="w-full h-full overflow-hidden flex flex-row items-start justify-center pt-7 box-border bg-[url('./assets/auth-bg.png')] bg-cover bg-no-repeat bg-[top] text-left text-[40px] text-white font-noticia-text">
      <div className="w-[580px] flex flex-col items-center justify-start px-0 pb-0 box-border gap-[24px] max-w-[580px]">
        <b className="leading-[32px] ">TutorX</b>
        <div className="rounded-[25px] bg-white w-[580px] h-full flex flex-col items-start justify-start pt-14 px-[72px] pb-[58px] box-border text-[25px] text-darkslategray font-noto-sans">
          <div className="w-[436px]">
            {isLogin ? (
              <div className="w-[436px] flex flex-col items-start justify-start gap-[8px] mb-4">
                <div className="w-[436px] flex flex-row items-start justify-start py-0 pr-[228px] pl-0 box-border">
                  <b className="relative leading-[40px]">Tutor Sign In</b>
                </div>
                <div className="flex flex-row flex-wrap items-start justify-start gap-[3px] text-sm text-gray-100">
                  <p className="m-0 relative leading-[24px]">
                    Sign In your TutorX account . If you are a new Tutor
                  </p>
                  <button
                    onClick={() => setPageType('register')}
                    className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-sm leading-[24px] font-semibold font-noto-sans text-royalblue text-left inline-block"
                  >
                    SignUp
                  </button>
                  <p className="m-0 relative leading-[24px]">here</p>
                </div>
              </div>
            ) : (
              <div className="w-[436px] flex flex-col items-start justify-start gap-[8px] mb-4">
                <div className="w-[436px] flex flex-row items-start justify-start py-0 pr-[228px] pl-0 box-border">
                  <b className="relative leading-[40px]">Tutor Sign Up</b>
                </div>
                <div className="flex flex-row flex-wrap items-start justify-start gap-[3px] text-sm text-gray-100">
                  <p className="m-0 relative leading-[24px]">
                    Create a new TutorX account. Already a Tutor?
                  </p>
                  <button
                    onClick={() => setPageType('login')}
                    className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-sm leading-[24px] font-semibold font-noto-sans text-royalblue text-left inline-block"
                  >
                    SignIn
                  </button>
                  <p className="m-0 relative leading-[24px]">here</p>
                </div>
              </div>
            )}

            <Formik
              onSubmit={handleFormSubmit}
              initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
              validationSchema={isLogin ? loginSchema : registerSchema}
            >
              {
                ({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  resetForm,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-start justify-start gap-[21px]">
                      {isRegister && (
                        <>
                          <div>
                            <div className="w-[436px] flex flex-row items-start justify-start pt-0 px-0 box-border">
                              <input
                                className={"[border:none] font-noto-sans text-base bg-whitesmoke flex-1 rounded-md shadow-[0px_1px_2px_rgba(0,_0,_0,_0.08)_inset] flex flex-row items-start justify-start py-[16.5px] px-6 border-b-[3px] border-solid border-gray-200"}
                                placeholder={"First name"}
                                type="text"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.firstName}
                                name="firstName"
                              />
                            </div>
                            {touched.firstName && errors.firstName && (
                              <p className="flex justify-start my-0 text-sm text-red-600 dark:text-red-500"><span className="font-medium">{errors.firstName}</span></p>
                            )}
                          </div>

                          <div>
                            <div className="w-[436px] flex flex-row items-start justify-start pt-0 px-0 pb-[3px] box-border">
                              <input
                                className="[border:none] font-noto-sans text-base bg-whitesmoke flex-1 rounded-md shadow-[0px_1px_2px_rgba(0,_0,_0,_0.08)_inset] flex flex-row items-start justify-start py-[16.5px] px-6 border-b-[3px] border-solid border-gray-200"
                                placeholder="Last name"
                                type="text"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lastName}
                                name="lastName"
                              />
                            </div>
                            {touched.lastName && errors.lastName && (
                              <p className="flex justify-start my-0 text-sm text-red-600 dark:text-red-500"><span className="font-medium">{errors.lastName}</span></p>
                            )}
                          </div>
                        </>
                      )}
                      <div>
                        <div className="w-[436px] flex flex-row items-start justify-start pt-0 px-0 pb-[3px] box-border">
                          <input
                            className="[border:none] font-noto-sans text-base bg-whitesmoke flex-1 rounded-md shadow-[0px_1px_2px_rgba(0,_0,_0,_0.08)_inset] flex flex-row items-start justify-start py-[16.5px] px-6 border-b-[3px] border-solid border-gray-200"
                            placeholder="Email"
                            type="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name="email"
                          />
                        </div>
                        {touched.email && errors.email && isRegister && (
                          <p className="flex justify-start my-0 text-sm text-red-600 dark:text-red-500"><span className="font-medium">{errors.email}</span></p>
                        )}
                      </div>
                      <div>
                        <div className="w-[436px] flex flex-row items-start justify-start pt-0 px-0 pb-[3px] box-border">
                          <input
                            className="[border:none] font-noto-sans text-base bg-whitesmoke flex-1 rounded-md shadow-[0px_1px_2px_rgba(0,_0,_0,_0.08)_inset] flex flex-row items-start justify-start py-[16.5px] px-6 border-b-[3px] border-solid border-gray-200"
                            placeholder="Password"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            name="password"
                          />
                        </div>
                        {touched.password && errors.password && isRegister && (
                          <p className="flex justify-start my-0 text-sm text-red-600 dark:text-red-500"><span className="font-medium">{errors.password}</span></p>
                        )}
                      </div>
                      {authError && (
                        <div className="w-[406px] bg-red-100 border border-red-400 text-red-700 text-sm px-4 py-3 rounded relative" role="alert">
                          {/* <strong className="font-bold">Holy smokes!</strong> */}
                          <span className="block sm:inline">{authError}</span>
                          <span onClick={() => setAuthError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                          </span>
                        </div>
                      )}
                      <input
                        type={"submit"}
                        // type="button"
                        // onClick={handleFormSubmit}
                        // onClick={() => console.log(Formik)}
                        disabled={isSubmitting}
                        className="cursor-pointer pt-[15px] pb-[13px] pr-[184.5px] pl-[183.5px] bg-chocolate rounded-[28px] box-border w-[436px] flex flex-row items-start justify-center border-[1px] border-solid border-chocolate"
                        title="Sign In"
                      />
                      {/* Continue */}
                      {/* <div className="relative text-base leading-[24px] font-semibold font-noto-sans text-black text-center">
                        Continue
                      </div> */}
                      {/* </input> */}
                    </div>
                  </form>
                )}
            </Formik>
            <div className="w-[480.78px] h-[239px] text-sm text-dimgray">
              <div className="m-0 w-[calc(100%_-_40px)] box-border flex flex-row items-start justify-start pt-[17px] pb-1 pr-[46.779998779296875px] pl-0 border-t-[1px] border-solid border-whitesmoke">
                <p className="m-0 relative leading-[24px] font-bold">
                  <span className="block">
                    Centralized platform that enables efficient connections
                  </span>
                  <span className="block">and interactions.</span>
                </p>
              </div>
              <div className="m-0 w-[calc(100%_-_40.78px)] flex flex-col items-start justify-start pt-0 pb-px pr-[24.779998779296875px] pl-0 box-border text-[12px]">
                <p className="m-0 relative leading-[20px] flex items-center w-[440px]">
                  This Our Tutor-Student Interaction Platform combines the best
                  of two worlds, allowing tutors to post videos and engage with
                  students directly, fostering a more engaging and effective
                  learning experience.
                </p>
              </div>
              {isLogin ? (
                <div className="w-[580px] flex flex-row items-start justify-start py-5 pr-[226px] pl-0 box-border text-smi text-gray-100">
                  <div className="flex flex-row items-start justify-start gap-[3px]">
                    <p className="m-0 relative leading-[24px]">{`Are you a Student? `}</p>
                    <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-smi leading-[24px] font-noto-sans text-left inline-block">
                      <span className="text-mediumblue">
                        Sign In your Student account.
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-[580px] flex flex-row items-start justify-start py-5 pr-[226px] pl-0 box-border text-smi text-gray-100">
                  <div className="flex flex-row items-start justify-start gap-[3px]">
                    <p className="m-0 relative leading-[24px]">{`Are you a Student? `}</p>
                    <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative text-smi leading-[24px] font-noto-sans text-left inline-block">
                      <span className="text-mediumblue">
                        Create a Student account.
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorSignIn;

