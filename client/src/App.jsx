import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TutorSignIn from "./pages/TutorSignIn";
import HomePage from "./pages/homePage";
import { useSelector } from "react-redux";

function App() {
  // const mode = useSelector((state) => state.mode);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    // <div className="app">
    //   <BrowserRouter>
    //     {/* <ThemeProvider theme={theme}> */}
    //       {/* <CssBaseline /> */}
    //       <Routes>
    //         <Route path="/" element={<LoginPage />} />
    //         <Route
    //           path="/home"
    //           element={isAuth ? <HomePage /> : <Navigate to="/" />}
    //         />
    //         <Route
    //           path="/profile/:userId"
    //           element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
    //         />
    //       </Routes>
    //     {/* </ThemeProvider> */}
    //   </BrowserRouter>
    // </div>

    /*
      Here I have disabled authentication check for development purpose only
      Above given code has the auth check after the ui works done we can remove below code
      use the above code
    */
    <div className="app">
      <BrowserRouter>
        {/* <ThemeProvider theme={theme}> */}
        {/* <CssBaseline /> */}
        <Routes>
          <Route path="/" element={<TutorSignIn />} />
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route
            path="/home"
            element={isAuth ? <HomePage /> : <Navigate to="/" />}
          />
          {/* <Route
            path="/profile"
            element={<ProfilePage />}
          /> */}
        </Routes>
        {/* </ThemeProvider> */}
      </BrowserRouter>
    </div>
  )
}

export default App
